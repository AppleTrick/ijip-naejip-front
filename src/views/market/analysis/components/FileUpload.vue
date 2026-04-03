<script setup lang="ts">
import http from '@/api/http'
import { ref } from 'vue'
import { Check, RotateCcw, FileText } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'file-analyzed', data: { deposit: number, marketValue: number, priorDebt: number }): void
}>()
const isAnalyzing = ref<boolean>(false)
const isAnalyzed = ref<boolean>(false)
const analyzedSummary = ref<string>('')

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isAnalyzing.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await http.post('/ai/analyze-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const data = response.data.data
    // 데이터 보정 (null 체크)
    const result = {
      deposit: data.deposit || 0,
      marketValue: data.marketValue || 0,
      priorDebt: data.priorDebt || 0
    }

    analyzedSummary.value = data.summary || '문서 분석이 완료되었습니다.'
    isAnalyzed.value = true
    emit('file-analyzed', result)
    
  } catch (error) {
    console.error('OCR Error:', error)
    alert('문서 분석 중 오류가 발생했습니다.')
  } finally {
    isAnalyzing.value = false
    target.value = ''
  }
}

const resetUpload = () => {
  isAnalyzed.value = false
  analyzedSummary.value = ''
}
</script>

<template>
  <div>
    <!-- Analyzed State (Collapsed) -->
    <div v-if="isAnalyzed" class="analyzed-banner">
      <div class="banner-content">
        <div class="icon-circle">
          <Check class="check-icon" />
        </div>
        <div class="banner-text">
          <p class="banner-title">분석 완료</p>
          <p class="banner-summary">{{ analyzedSummary }}</p>
        </div>
      </div>
      <button @click="resetUpload" class="reset-btn" title="다른 파일 업로드">
        <RotateCcw class="reset-icon" />
        <span class="reset-label">다시 올리기</span>
      </button>
    </div>

    <!-- Upload State -->
    <div v-else class="upload-container" :class="{ 'is-loading': isAnalyzing }">
      <input 
        type="file" 
        accept=".pdf,.jpg,.png,.jpeg" 
        @change="handleFileUpload"
        class="upload-input"
        :disabled="isAnalyzing"
      >
      <div v-if="isAnalyzing" class="upload-content analyzing">
        <div class="spinner"></div>
        <p class="analyzing-title">AI가 문서를 꼼꼼히 읽고 있어요...</p>
        <p class="analyzing-desc">보증금, 시세, 선순위 채권을 찾고 있습니다.</p>
      </div>
      <div v-else class="upload-content">
        <FileText class="upload-icon-lg" />
        <p class="upload-title">등기부등본(이미지/PDF) 업로드</p>
        <p class="upload-desc">AI가 자동으로 숫자를 추출해 입력해줍니다.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  border: 2px dashed var(--color-gray-300);
  border-radius: 0.75rem;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  background-color: var(--color-white);
}

.upload-container:hover:not(.is-loading) {
  border-color: var(--color-primary);
  background-color: var(--color-primary-transparent-10);
}

.upload-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-input:disabled {
  cursor: not-allowed;
}

.upload-content {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon-lg {
  width: 2rem;
  height: 2rem;
  color: var(--color-gray-400);
  margin-bottom: 0.75rem;
}

.upload-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-700);
  margin-bottom: 0.25rem;
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

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* Analyzed Banner */
.analyzed-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f0fdf4; /* green-50 */
  border: 1px solid #bbf7d0; /* green-200 */
  border-radius: 0.75rem;
  animation: slideDown 0.3s ease-out;
  gap: 1rem; /* Add gap between main content and button */
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1; /* Allow content to take available space */
  min-width: 0; /* Prevent flex overload */
}

.icon-circle {
  width: 2rem;
  height: 2rem;
  background-color: #16a34a; /* green-600 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.banner-text {
  display: flex;
  flex-direction: column;
  min-width: 0; /* Enable text truncation if needed */
}

.banner-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #15803d; /* green-700 */
  margin: 0;
  white-space: nowrap;
}

.banner-summary {
  font-size: 0.875rem;
  color: #166534; /* green-800 */
  margin: 0.125rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0; /* Ensure button doesn't shrink */
  white-space: nowrap;
}

.reset-btn:hover {
  background-color: #dcfce7; /* green-100 */
}

.reset-icon {
  width: 0.875rem;
  height: 0.875rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
