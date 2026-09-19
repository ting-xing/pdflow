<script setup lang="ts">
useSeoMeta({
  title: '关于 — PDFlow',
  description: 'PDFlow 基于 MinerU 开源引擎构建，致力于提供最优质的文档智能处理体验。',
})

const techs = [
  { icon: 'i-lucide-brain', title: 'MinerU', description: '深度学习版面分析引擎' },
  { icon: 'i-lucide-triangle', title: 'Nuxt 3', description: '全栈 Vue 框架' },
  { icon: 'i-lucide-palette', title: 'Nuxt UI', description: '现代化 UI 组件库' },
  { icon: 'i-lucide-sparkles', title: 'Qwen LLM', description: '通义千问大语言模型' },
  { icon: 'i-lucide-zap', title: 'Vite + HMR', description: '极速开发体验' },
  { icon: 'i-lucide-globe', title: 'SSR + SSG', description: '服务端渲染 + 静态生成' },
]

const timelineItems = [
  { date: '2024 Q4', title: 'MinerU 引擎集成', description: '完成 PDF/扫描件解析核心能力，支持版面分析和 OCR 识别', icon: 'i-lucide-brain' },
  { date: '2025 Q1', title: '格式转换上线', description: '支持 MD/DOCX/HTML/JSON/TXT 五种格式输出', icon: 'i-lucide-shuffle' },
  { date: '2025 Q2', title: 'AI 智能处理', description: '集成 Qwen LLM，上线 10 种预设 AI 操作', icon: 'i-lucide-sparkles' },
  { date: '公测中', title: '免费公测', description: '全部功能开放，收集用户反馈持续优化', icon: 'i-lucide-rocket' },
  { date: '规划中', title: '更多能力', description: 'API 接口 + 团队协作 + Pro 版高级功能', icon: 'i-lucide-compass' },
]

const faqItems = [
  { label: 'PDFlow 是否真的免费？', content: '公测期间所有功能完全免费，无使用次数限制，无水印。未来 Pro 版上线后，免费版的核心功能将继续免费。' },
  { label: '文件上传后安全吗？', content: '您的文件仅用于本次处理和格式转换。处理后 24 小时自动清理，不会用于任何其他用途。我们无法查看您未主动分享的文件内容。' },
  { label: '支持哪些文件格式？', content: '输入：PDF（含扫描件）、DOCX、PPTX、XLSX。输出：Markdown、Word (DOCX)、HTML、JSON、纯文本。扫描件自动启用 OCR 识别。' },
  { label: 'MinerU 引擎是什么？', content: 'MinerU 是 OpenDataLab 开源的高精度文档解析引擎，基于深度学习模型进行版面分析，能准确识别标题、正文、表格、公式和图片。' },
  { label: 'AI 操作可以自定义吗？', content: '目前提供 10 种预设 AI 操作（摘要、翻译、润色、关键提取等），覆盖常见场景。暂不支持自由对话，未来会逐步开放更多自定义能力。' },
  { label: '如何处理个人隐私？', content: '我们不需要注册或登录，不收集个人信息。文件处理仅在服务器内存中完成，不持久化存储，24 小时后自动物理删除。' },
]

const ideas = [
  { icon: 'i-lucide-code', title: '开源驱动', desc: '核心解析能力基于 MinerU 开源项目，站在巨人的肩膀上。' },
  { icon: 'i-lucide-mouse-pointer-click', title: '简单至上', desc: '不需要注册、不需要配置，打开浏览器就能用。' },
  { icon: 'i-lucide-lock', title: '隐私优先', desc: '文件 24h 自动清理，不保存、不分析、不留痕。' },
  { icon: 'i-lucide-bot', title: 'AI 加持', desc: '结合大语言模型，让文档处理从"提取"升级到"理解"。' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <UPageHero
      title="关于 PDFlow"
      description="基于 MinerU 开源引擎构建的一站式文档智能处理平台"
      :ui="{ container: 'text-center mb-12' }"
    />

    <!-- 简介 -->
    <div class="max-w-2xl mx-auto mb-16 prose dark:prose-invert">
      <p class="text-lg text-gray-500 leading-relaxed">
        PDFlow 将最先进的 AI 文档解析能力，以最简洁、最易用的方式提供给每一位用户。
        核心基于 <a href="https://github.com/opendatalab/MinerU" target="_blank" class="text-primary-600">MinerU</a> 开源引擎，
        结合大语言模型实现从"提取"到"理解"的跨越。
      </p>
    </div>

    <!-- 技术栈 -->
    <UPageSection
      headline="技术栈"
      title="站在巨人的肩膀上"
      description="精选业界最佳实践，打造极致体验"
      :features="techs"
    />

    <!-- 时间线 -->
    <div class="mt-16">
      <h2 class="text-2xl font-bold text-center mb-8">开发历程</h2>
      <UTimeline :items="timelineItems" color="primary" size="lg" />
    </div>

    <!-- 理念 -->
    <div class="mt-16 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-8">我们的理念</h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <UCard v-for="idea in ideas" :key="idea.title" :ui="{ body: 'p-5' }">
          <UIcon :name="idea.icon" class="w-6 h-6 text-primary-500 mb-3" />
          <h3 class="font-semibold mb-1">{{ idea.title }}</h3>
          <p class="text-sm text-gray-500">{{ idea.desc }}</p>
        </UCard>
      </div>
    </div>

    <!-- FAQ -->
    <div class="mt-20 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-8">常见问题</h2>
      <UAccordion :items="faqItems" type="single" collapsible />
    </div>
  </div>
</template>