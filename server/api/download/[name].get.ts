/**
 * GET /api/download/[name] — 下载文件
 */
import { readFile, access } from 'node:fs/promises'
import { join, basename } from 'node:path'

const OUTPUTS_DIR = join(process.cwd(), 'outputs')
const UPLOADS_DIR = join(process.cwd(), 'uploads')

const MIME_MAP: Record<string, string> = {
  md: 'text/markdown; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  html: 'text/html; charset=utf-8',
  json: 'application/json; charset=utf-8',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) throw createError({ statusCode: 400, message: '文件名不能为空' })
  
  // 防止路径穿越
  const safeName = basename(name)
  
  for (const dir of [OUTPUTS_DIR, UPLOADS_DIR]) {
    const path = join(dir, safeName)
    try {
      await access(path)
      const content = await readFile(path)
      const ext = safeName.split('.').pop()?.toLowerCase() || ''
      setHeader(event, 'Content-Type', MIME_MAP[ext] || 'application/octet-stream')
      setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`)
      setHeader(event, 'Cache-Control', 'no-cache')
      return content
    } catch { /* 文件不在该目录 */ }
  }
  
  throw createError({ statusCode: 404, message: '文件不存在' })
})