<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'zh-CN' },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ]
})

useSeoMeta({
  title: 'PDFlow — 一站式文档智能处理平台',
  description: '基于 MinerU 引擎，提供 PDF 提取、OCR 识别、Office 转换、AI 摘要等工具。公测期间全部免费。',
})
</script>

<template>
  <UApp>
    <!-- 自定义 Header — 左 Logo / 中 Nav / 右 CTA -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14">
        <!-- Left: Logo — flex-1 撑开左侧空间 -->
        <div class="flex-1 flex items-center">
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
            <AppLogo class="h-7 w-auto text-gray-900 dark:text-white" />
          </NuxtLink>
        </div>

        <!-- Center: Nav — 绝对居中 -->
        <nav class="hidden sm:flex items-center gap-1">
          <NuxtLink to="/" class="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950">首页</NuxtLink>
          <NuxtLink to="/products" class="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950">产品</NuxtLink>
          <NuxtLink to="/pricing" class="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950">价格</NuxtLink>
          <NuxtLink to="/about" class="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950">关于</NuxtLink>
        </nav>

        <!-- Right: CTA + 主题 — flex-1 撑开右侧空间 -->
        <div class="flex-1 flex items-center justify-end gap-2">
          <a href="https://github.com/ting-xing/pdflow" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="GitHub">
            <UIcon name="i-simple-icons-github" class="w-5 h-5" />
          </a>
          <NuxtLink to="/tools/extract" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-primary-600 text-white animate-glow-pulse hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-300" />
            </span>
            在线体验
          </NuxtLink>
          <UColorModeButton />
          <!-- 移动端菜单按钮 -->
          <button class="sm:hidden p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <UIcon name="i-lucide-menu" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <div class="flex items-center gap-3">
          <AppLogo class="h-5 w-auto text-gray-400" />
          <p class="text-sm text-gray-400">© {{ new Date().getFullYear() }} · 基于 MinerU 开源引擎构建</p>
        </div>
      </template>
    </UFooter>
  </UApp>
</template>