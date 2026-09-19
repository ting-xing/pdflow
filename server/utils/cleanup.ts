/**
 * 定时清理过期文件
 */
import { mkdir, readdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'

const UPLOADS_DIR = join(process.cwd(), 'uploads')
const OUTPUTS_DIR = join(process.cwd(), 'outputs')
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 小时

export async function cleanupExpiredFiles() {
  await mkdir(UPLOADS_DIR, { recursive: true })
  await mkdir(OUTPUTS_DIR, { recursive: true })

  for (const dir of [UPLOADS_DIR, OUTPUTS_DIR]) {
    try {
      const files = await readdir(dir)
      const now = Date.now()
      for (const f of files) {
        const fp = join(dir, f)
        const s = await stat(fp)
        if (now - s.mtimeMs > MAX_AGE_MS) {
          await unlink(fp)
          console.log(`[清理] ${f}`)
        }
      }
    } catch { /* 目录不存在则跳过 */ }
  }
}

// 每小时清理一次
setInterval(cleanupExpiredFiles, 60 * 60 * 1000)
cleanupExpiredFiles()