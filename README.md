# PDFlow

一站式文档智能处理平台，基于 [MinerU](https://github.com/opendatalab/MinerU) 开源引擎 + Qwen 大语言模型。

## 功能

- **文档解析** — PDF/扫描件 OCR 识别，支持 DOCX/PPTX/XLSX 输入
- **格式转换** — Markdown / Word / HTML / JSON / 纯文本，5 种输出格式
- **AI 智能** — 摘要、翻译、润色、关键词提取、待办识别等 10 种预设操作
- **零注册** — 访客 session 即开即用，文件 24h 自动清理

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Nuxt 3 + Vue 3 + TypeScript |
| UI | Nuxt UI v4 + Tailwind CSS v4 |
| 服务端 | Nitro (H3) |
| 解析引擎 | MinerU API |
| AI | Qwen3.8-27B-FP8 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000`。

## Docker 部署

```bash
# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f

# 停止
docker compose down
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NITRO_PORT` | 服务端口 | `3000` |
| `MINERU_API_URL` | MinerU 解析服务地址 | `http://10.1.0.75:8002` |
| `LLM_API_URL` | LLM API 地址 | `https://new-api.core.codeon.cn/v1/chat/completions` |
| `LLM_API_KEY` | LLM API 密钥 | — |
| `LLM_MODEL` | 模型名称 | `Qwen3.8-27B-FP8` |

## 目录结构

```
pdflow/
├── app/                  # Nuxt 前端
│   ├── pages/            # 页面路由
│   │   ├── index.vue     # 首页
│   │   ├── products.vue  # 产品页
│   │   ├── pricing.vue   # 定价页
│   │   ├── about.vue     # 关于页
│   │   └── tools/
│   │       └── extract.vue  # 在线体验
│   ├── components/       # 组件
│   └── assets/           # 样式
├── server/               # Nitro 服务端
│   ├── api/              # API 路由
│   │   ├── upload.post.ts    # 文件上传
│   │   ├── status/[id].get.ts # 任务进度
│   │   ├── result/[id].get.ts # 解析结果
│   │   ├── convert.post.ts    # 格式转换
│   │   ├── ai/action.post.ts  # AI 操作
│   │   ├── history.get.ts     # 历史查询
│   │   ├── history.delete.ts  # 历史删除
│   │   └── download/[name].get.ts # 文件下载
│   └── utils/            # 工具
│       ├── mineru.ts     # MinerU 客户端
│       ├── cleanup.ts    # 定时清理
│       └── store.ts      # 内存存储
├── public/
│   └── samples/          # 样例文件
├── Dockerfile
├── docker-compose.yml
└── nuxt.config.ts
```

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/upload` | 上传文件（multipart） |
| `GET` | `/api/status/:id` | 任务进度轮询 |
| `GET` | `/api/result/:id` | 获取解析结果 |
| `POST` | `/api/convert` | 格式转换 |
| `POST` | `/api/ai/action` | AI 预设操作 |
| `GET` | `/api/history?sessionId=` | 历史记录 |
| `DELETE` | `/api/history` | 删除记录 |
| `GET` | `/api/download/:name` | 文件下载 |
| `GET` | `/api/health` | 健康检查 |

## License

MIT