/**
 * GET /api/history?sessionId=xxx — 访客历史
 */
import { tasks } from '../utils/store'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const sessionId = query.sessionId as string

  const history: any[] = []
  for (const [id, task] of tasks) {
    if (task.session_id === sessionId) {
      history.push({ file_id: id, original_name: task.original_name, status: task.status, created_at: task.created_at })
    }
  }
  history.sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
  return { session_id: sessionId, history }
})