/**
 * GET /api/health — 健康检查
 */
export default defineEventHandler(() => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }
})