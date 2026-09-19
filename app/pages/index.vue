<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

useSeoMeta({ title: 'PDFlow — 文档智能处理，从未如此简单' })

// 打字机效果
const typewriterTexts = ['PDF 智能提取', '扫描件 OCR 识别', 'Office 文档转换', 'AI 智能摘要', '文档翻译', '数据提取']
const currentText = ref('')
const textIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function typeEffect() {
  const full = typewriterTexts[textIndex.value]
  if (!isDeleting.value) {
    currentText.value = full.slice(0, charIndex.value + 1)
    charIndex.value++
    if (charIndex.value === full.length) {
      timer = setTimeout(() => { isDeleting.value = true; typeEffect() }, 2000)
      return
    }
  } else {
    currentText.value = full.slice(0, charIndex.value - 1)
    charIndex.value--
    if (charIndex.value === 0) {
      isDeleting.value = false
      textIndex.value = (textIndex.value + 1) % typewriterTexts.length
      timer = setTimeout(typeEffect, 400)
      return
    }
  }
  timer = setTimeout(typeEffect, isDeleting.value ? 30 : 80)
}

// 鼠标光晕
const mouseX = ref(0)
const mouseY = ref(0)
function onMouseMove(e: MouseEvent) { mouseX.value = e.clientX; mouseY.value = e.clientY }

onMounted(() => { timer = setTimeout(typeEffect, 500); window.addEventListener('mousemove', onMouseMove) })
onUnmounted(() => { if (timer) clearTimeout(timer); window.removeEventListener('mousemove', onMouseMove) })

const features = [
  { icon: 'i-lucide-file-text', title: '精准解析', description: '基于 MinerU 深度学习版面分析引擎，准确还原文档结构、表格和公式。' },
  { icon: 'i-lucide-shuffle', title: '全格式转换', description: '支持 PDF、扫描件、DOCX、PPTX、XLSX 输入，输出 Word、Markdown、HTML 等格式。' },
  { icon: 'i-lucide-sparkles', title: 'AI 智能处理', description: '一键摘要、提取关键信息、翻译文档。预设动作、精准可控。' },
  { icon: 'i-lucide-zap', title: '秒级响应', description: '异步处理引擎，上传即走。支持批量并行处理，大幅提升效率。' },
  { icon: 'i-lucide-shield-check', title: '隐私安全', description: '无需注册登录，文件 24 小时后自动清理，不留痕迹。' },
  { icon: 'i-lucide-gift', title: '完全免费', description: '公测期间所有功能全部免费开放，无次数限制，无水印。' },
]
</script>

<template>
  <div class="relative">
    <!-- 鼠标光晕 -->
    <div class="fixed pointer-events-none z-0 transition-transform duration-500 ease-out opacity-30"
         :style="{ left: mouseX - 300 + 'px', top: mouseY - 300 + 'px', width: '600px', height: '600px' }">
      <div class="w-full h-full rounded-full bg-gradient-radial from-primary-400/20 to-transparent" />
    </div>

    <!-- 浮动装饰 -->
    <div class="absolute top-20 left-[10%] text-4xl animate-float opacity-20 hidden lg:block">📄</div>
    <div class="absolute top-40 right-[15%] text-3xl animate-float-delayed opacity-20 hidden lg:block">✨</div>

    <!-- Hero -->
    <UPageHero
      headline="🎉 公测期间全部免费"
      title="文档智能处理，从未如此简单"
      description="基于 MinerU 引擎，将 PDF、扫描件、Office 文档精准转换。结合 AI 实现智能摘要、关键提取、文档翻译。"
      orientation="vertical"
      :ui="{ container: 'relative z-10 py-20 sm:py-28' }"
    >
      <!-- 打字机 -->
      <div class="h-10 mb-6 flex justify-center">
        <span class="text-xl sm:text-2xl text-gray-500 font-mono">
          {{ currentText }}<span class="animate-pulse text-primary-500">|</span>
        </span>
      </div>

      <template #links>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton to="/tools/extract" size="lg" color="primary">
            <UIcon name="i-lucide-zap" class="w-5 h-5" />
            免费体验
          </UButton>
          <UButton to="/products" size="lg" variant="outline" color="neutral">
            <UIcon name="i-lucide-grid" class="w-5 h-5" />
            查看产品
          </UButton>
        </div>
      </template>
    </UPageHero>

    <!-- Features -->
    <UPageSection
      title="为什么选择 PDFlow"
      description="不仅是一个格式转换工具，更是你的文档智能助手"
      :features="features"
      :ui="{ container: 'relative z-10 py-16 max-w-6xl mx-auto' }"
    />

    <!-- Tools Marquee -->
    <div class="relative z-10 py-16 bg-gray-50/50 dark:bg-gray-800/30">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-3">十大工具，覆盖全场景</h2>
        <p class="text-lg text-gray-500">格式转换 + AI 智能，一站式解决文档处理需求</p>
      </div>

      <UMarquee :repeat="3" :overlay="true" class="mb-6">
        <UBadge v-for="t in ['📄 PDF 提取', '🔍 扫描件 OCR', '📊 Office 转换', '🤖 AI 摘要', '🌐 文档翻译', '✨ 文档润色', '🎓 论文速读', '📋 关键提取', '✅ 待办识别', '⏱️ 时间线梳理']" :key="t" variant="subtle" size="lg" class="mx-2 px-4 py-2 text-sm">
          {{ t }}
        </UBadge>
      </UMarquee>

      <UMarquee :repeat="3" :overlay="true" :reverse="true">
        <UBadge v-for="t in ['MinerU 引擎', 'Nuxt 3', 'Tailwind CSS', 'Qwen LLM', 'Vue 3', 'TypeScript', 'SSR/SSG', '异步处理']" :key="t" variant="soft" size="lg" class="mx-2 px-4 py-2 text-sm" color="neutral">
          {{ t }}
        </UBadge>
      </UMarquee>

      <div class="text-center mt-10">
        <UButton to="/products" variant="outline" trailing-icon="i-lucide-arrow-right">查看全部产品</UButton>
      </div>
    </div>

    <!-- CTA -->
    <div class="relative z-10 py-20">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <div class="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950 rounded-3xl p-12 animate-gradient">
          <h2 class="text-3xl font-bold mb-4">准备好提升文档处理效率了吗？</h2>
          <p class="text-gray-500 mb-8">无需注册，打开浏览器即可使用。所有功能免费。</p>
          <UButton to="/tools/extract" size="lg" color="primary">
            <UIcon name="i-lucide-zap" class="w-5 h-5" />
            立即体验
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>