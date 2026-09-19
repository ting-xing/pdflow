# =============================================================
# PDFlow — Dockerfile
# Nuxt 3 + Nitro 多阶段构建
# =============================================================

# ---- Build Stage ----
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@12 --activate

WORKDIR /app

# 依赖缓存层
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 源码构建
COPY . .
RUN pnpm run build

# ---- Production Stage ----
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@12 --activate

WORKDIR /app

# 运行时目录（上传 & 导出文件）
RUN mkdir -p /app/uploads /app/outputs
VOLUME ["/app/uploads", "/app/outputs"]

# 从构建阶段复制产物
COPY --from=builder /app/.output ./.output

# 环境变量默认值
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV MINERU_API_URL=http://10.1.0.75:8002
ENV LLM_API_URL=https://new-api.core.codeon.cn/v1/chat/completions
ENV LLM_API_KEY=sk-ly2AOrvKjWf3rLlI8f6ngLmn5XEONGrPJ3Cm4qZXM0IWEy1V
ENV LLM_MODEL=Qwen3.8-27B-FP8

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# 非 root 运行
RUN addgroup -S pdflow && adduser -S pdflow -G pdflow && \
    chown -R pdflow:pdflow /app
USER pdflow

CMD ["node", ".output/server/index.mjs"]