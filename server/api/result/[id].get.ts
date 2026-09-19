/**
 * GET /api/result/[id] — 获取解析结果
 */
import { results } from '../../utils/store'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const result = results.get(id)
  if (!result) throw createError({ statusCode: 404, message: '结果不存在' })
  return result
})