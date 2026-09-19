/**
 * 共享内存存储 — 所有 API 路由共享
 * 单机部署，重启丢失，符合自动回收设计
 */
export const tasks = new Map<string, any>()
export const results = new Map<string, any>()

// 保持引用，防止后台 Promise 被 GC
export const activeJobs = new Map<string, Promise<void>>()