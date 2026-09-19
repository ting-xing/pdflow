<script setup lang="ts">
useSeoMeta({ title: '产品 — PDFlow', description: '十大工具，覆盖文档处理全场景。' })

const conversionTools = [
  { icon: 'i-lucide-file-text', name: 'PDF 智能提取', desc: 'PDF 精准转 Word、Markdown、HTML、JSON、TXT，保留表格、公式、图片。' },
  { icon: 'i-lucide-scan', name: '扫描件 OCR', desc: '扫描件/图片 PDF OCR 识别，输出可编辑文本，支持中英文及多语种。' },
  { icon: 'i-lucide-file-spreadsheet', name: 'Office 文档转换', desc: 'DOCX、PPTX 输入 → Markdown → 导出为 Word / HTML 等格式。' },
  { icon: 'i-lucide-table', name: 'Excel 数据提取', desc: 'XLSX 表格 → 结构化 JSON 或 Markdown 表格，方便程序处理。' },
  { icon: 'i-lucide-layers', name: '批量文档处理', desc: '一次上传多个文件，并行处理，支持拖拽排序和一键批量导出。' },
]

const aiTools = [
  { icon: 'i-lucide-sparkles', name: '智能摘要', desc: '一句话总结 / 三段式摘要 / 关键词标签，快速了解文档核心内容。' },
  { icon: 'i-lucide-search', name: '关键信息提取', desc: '合同要素 / 发票数据 / 待办事项，自动提取为结构化 JSON。' },
  { icon: 'i-lucide-languages', name: '文档翻译', desc: '保留 Markdown 格式的整篇翻译，支持中英日韩等多语种互译。' },
  { icon: 'i-lucide-wand', name: '文档润色', desc: '改善表达、修正语法、统一术语风格。让 AI 打磨你的文字。' },
  { icon: 'i-lucide-graduation-cap', name: '论文速读', desc: '提取研究问题、方法、实验结果和贡献，梳理时间线和术语。' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-16">
    <div class="text-center mb-16">
      <UBadge color="primary" variant="subtle" size="sm" class="mb-4">🎉 公测期间全部免费</UBadge>
      <h1 class="text-4xl font-bold mb-4">十大工具，覆盖全场景</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">五款格式转换 + 五款 AI 智能。基于 MinerU 引擎和 LLM，一站式解决文档处理需求。</p>
    </div>

    <div class="mb-16">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
        <UIcon name="i-lucide-shuffle" class="w-6 h-6 text-primary-500" />
        格式转换
      </h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="tool in conversionTools" :key="tool.name" :ui="{ body: 'p-5' }">
          <UIcon :name="tool.icon" class="w-8 h-8 text-primary-500 mb-3" />
          <h3 class="font-semibold mb-1">{{ tool.name }}</h3>
          <p class="text-sm text-gray-500 mb-3">{{ tool.desc }}</p>
          <UButton to="/tools/extract" size="xs" variant="outline">立即使用</UButton>
        </UCard>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
        <UIcon name="i-lucide-sparkles" class="w-6 h-6 text-purple-500" />
        AI 智能
      </h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="tool in aiTools" :key="tool.name" :ui="{ body: 'p-5' }">
          <UIcon :name="tool.icon" class="w-8 h-8 text-purple-500 mb-3" />
          <h3 class="font-semibold mb-1">{{ tool.name }}</h3>
          <p class="text-sm text-gray-500 mb-3">{{ tool.desc }}</p>
          <UButton to="/tools/extract" size="xs" variant="outline">立即使用</UButton>
        </UCard>
      </div>
    </div>
  </div>
</template>