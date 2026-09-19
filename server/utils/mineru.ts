/**
 * MinerU API 客户端
 */
import { readFile } from 'node:fs/promises'

const MINERU_BASE = process.env.MINERU_API_URL || 'http://10.1.0.75:8002'

export async function parseWithMinerU(filePath: string, fileName: string) {
  const fileBuffer = await readFile(filePath)
  const blob = new Blob([fileBuffer], { type: 'application/pdf' })

  const form = new FormData()
  form.append('files', blob, fileName)

  const res = await fetch(`${MINERU_BASE}/file_parse`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(300_000)
  })

  if (!res.ok) {
    throw new Error(`MinerU API 错误: HTTP ${res.status}`)
  }

  const data = await res.json() as any

  // 异步任务，轮询
  if (data.task_id && data.status !== 'completed') {
    return await pollMinerUTask(data.task_id, fileName)
  }

  return normalizeMinerUResult(data, fileName)
}

async function pollMinerUTask(taskId: string, fileName: string) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000))
    const res = await fetch(`${MINERU_BASE}/tasks/${taskId}`)
    if (!res.ok) continue
    const data = await res.json() as any
    if (data.status === 'completed') {
      const resultRes = await fetch(`${MINERU_BASE}/tasks/${taskId}/result`)
      if (resultRes.ok) return normalizeMinerUResult(await resultRes.json(), fileName)
      throw new Error('获取 MinerU 结果失败')
    }
    if (data.status === 'failed') throw new Error('MinerU 处理失败: ' + (data.error || ''))
  }
  throw new Error('MinerU 处理超时')
}

function normalizeMinerUResult(raw: any, _fileName: string) {
  const results = raw.results || {}
  const firstKey = Object.keys(results)[0] || ''
  const fileResult = results[firstKey] || raw

  return {
    markdown: fileResult.md_content || fileResult.content || fileResult.markdown || '',
    json_content: typeof fileResult.json === 'object' ? JSON.stringify(fileResult.json) : (fileResult.json || ''),
    images: fileResult.images || [],
  }
}