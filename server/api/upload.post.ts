/**
 * POST /api/upload — 上传文件并调用 MinerU
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { parseWithMinerU } from '../utils/mineru'
import { tasks, results, activeJobs } from '../utils/store'

const UPLOADS_DIR = join(process.cwd(), 'uploads')

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  if (!form?.length) throw createError({ statusCode: 400, message: '没有文件' })

  const fileField = form.find(f => f.name === 'file')
  const sessionField = form.find(f => f.name === 'session_id')

  if (!fileField?.filename) throw createError({ statusCode: 400, message: '未选择文件' })

  const fileName = fileField.filename
  const sessionId = sessionField?.data?.toString() || 'guest'
  const fileId = randomUUID().slice(0, 12)
  const safeName = fileName.replace(/[^a-zA-Z0-9._\-\u4e00-\u9fa5]/g, '_')

  await mkdir(UPLOADS_DIR, { recursive: true })
  const filePath = join(UPLOADS_DIR, `${sessionId}_${fileId}_${safeName}`)
  await writeFile(filePath, fileField.data)

  tasks.set(fileId, {
    file_id: fileId,
    original_name: fileName,
    status: 'processing',
    progress: 10,
    progress_message: '正在上传...',
    created_at: new Date().toISOString(),
    session_id: sessionId,
  })

  // 后台处理，Promise 保存在 activeJobs 防止被 GC
  const job = processFile(fileId, filePath, fileName)
  activeJobs.set(fileId, job)
  job.finally(() => activeJobs.delete(fileId))

  return { file_id: fileId, status: 'processing', markdown: '', metadata: { original_name: fileName } }
})

async function processFile(fileId: string, filePath: string, fileName: string) {
  try {
    const task = tasks.get(fileId)
    if (!task) return
    task.progress = 30
    task.progress_message = 'MinerU 正在解析版面...'

    const result = await parseWithMinerU(filePath, fileName)

    results.set(fileId, {
      file_id: fileId,
      status: 'completed',
      markdown: result.markdown,
      json_content: result.json_content,
      images: result.images,
    })

    task.status = 'completed'
    task.progress = 100
    task.progress_message = '✅ 完成'
  } catch (e: any) {
    const task = tasks.get(fileId)
    if (task) {
      task.status = 'failed'
      task.progress_message = '❌ ' + (e.message || '解析失败')
    }
    results.set(fileId, { file_id: fileId, status: 'failed', error_message: e.message })
  }
}