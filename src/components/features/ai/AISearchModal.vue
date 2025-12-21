<script setup lang="ts">
import { ref } from 'vue'
import { X, Search, Sparkles, Wand2, Loader2, MapPin } from 'lucide-vue-next'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps<{
  isOpen: boolean
  mode: 'semantic' | 'filter'
}>()

const emit = defineEmits(['close', 'search'])

const query = ref('')
const isSearching = ref(false)
const searchResult = ref<any>(null)

const handleSearch = async () => {
  if (!query.value.trim()) return
  
  isSearching.value = true
  // Simulate API call
  try {
    const response = await fetch('/api/v1/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.value })
    })
    const data = await response.json()
    searchResult.value = data.data
    emit('search', data.data)
  } catch (error) {
    console.error('AI Search Error:', error)
  } finally {
    isSearching.value = false
  }
}

const closeModal = () => {
  query.value = ''
  searchResult.value = null
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <Sparkles v-if="mode === 'semantic'" class="icon-primary" />
          <Wand2 v-else class="icon-secondary" />
          <h2>{{ mode === 'semantic' ? 'AI 의도 검색' : 'AI 자연어 필터' }}</h2>
        </div>
        <button class="close-btn" @click="closeModal">
          <X />
        </button>
      </div>

      <div class="modal-body">
        <p class="description">
          {{ mode === 'semantic' 
            ? '원하시는 거주 환경을 설명해 주세요. AI가 가장 적합한 매물을 찾아드립니다.' 
            : '원하는 매물 조건을 자연스럽게 말씀해 주세요. (예: 10억 이하 30평대 아파트)' }}
        </p>

        <div class="search-input-wrapper">
          <textarea 
            v-model="query" 
            :placeholder="mode === 'semantic' 
              ? '예: 직장이 강남역 근처이고 조용한 2인 가구용 아파트를 찾고 있어.' 
              : '예: 가격은 15억 이하, 방 3개 이상인 역세권 매물 보여줘.'"
            rows="3"
            class="search-textarea"
            @keyup.enter.ctrl="handleSearch"
          ></textarea>
          <div class="input-actions">
            <span class="tip">Ctrl + Enter로 검색</span>
            <BaseButton 
              variant="primary" 
              :disabled="isSearching || !query.trim()"
              @click="handleSearch"
            >
              <Loader2 v-if="isSearching" class="spin-icon" />
              <Search v-else class="btn-icon" />
              {{ isSearching ? '분석 중...' : '검색하기' }}
            </BaseButton>
          </div>
        </div>

        <div v-if="searchResult" class="result-container">
          <div class="analysis-box">
            <Sparkles class="sparkle-icon" />
            <p class="analysis-text">{{ searchResult.analysis }}</p>
          </div>
          
          <div v-if="searchResult.results?.length > 0" class="recommendations">
            <h3>추천 매물</h3>
            <div class="results-list">
              <div v-for="item in searchResult.results" :key="item.aptSeq" class="result-item">
                <MapPin class="pin-icon" />
                <div class="item-info">
                  <span class="apt-name">{{ item.aptNm }}</span>
                  <span class="apt-addr">{{ item.roadNm }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-white);
  width: 90%;
  max-width: 600px;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modal-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-gray-900);
  margin: 0;
}

.icon-primary { color: var(--color-primary); }
.icon-secondary { color: var(--color-secondary); }

.close-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.modal-body {
  padding: 1.5rem;
}

.description {
  color: var(--color-gray-600);
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 1rem;
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  transition: border-color 0.2s;
}

.search-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tip {
  font-size: 0.75rem;
  color: var(--color-gray-400);
}

.result-container {
  margin-top: 2rem;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.analysis-box {
  background-color: var(--color-primary-soft);
  padding: 1.25rem;
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-primary-transparent-10);
}

.sparkle-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.analysis-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-800);
  margin: 0;
}

.recommendations h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--color-gray-50);
  border-radius: 0.75rem;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: var(--color-gray-100);
}

.pin-icon {
  color: var(--color-primary);
  width: 1.25rem;
  height: 1.25rem;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.apt-name {
  font-weight: 700;
  font-size: 0.875rem;
}

.apt-addr {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

.spin-icon {
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
</style>
