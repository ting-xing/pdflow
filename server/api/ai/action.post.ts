/**
 * POST /api/ai/action — AI 预设动作
 */
import { results } from '../../utils/store'

const LLM_URL = process.env.LLM_API_URL || 'https://new-api.core.codeon.cn/v1/chat/completions'
const LLM_KEY = process.env.LLM_API_KEY || 'sk-ly2AOrvKjWf3rLlI8f6ngLmn5XEONGrPJ3Cm4qZXM0IWEy1V'
const LLM_MODEL = process.env.LLM_MODEL || 'Qwen3.8-27B-FP8'

const PROMPTS: Record<string, string> = {
  one_sentence: '请用一句话（不超过50字）概括以下文档的核心内容。\n\n文档：\n{content}\n\n一句话概括：',
  three_part: '请从以下文档中提取三段内容：1) 背景/目的 2) 核心内容/数据 3) 结论/建议。每段不超过150字。\n\n文档：\n{content}\n\n三段式摘要：',
  keywords: '请从以下文档中提取 5-10 个关键词或标签，以逗号分隔。\n\n文档：\n{content}\n\n关键词：',
  contract: '请从以下文档中提取合同要素，以 JSON 格式返回：{"甲方":"","乙方":"","金额":"","期限":"","违约责任":"","管辖地":""}。找不到填"未提及"。\n\n文档：\n{content}\n\nJSON：',
  todos: '请从以下文档中识别所有待办事项或需要执行的行动，以列表形式列出。\n\n文档：\n{content}\n\n待办事项：',
  translate_zh: '请将以下文档翻译为中文，保留 Markdown 格式、表格和代码块。\n\n文档：\n{content}\n\n中文翻译：',
  translate_en: 'Please translate the following document into English, preserving Markdown format, tables, and code blocks.\n\nDocument:\n{content}\n\nEnglish translation:',
  polish: '请改善以下文档的表达，修正语法错误，统一术语风格，使文字更流畅专业。保持 Markdown 格式。\n\n文档：\n{content}\n\n润色后：',
  paper_speed: '请按以下格式速读这篇论文：1) 研究问题 2) 方法 3) 实验结果 4) 主要贡献。每项不超过100字。\n\n论文：\n{content}\n\n论文速读：',
  timeline: '请从以下文档中按时间顺序梳理所有事件，以时间线形式列出。\n\n文档：\n{content}\n\n时间线：',
}

export default defineEventHandler(async (event) => {
  const { file_id, action } = await readBody(event)
  const result = results.get(file_id)
  if (!result?.markdown) throw createError({ statusCode: 404, message: '无解析结果' })

  const prompt = PROMPTS[action]
  if (!prompt) throw createError({ statusCode: 400, message: '未知 AI 操作: ' + action })

  const content = result.markdown.slice(0, 8000)
  const finalPrompt = prompt.replace('{content}', content)

  const res = await fetch(LLM_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${LLM_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: LLM_MODEL, messages: [{ role: 'user', content: finalPrompt }], max_tokens: 2000, temperature: 0.3 }),
    signal: AbortSignal.timeout(120_000)
  })

  if (!res.ok) throw createError({ statusCode: 500, message: `AI 服务错误: HTTP ${res.status}` })
  const data = await res.json() as any
  return { file_id, action, result: data.choices?.[0]?.message?.content || '无返回' }
})