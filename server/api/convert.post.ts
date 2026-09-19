/**
 * POST /api/convert — 格式转换
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { results } from '../utils/store'

const OUTPUTS_DIR = join(process.cwd(), 'outputs')

export default defineEventHandler(async (event) => {
  const { file_id, target_format } = await readBody(event)
  const result = results.get(file_id)
  if (!result?.markdown) throw createError({ statusCode: 404, message: '无解析结果' })

  const markdown: string = result.markdown
  await mkdir(OUTPUTS_DIR, { recursive: true })

  if (target_format === 'md') {
    return { file_id, format: 'md', content: markdown, download_url: `/api/download/${file_id}.md` }
  }
  if (target_format === 'txt') {
    const text = markdown.replace(/[#*`[\]]/g, '').trim()
    return { file_id, format: 'txt', content: text, download_url: `/api/download/${file_id}.txt` }
  }
  if (target_format === 'html') {
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.8}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}pre{background:#1e293b;color:#e2e8f0;padding:1em;border-radius:8px}</style></head><body>' + markdown + '</body></html>'
    return { file_id, format: 'html', content: html, download_url: `/api/download/${file_id}.html` }
  }
  if (target_format === 'json') {
    const json = result.json_content || markdown
    return { file_id, format: 'json', content: json, download_url: `/api/download/${file_id}.json` }
  }
  if (target_format === 'docx') {
    try {
      const { execSync } = await import('node:child_process')
      const tmpMd = join(OUTPUTS_DIR, `${file_id}.md`)
      const outDocx = join(OUTPUTS_DIR, `${file_id}.docx`)
      await writeFile(tmpMd, markdown, 'utf-8')
      execSync(`pandoc "${tmpMd}" -o "${outDocx}" --from=markdown --to=docx`, { timeout: 30000 })
      return { file_id, format: 'docx', content: '', download_url: `/api/download/${file_id}.docx` }
    } catch {
      await writeFile(join(OUTPUTS_DIR, `${file_id}.docx.txt`), markdown, 'utf-8')
      return { file_id, format: 'docx', content: markdown, download_url: `/api/download/${file_id}.docx.txt` }
    }
  }
  throw createError({ statusCode: 400, message: '不支持的格式: ' + target_format })
})