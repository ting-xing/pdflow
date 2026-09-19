/**
 * DELETE /api/history — 删除历史记录 (POST body: {sessionId, fileId})
 */
import { tasks, results } from '../utils/store'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { sessionId, fileId } = body || {}

  const task = tasks.get(fileId)
  if (!task || task.session_id !== sessionId) {
    throw createError({ statusCode: 404, message: '记录不存在' })
  }

  tasks.delete(fileId)
  results.delete(fileId)

  const { unlink, readdir } = await import('node:fs/promises')
  const { join } = await import('node:path')
  for (const dir of [join(process.cwd(), 'uploads'), join(process.cwd(), 'outputs')]) {
    try {
      const files = await readdir(dir)
      for (const f of files) {
        if (f.includes(fileId)) await unlink(join(dir, f)).catch(() => {})
      }
    } catch { /* 目录不存在则跳过 */ }
  }

  return { ok: true }
})