# =============================================================
# PDFlow — Dockerfile
# Nuxt 3 + Nitro 多阶段构建
# =============================================================

# ---- Build Stage ----
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@12 --activate

WORKDIR /app

# 依赖（跳过构建脚本，后续手动 rebuild）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts \
 && pnpm rebuild esbuild vue-demi unrs-resolver

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

# 环境变量（运行时通过 docker compose / k8s 注入）
ENV NITRO_HOST=::
ENV NITRO_PORT=3000
# MINERU_API_URL / LLM_API_URL / LLM_API_KEY / LLM_MODEL
# 请通过 docker-compose.yml 或环境变量注入，勿在此硬编码

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000/api/health

# 非 root 运行
RUN addgroup -S pdflow && adduser -S pdflow -G pdflow && \
    chown -R pdflow:pdflow /app
USER pdflow

CMD ["node", ".output/server/index.mjs"]