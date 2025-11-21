<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'file-analyzed', data: { deposit: number, marketValue: number, priorDebt: number }): void
}>()
const isAnalyzing = ref<boolean>(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isAnalyzing.value = true
  
  // Mocking AI Analysis (3 seconds delay)
  setTimeout(() => {
    isAnalyzing.value = false
    // Mock Data extracted from "PDF"
    const mockData = {
      deposit: 200000000, // 2억
      marketValue: 250000000, // 2.5억
      priorDebt: 30000000 // 3천
    }
    emit('file-analyzed', mockData)
    alert('AI가 등기부등본 분석을 완료했습니다!')
  }, 3000)
}
</script>

<template>
  <div class="upload-container">
    <input 
      type="file" 
      accept=".pdf,.jpg,.png" 
      @change="handleFileUpload"
      class="upload-input"
    >
    <div v-if="isAnalyzing" class="upload-content analyzing">
      <p class="analyzing-title">AI가 문서를 분석 중입니다...</p>
      <p class="analyzing-desc">잠시만 기다려주세요.</p>
    </div>
    <div v-else class="upload-content">
      <p class="upload-title">등기부등본(PDF)을 여기에 드래그하거나 클릭하세요</p>
      <p class="upload-desc">AI가 자동으로 보증금과 융자를 분석합니다.</p>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  border: 2px dashed var(--color-gray-700);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: border-color 0.2s;
  cursor: pointer;
  position: relative;
}

.upload-container:hover {
  border-color: var(--color-primary);
}

.upload-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  pointer-events: none;
}

.analyzing {
  color: #a3e635; /* lime-400 */
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.analyzing-title, .upload-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.upload-title {
  color: var(--color-gray-300); /* Assuming dark theme or specific gray */
  /* Wait, the original was gray-300 but background is white? 
     Ah, original code had text-gray-300. Let's stick to that or adjust if it's too light on white bg.
     Actually, looking at AnalysisForm, the bg is white. gray-300 on white is very light.
     But let's respect the original intent or maybe make it slightly darker for visibility if needed.
     Let's use gray-400 for better visibility.
  */
  color: var(--color-gray-400);
}

.analyzing-desc, .upload-desc {
  font-size: 0.875rem;
  color: var(--color-gray-500); /* gray-400 in original for analyzing, gray-500 for normal */
}

.analyzing-desc {
  color: var(--color-gray-400);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
