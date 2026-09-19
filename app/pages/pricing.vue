<script setup lang="ts">
useSeoMeta({
  title: '价格 — PDFlow · 公测免费',
  description: '公测期间全部功能免费使用，无次数限制，无水印。',
})

const freeFeatures = [
  '所有格式转换工具（5 种）',
  'AI 智能处理（10 次/天）',
  '单文件最大 50MB',
  '无广告 · 无水印',
  '24 小时历史保留',
  '社区支持',
]

const proFeatures = [
  '免费版全部功能',
  'AI 智能处理（无限制）',
  '单文件最大 200MB',
  '7 天历史保留',
  'API 接口访问',
  '优先处理队列',
  '邮件支持',
]

const comparisonRows = [
  { name: 'PDF / 扫描件解析', free: '✓', pro: '✓' },
  { name: '格式转换（5 种）', free: '✓', pro: '✓' },
  { name: 'AI 一键处理', free: '10 次/天', pro: '无限制' },
  { name: '单文件大小上限', free: '50 MB', pro: '200 MB' },
  { name: '历史记录保留', free: '24 小时', pro: '7 天' },
  { name: 'API 接口', free: '—', pro: '✓' },
  { name: '批量处理', free: '10 个/次', pro: '50 个/次' },
  { name: '优先处理队列', free: '—', pro: '✓' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-16">
    <!-- Header -->
    <div class="text-center mb-12">
      <UBadge color="primary" variant="subtle" size="lg" class="mb-6 text-sm px-4 py-1.5">
        <UIcon name="i-lucide-sparkles" class="w-4 h-4 mr-1" />
        公测期间全部免费
      </UBadge>
      <h1 class="text-4xl font-bold mb-4 tracking-tight">简单透明的定价</h1>
      <p class="text-lg text-gray-500 max-w-xl mx-auto">
        公测期间所有功能免费开放。未来 Pro 版将为专业用户提供更高配额和专属服务。
      </p>
    </div>

    <!-- Plans -->
    <div class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <!-- Free -->
      <UPricingPlan
        title="免费版"
        description="适合个人用户和轻度使用"
        price="¥0"
        billing-cycle="永久免费"
        :features="freeFeatures"
        :highlight="true"
        badge="推荐"
      >
        <template #button>
          <UButton to="/tools/extract" color="primary" size="lg" block>
            开始免费使用
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1" />
          </UButton>
        </template>
      </UPricingPlan>

      <!-- Pro -->
      <UPricingPlan
        title="Pro 版"
        description="适合专业用户和团队"
        price="敬请期待"
        :features="proFeatures"
        :highlight="false"
        variant="soft"
      >
        <template #button>
          <UButton disabled color="neutral" size="lg" block variant="outline">
            预约通知
            <UIcon name="i-lucide-bell" class="w-4 h-4 ml-1" />
          </UButton>
        </template>
      </UPricingPlan>
    </div>

    <!-- Feature Comparison Table -->
    <div class="mt-20 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-center mb-8">功能对比</h2>
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800">
              <th class="text-left px-6 py-3 font-medium">功能</th>
              <th class="text-center px-4 py-3 font-medium text-primary-600">免费版</th>
              <th class="text-center px-4 py-3 font-medium text-gray-400">Pro 版</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="row in comparisonRows" :key="row.name" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-3">{{ row.name }}</td>
              <td class="text-center px-4 py-3">{{ row.free }}</td>
              <td class="text-center px-4 py-3 text-gray-400">{{ row.pro }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-16">
      <p class="text-gray-500 mb-4 text-sm">无需注册，上传即用。文件 24 小时后自动清理。</p>
      <UButton to="/tools/extract" size="lg" color="primary" variant="outline">
        开始免费体验
        <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1" />
      </UButton>
    </div>
  </div>
</template>