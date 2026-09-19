/**
 * GET /api/status/[id] — 查询任务进度
 */
import { tasks } from '../../utils/store'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const task = tasks.get(id)
  if (!task) throw createError({ statusCode: 404, message: '任务不存在' })
  return task
})