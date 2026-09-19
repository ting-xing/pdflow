<script setup lang="ts">
useSeoMeta({
  title: '在线体验 — PDFlow',
  description: '上传 PDF、扫描件、Office 文档，一键提取为 Word、Markdown 等格式。AI 智能处理。',
})

import { ref, computed, onMounted, watch } from 'vue'

const dragOver = ref(false)
const mounted = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const sessionId = ref('')
const queue = ref<any[]>([])
const currentFileId = ref('')
const currentMarkdown = ref('')
const currentJson = ref('')
const activeFormat = ref('md')
const convertedContent = ref('')
const history = ref<any[]>([])
const aiLoading = ref(false)
const aiResult = ref('')
const deletingId = ref('')

// 步骤条
const stepperItems = [
  { label: '上传文件', description: '拖拽或点击上传，支持 PDF/Office 格式', value: 'upload', icon: 'i-lucide-cloud-upload' },
  { label: '智能解析', description: 'MinerU 引擎正在解析文档版面和内容', value: 'parse', icon: 'i-lucide-brain' },
  { label: '格式转换', description: '选择输出格式：MD / Word / HTML / JSON', value: 'convert', icon: 'i-lucide-shuffle' },
  { label: 'AI 处理', description: '一键 AI 操作：摘要、翻译、润色等', value: 'ai', icon: 'i-lucide-sparkles' },
]
const currentStep = ref('upload')
watch(() => currentFileId.value, (val) => {
  if (val) currentStep.value = 'parse'
})
watch(activeFormat, () => {
  if (currentFileId.value) currentStep.value = 'convert'
})

// 样例文件
const samples = [
  { label: 'PDF 文档', name: 'sample.pdf', url: '/samples/sample.pdf', icon: 'i-lucide-file-text' },
  { label: 'Word 文档', name: 'sample.docx', url: '/samples/sample.docx', icon: 'i-lucide-file-type' },
  { label: 'PPT 演示', name: 'sample.pptx', url: '/samples/sample.pptx', icon: 'i-lucide-presentation' },
  { label: 'Excel 表格', name: 'sample.xlsx', url: '/samples/sample.xlsx', icon: 'i-lucide-table' },
]

const formats = [
  { id: 'md', name: 'Markdown', icon: 'i-lucide-file-text' },
  { id: 'docx', name: 'Word', icon: 'i-lucide-file-type' },
  { id: 'html', name: 'HTML', icon: 'i-lucide-globe' },
  { id: 'json', name: 'JSON', icon: 'i-lucide-brackets' },
  { id: 'txt', name: '纯文本', icon: 'i-lucide-align-left' },
]

const aiActions = [
  { id: 'one_sentence', name: '一句话总结', icon: 'i-lucide-message-circle' },
  { id: 'three_part', name: '三段式摘要', icon: 'i-lucide-list-checks' },
  { id: 'keywords', name: '关键词', icon: 'i-lucide-tags' },
  { id: 'contract', name: '合同要素', icon: 'i-lucide-file-check' },
  { id: 'todos', name: '待办事项', icon: 'i-lucide-check-square' },
  { id: 'translate_zh', name: '译中文', icon: 'i-lucide-languages' },
  { id: 'translate_en', name: '译英文', icon: 'i-lucide-globe' },
  { id: 'polish', name: '文档润色', icon: 'i-lucide-pen' },
  { id: 'paper_speed', name: '论文速读', icon: 'i-lucide-graduation-cap' },
  { id: 'timeline', name: '时间线', icon: 'i-lucide-clock' },
]

const currentPreview = computed(() => {
  if (activeFormat.value === 'md') return currentMarkdown.value
  if (activeFormat.value === 'json') return currentJson.value
  return convertedContent.value || '正在转换...'
})
const hasResult = computed(() => !!currentFileId.value)

// MinerU 图片代理基地址
const MINERU_BASE = 'http://10.1.0.75:8002'
const renderedMarkdown = computed(() => {
  if (activeFormat.value !== 'md' || !currentMarkdown.value) return ''
  const md = currentMarkdown.value.replace(
    /!\[(.*?)\]\((images\/[^)]+)\)/g,
    `![$1](${MINERU_BASE}/$2)`
  )
  return md.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
           .replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-1">$1</h3>')
           .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
           .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
})

function getSessionId() {
  let id = localStorage.getItem('pdflow_session')
  if (!id) { id = 'guest_' + Math.random().toString(36).slice(2, 12); localStorage.setItem('pdflow_session', id) }
  return id
}
function triggerUpload() { fileInput.value?.click() }
function handleFileSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) uploadFiles(files)
  ;(e.target as HTMLInputElement).value = ''
}
function handleDrop(e: DragEvent) {
  dragOver.value = false
  if (e.dataTransfer?.files.length) uploadFiles(e.dataTransfer.files)
}

async function trySample(url: string, name: string) {
  const res = await fetch(url)
  const blob = await res.blob()
  const file = new File([blob], name)
  const dt = new DataTransfer()
  dt.items.add(file)
  uploadFiles(dt.files)
}

async function uploadFiles(files: FileList) {
  const allowedExts = ['.pdf', '.docx', '.pptx', '.xlsx']
  for (const file of Array.from(files)) {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!allowedExts.includes(ext)) continue
    const task = { id: Math.random().toString(36).slice(2, 8), name: file.name, status: 'processing', progress: 10, message: '正在上传...', fileId: '' }
    queue.value.push(task)
    try {
      const form = new FormData(); form.append('file', file); form.append('session_id', sessionId.value)
      const res = await $fetch('/api/upload', { method: 'POST', body: form }) as any
      task.fileId = res.file_id
      for (let i = 0; i < 120; i++) {
        await sleep(3000)
        const s = await $fetch(`/api/status/${task.fileId}`) as any
        task.progress = s.progress || task.progress; task.message = s.progress_message || task.message
        if (s.status === 'completed') { task.status = 'completed'; task.progress = 100; task.message = '✅ 完成'; await loadResult(task.fileId); await loadHistory(); return }
        if (s.status === 'failed') { task.status = 'failed'; task.message = '❌ 失败'; return }
      }
      task.status = 'failed'; task.message = '❌ 超时'
    } catch (e: any) { task.status = 'failed'; task.message = '❌ ' + (e.message || '未知错误') }
  }
}

async function loadResult(fileId: string) {
  const result = await $fetch(`/api/result/${fileId}`) as any
  currentFileId.value = fileId; currentMarkdown.value = result.markdown || ''; currentJson.value = result.json_content || ''
  activeFormat.value = 'md'; convertedContent.value = ''; aiResult.value = ''
}

async function switchFormat(format: string) {
  activeFormat.value = format
  if (format === 'md' || format === 'json') { convertedContent.value = ''; return }
  try {
    const r = await $fetch('/api/convert', { method: 'POST', body: { file_id: currentFileId.value, target_format: format } }) as any
    convertedContent.value = r.content || ''
  } catch (e: any) { convertedContent.value = '转换失败: ' + e.message }
}

function downloadResult() {
  const a = document.createElement('a')
  a.href = `/api/download/${currentFileId.value}.${activeFormat.value}`
  a.download = `${currentFileId.value}.${activeFormat.value}`
  a.click()
}
async function copyResult() { await navigator.clipboard.writeText(currentPreview.value) }

async function aiAction(actionId: string) {
  if (aiLoading.value) return; aiLoading.value = true; aiResult.value = '处理中...'
  try {
    const r = await $fetch('/api/ai/action', { method: 'POST', body: { file_id: currentFileId.value, action: actionId } }) as any
    aiResult.value = r.result || '无返回'
  } catch (e: any) { aiResult.value = '❌ ' + (e.message || 'AI 调用失败') } finally { aiLoading.value = false }
}

async function loadHistory() {
  try { const d = await $fetch(`/api/history?sessionId=${sessionId.value}`) as any; history.value = d.history || [] } catch {}
}

async function deleteHistory(fileId: string) {
  deletingId.value = fileId
  try {
    await $fetch('/api/history', { method: 'DELETE', body: { sessionId: sessionId.value, fileId } })
    history.value = history.value.filter(h => h.file_id !== fileId)
    if (currentFileId.value === fileId) { currentFileId.value = ''; currentMarkdown.value = '' }
  } catch {}
  deletingId.value = ''
}

function formatTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso), diff = +new Date() - +d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分前'
  return d.toLocaleDateString('zh-CN')
}
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

onMounted(async () => { sessionId.value = getSessionId(); await loadHistory(); mounted.value = true })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="!mounted" class="py-16 flex justify-center">
      <USkeleton class="w-full max-w-2xl h-64 rounded-2xl" />
    </div>

    <template v-if="mounted">
      <!-- 面包屑 + 步骤条 -->
      <div class="mb-8 space-y-5">
        <UBreadcrumb :items="[{ label: '首页', to: '/' }, { label: '在线体验' }]" />
        <UStepper :items="stepperItems" :default-value="currentStep" size="sm" color="primary" orientation="horizontal" />
      </div>

      <!-- 上传区 -->
      <label
        @drop.prevent="handleDrop" @dragover.prevent="dragOver = true" @dragleave="dragOver = false"
        class="block border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all mb-10"
        :class="dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.01]' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
      >
        <input ref="fileInput" type="file" accept=".pdf,.docx,.pptx,.xlsx" multiple class="hidden" @change="handleFileSelect">
        <UIcon name="i-lucide-cloud-upload" class="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <p class="text-lg font-semibold mb-1">拖拽文件到此处，或 <span class="text-primary-600">点击选择</span></p>
        <p class="text-sm text-gray-500">支持 PDF · DOCX · PPTX · XLSX · 最大 50MB · 扫描件自动 OCR</p>
      </label>

      <!-- 样例文件 -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-10 -mt-6 text-sm text-gray-500">
        <span class="mr-1">没有文件？试试样例：</span>
        <button
          v-for="sample in samples"
          :key="sample.name"
          @click="trySample(sample.url, sample.name)"
          :disabled="queue.length > 0"
          class="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <UIcon :name="sample.icon" class="w-4 h-4" />
          {{ sample.label }}
        </button>
      </div>

      <!-- 任务队列 -->
      <div v-if="queue.length" class="mb-10 space-y-3">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <UIcon name="i-lucide-loader" class="w-4 h-4" /> 处理队列
        </h3>
        <div v-for="task in queue" :key="task.id" class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <UIcon :name="task.status === 'completed' ? 'i-lucide-check-circle' : task.status === 'failed' ? 'i-lucide-x-circle' : 'i-lucide-loader'" class="w-6 h-6 shrink-0" :class="task.status === 'completed' ? 'text-green-500' : task.status === 'failed' ? 'text-red-500' : 'text-primary-500 animate-spin'" />
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate text-sm">{{ task.name }}</p>
            <p class="text-xs text-gray-500">{{ task.message }}</p>
            <UProgress :value="task.progress" :color="task.status === 'failed' ? 'error' : task.status === 'completed' ? 'success' : 'primary'" size="xs" class="mt-1.5" />
          </div>
          <span class="text-sm text-gray-400 font-mono tabular-nums">{{ task.progress }}%</span>
        </div>
      </div>

      <!-- 结果区 -->
      <div v-if="hasResult" class="space-y-6">
        <!-- 工具栏 -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <UButton v-for="fmt in formats" :key="fmt.id" :color="activeFormat === fmt.id ? 'primary' : 'neutral'" :variant="activeFormat === fmt.id ? 'solid' : 'outline'" @click="switchFormat(fmt.id)">
              <UIcon :name="fmt.icon" class="w-4 h-4 mr-1" /> {{ fmt.name }}
            </UButton>
          </div>
          <div class="flex gap-2">
            <UButton variant="outline" size="sm" @click="copyResult"><UIcon name="i-lucide-copy" class="w-4 h-4 mr-1" /> 复制</UButton>
            <UButton color="primary" size="sm" @click="downloadResult"><UIcon name="i-lucide-download" class="w-4 h-4 mr-1" /> 下载</UButton>
          </div>
        </div>

        <!-- 分屏预览 -->
        <div class="grid lg:grid-cols-2 gap-6">
          <UCard :ui="{ body: 'p-0' }">
            <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
              <UIcon name="i-lucide-code" class="w-3.5 h-3.5" /> 源码
            </div>
            <pre class="p-5 text-sm overflow-auto max-h-[550px] whitespace-pre-wrap leading-relaxed font-mono">{{ currentPreview }}</pre>
          </UCard>
          <UCard :ui="{ body: 'p-0' }">
            <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
              <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" /> 预览
            </div>
            <div v-if="activeFormat === 'md'" class="p-5 prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-[550px]" v-html="renderedMarkdown" />
            <div v-else class="p-5 text-sm text-gray-500">此格式仅支持源码查看</div>
          </UCard>
        </div>

        <!-- AI 操作 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-purple-500" />
              <span class="text-sm font-semibold">AI 一键处理</span>
              <UBadge variant="subtle" size="xs" color="purple">预设动作 · 精准可控</UBadge>
            </div>
          </template>
          <div class="flex flex-wrap gap-2 mb-4">
            <UButton v-for="act in aiActions" :key="act.id" variant="ghost" size="xs" :disabled="aiLoading" @click="aiAction(act.id)" class="hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              <UIcon :name="act.icon" class="w-3.5 h-3.5 mr-1" /> {{ act.name }}
            </UButton>
          </div>
          <div v-if="aiResult" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm whitespace-pre-wrap leading-relaxed" :class="{ 'animate-pulse': aiLoading }">
            {{ aiResult }}
          </div>
        </UCard>
      </div>

      <!-- 历史记录 -->
      <div v-if="history.length" class="mt-14">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <UIcon name="i-lucide-history" class="w-4 h-4" /> 历史记录 <span class="text-gray-400 font-normal normal-case">24h 有效</span>
          </h3>
        </div>
        <div class="space-y-1">
          <div v-for="item in history" :key="item.file_id"
               class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
            <UIcon name="i-lucide-file-text" class="w-5 h-5 text-gray-400 shrink-0" />
            <span @click="loadResult(item.file_id)" class="flex-1 truncate text-sm cursor-pointer hover:text-primary-600 transition-colors">{{ item.original_name }}</span>
            <span class="text-xs text-gray-400 shrink-0 hidden sm:inline">{{ formatTime(item.created_at) }}</span>
            <UBadge :color="item.status === 'completed' ? 'success' : 'error'" variant="subtle" size="xs" class="shrink-0">
              {{ item.status === 'completed' ? '完成' : '失败' }}
            </UBadge>
            <button @click="deleteHistory(item.file_id)" :disabled="deletingId === item.file_id"
                    class="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                    title="删除记录">
              <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>