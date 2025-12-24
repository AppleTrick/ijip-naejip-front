<script setup lang="ts">
import { ref } from 'vue'
import { X, Search, Sparkles, Wand2, Loader2, MapPin, ArrowRight } from 'lucide-vue-next'
import BaseButton from '@/components/common/BaseButton.vue'
import http from '@/api/http'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{
  isOpen: boolean
  mode: 'semantic' | 'filter'
}>()

const emit = defineEmits(['close', 'search', 'move-location'])

const query = ref('')
const isSearching = ref(false)
const searchResult = ref(null as any)

const uiStore = useUiStore()

const handleMove = (item: any) => {
  console.log('handleMove Item:', item)
  
  // 백엔드 응답 형식에 따라 lat/lng 또는 latitude/longitude 모두 지원
  const lat = Number(item.lat ?? item.latitude)
  const lng = Number(item.lng ?? item.longitude)
  
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    emit('move-location', {
      lat: lat,
      lng: lng,
      aptSeq: item.aptSeq
    })
    closeModal()
  } else {
    console.warn('Invalid coordinates for item:', item)
    uiStore.showAlert('위치 정보가 올바르지 않습니다. 다른 매물을 선택해 주세요.', '알림', 'error')
  }
}


const handleSearch = async () => {
  if (!query.value.trim()) return
  
  isSearching.value = true
  searchResult.value = null // 이전 결과 초기화 (깜빡임 방지)
  try {
    const endpoint = props.mode === 'semantic' ? '/api/v1/ai/search' : '/api/v1/ai/parse-filter'
    const response = await http.post(endpoint, { query: query.value })
    searchResult.value = response.data.data
    emit('search', response.data.data)
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
  <div v-if="isOpen" class="modal-overlay"> <!-- 오버레이 클릭 닫기 제거 -->
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

        <div v-if="isSearching" class="loading-state">
          <div class="loader-content">
            <Loader2 class="spin-icon-lg" />
            <p>AI가 고객님의 요청을 분석하고 있어요... 🧐</p>
            <span class="sub-text">잠시만 기다려주세요!</span>
          </div>
        </div>

        <div v-if="searchResult && !isSearching" class="result-container">
          <div class="analysis-box">
            <Sparkles class="sparkle-icon" />
            <p class="analysis-text">{{ searchResult.analysis }}</p>
          </div>
          
          <div v-if="searchResult.results?.length > 0" class="recommendations">
            <h3>추천 매물</h3>
            <div class="results-list">
              <div v-for="item in searchResult.results" :key="item.aptSeq" class="result-item">
                <div class="result-content">
                  <MapPin class="pin-icon" />
                  <div class="item-info">
                    <span class="apt-name">{{ item.aptName }}</span>
                    <span class="apt-addr">{{ item.dongName }}</span>
                  </div>
                </div>
                <button class="move-btn" @click="handleMove(item)">
                  이동
                  <ArrowRight class="btn-icon-xxs" />
                </button>
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
  max-height: 80vh; /* 높이 제한 */
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex; /* Flexbox 적용 */
  flex-direction: column; /* 세로 정렬 */
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
  overflow-y: auto; /* 내용이 길면 스크롤 */
  flex: 1; /* 남은 공간 차지 */
}

.description {
  color: var(--color-gray-600);
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
}

/* Restored and fixed CSS */
.search-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
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
  box-sizing: border-box;
}

.search-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
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
  white-space: pre-wrap; /* 줄바꿈 지원 */
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

.result-item {
  justify-content: space-between; /* 양끝 정렬 */
}

.result-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.move-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-primary);
  background-color: var(--color-primary-transparent-10);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.move-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-icon-xxs {
  width: 0.875rem;
  height: 0.875rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  animation: fade-in 0.3s ease-out;
}

.loader-content {
  text-align: center;
  color: var(--color-gray-600);
}

.loader-content p {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-gray-900);
}

.sub-text {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
}

.spin-icon-lg {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}
</style>
