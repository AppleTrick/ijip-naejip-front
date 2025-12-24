<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useMarket } from '@/composables/useMarket'
import BaseButton from '@/components/common/BaseButton.vue'
import { ArrowLeft, MessageSquare as ChatIcon, Heart } from 'lucide-vue-next'
import { formatPrice } from '@/utils/formatters'
import TrendGraph from '@/components/features/sidebar/common/TrendGraph.vue'
import { loadKakaoSDK } from '@/utils/kakaoLoader'
import http from '@/api/http'
import { addFavorite, removeFavoriteByAptSeq, checkFavorite } from '@/api/favoriteApi'
import AIChatModal from '@/components/features/ai/AIChatModal.vue'
import AptRoadview from '@/components/features/apt/AptRoadview.vue'

const route = useRoute()
const router = useRouter()
const store = useMainDataStore()
const statsStore = useMarketStatsStore()
const authStore = useAuthStore()
const { fetchPropertyDetail } = useMarket()
const { selectedProperty } = storeToRefs(store)
const { selectedPyung } = storeToRefs(statsStore)
const { isAuthenticated } = storeToRefs(authStore)
const { addToComparison, removeFromComparison } = store

const uiStore = useUiStore()

// 관심 아파트 여부 (DB 기준)
const isFavorite = ref(false)

// 관심 아파트 클릭 핸들러
const handleFavoriteClick = async () => {
  if (!selectedProperty.value) return
  
  if (!isAuthenticated.value) {
    const confirmed = await uiStore.showConfirm({
      title: '로그인 필요',
      message: '로그인이 필요한 서비스입니다. 로그인 페이지로 이동할까요?'
    })
    if (confirmed) {
      router.push('/login')
    }
    return
  }
  
  const apt = selectedProperty.value
  const pyung = Number(selectedPyung.value) || 0
  
  try {
    if (isFavorite.value) {
      await removeFavoriteByAptSeq(apt.aptSeq)
      removeFromComparison(apt.aptSeq)
      isFavorite.value = false
    } else {
      await addFavorite({
        aptSeq: apt.aptSeq,
        aptName: apt.aptNm,
        address: apt.roadNm || '',
        pyung: pyung,
        dealAmount: apt.dealAmount || '',
        latitude: Number(apt.latitude),
        longitude: Number(apt.longitude)
      })
      addToComparison(apt)
      isFavorite.value = true
    }
  } catch (error: any) {
    uiStore.showAlert(error.message || '관심 등록 중 오류가 발생했습니다.', '오류', 'error')
  }
}

// Route ID handling
const propertyId = route.params.id as string

// Init Data (called on page refresh)
onMounted(async () => {
  if (propertyId) {
    // 1. 카카오 SDK 로드 (URL 직접 접근 시 필수)
    await loadKakaoSDK()
    
    // 2. 매물 상세 정보 로드
    await fetchPropertyDetail(propertyId)
    
        // 3. 미디어 로드 및 AI 분석
      // Note: fetchMedia and analyzeAutomatedLocation are handled by the watch
      // on selectedProperty and selectedPyung with { immediate: true }.
      // No need to call them manually here after fetchPropertyDetail.
    }
})

// Current Pyung Computation
const currentPyung = computed(() => selectedPyung.value || 'all')

// Chat Modal State
const isChatModalOpen = ref(false)
const openChatModal = () => isChatModalOpen.value = true

// Period Selection
const selectedPeriod = ref<'3y' | '6m'>('3y')

// Filtered Price Trend
const filteredPriceTrend = computed(() => {
  if (!selectedProperty.value?.priceTrend) return []
  return selectedPeriod.value === '3y' 
    ? selectedProperty.value.priceTrend 
    : selectedProperty.value.priceTrend.slice(-6)
})

// AI Analysis State
const aiAnalysisResult = ref('')
const isAiAnalyzing = ref(false)
let currentAbortController: AbortController | null = null

const analyzeAutomatedLocation = async (aptName: string, address: string) => {
  if (!aptName || !address) return
  
  if (currentAbortController) {
    currentAbortController.abort()
  }
  
  currentAbortController = new AbortController()
  isAiAnalyzing.value = true
  aiAnalysisResult.value = ''
  
  try {
    const response = await http.get('/api/v1/ai/location-attraction', {
      params: { aptName, address },
      signal: currentAbortController.signal
    })
    
    if (response.data && response.data.data) {
      aiAnalysisResult.value = response.data.data
    }
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message === 'canceled') {
      console.log('AI Analysis request aborted')
      return
    }
    console.error('AI Analysis Error:', error)
    aiAnalysisResult.value = '일시적인 오류로 분석을 완료할 수 없습니다.'
  } finally {
    isAiAnalyzing.value = false
    currentAbortController = null
  }
}

// Watch logic to refetch detail if needed (e.g. pyung change)
watch([() => selectedProperty.value?.aptSeq, selectedPyung], async ([newId, newPyung], [oldId, oldPyung]) => {
  if (!newId) return
  
  const pyung = Number(newPyung) || 0

  if (newId !== oldId || newPyung !== oldPyung) {
    await fetchPropertyDetail(newId)
    
    // Update Favorite status
    if (isAuthenticated.value && selectedProperty.value) {
      isFavorite.value = await checkFavorite(selectedProperty.value.aptSeq, pyung)
    }
  }
  
  // New Property (Apartment) Loaded -> Trigger Media & AI Analysis
  // We ONLY trigger these when the apartment itself changes, NOT when only pyung changes.
  if (newId !== oldId && selectedProperty.value) {
    const p = selectedProperty.value
    // Trigger Fast AI Analysis
    analyzeAutomatedLocation(p.aptNm, p.roadNm || '')
  }
}, { immediate: true })

const handlePyungSelect = (pyung: string) => {
  if (!selectedProperty.value) return
  statsStore.selectApartment(selectedProperty.value.aptSeq, pyung)
}

const displayPrice = computed(() => selectedProperty.value?.dealAmount || '0억')

const formatDate = (dateNum: number) => {
  if (!dateNum) return '-'
  const str = String(dateNum)
  return str.length === 8 ? `${str.substring(0, 4)}.${str.substring(4, 6)}.${str.substring(6, 8)}` : str
}

const goBack = () => router.back()

// Scroll restoration
onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="price-detail-view">
    <div class="container" v-if="selectedProperty">
      <!-- Header -->
      <header class="detail-header">
        <button class="back-btn" @click="goBack">
          <ArrowLeft class="icon" />
        </button>
        <div class="header-content">
          <h1 class="apt-name">{{ selectedProperty.aptNm }}</h1>
          <p class="apt-address">📍 {{ selectedProperty.roadNm }}</p>
        </div>
        <div class="header-actions">
           <button 
            @click="handleFavoriteClick"
            class="action-btn compare-btn"
            :class="{ active: isFavorite }"
          >
            <Heart class="icon-sm" :class="{ 'fill-red': isFavorite }" />
            {{ isFavorite ? '관심 등록됨' : '관심 등록' }}
          </button>
          <BaseButton variant="primary" class="action-btn" @click="openChatModal">
            <ChatIcon class="icon-sm mr-1" /> AI 에이전트 질문
          </BaseButton>
        </div>
      </header>

      <!-- Main Layout -->
      <div class="detail-grid">
        <!-- Left Column: Media & Info -->
        <div class="left-column">
          <!-- Media Section -->
          <div class="media-section">
            <AptRoadview 
              v-if="selectedProperty"
              :apt-seq="selectedProperty.aptSeq"
              :apt-nm="selectedProperty.aptNm"
              :address="selectedProperty.roadNm"
              :latitude="selectedProperty.latitude"
              :longitude="selectedProperty.longitude"
            />
          </div>

          <!-- Basic Info Specs -->
           <div class="info-card">
            <h2 class="card-title">단지 정보</h2>
            <div class="specs-grid">
              <div class="spec-item">
                <span class="label">대표 가격</span>
                <span class="value price">{{ displayPrice }}</span>
              </div>
               <div class="spec-item">
                <span class="label">건축년도</span>
                <span class="value">{{ selectedProperty.buildYear }}년</span>
              </div>
              <div class="spec-item">
                <span class="label">층수</span>
                <span class="value">{{ selectedProperty.floor }}층</span>
              </div>
               <div class="spec-item">
                <span class="label">면적</span>
                <span class="value">{{ selectedProperty.excluUseAr }}평</span>
              </div>
            </div>
            <p class="description">{{ selectedProperty.description }}</p>
          </div>
          
          <!-- AI Location Attraction Card -->
          <div class="ai-location-card">
            <div class="card-header">
              <h3 class="card-title">✨ AI 동네 매력 분석</h3>
              <span class="ai-badge">GPT-5 Turbo</span>
            </div>
            
            <div v-if="isAiAnalyzing" class="ai-loading">
              <div class="spinner-sm"></div>
              <span>동네 매력을 분석하고 있어요...</span>
            </div>
            
            <div v-else class="ai-content">
              <p class="ai-text">{{ aiAnalysisResult }}</p>
            </div>
            
            <BaseButton variant="outline" size="sm" class="mt-4 w-full" @click="openChatModal">
              <ChatIcon class="icon-xs mr-1" /> 더 자세히 물어보기
            </BaseButton>
          </div>
        </div>

        <!-- Right Column: Chart & History -->
        <div class="right-column">
          <!-- Pyung Selector -->
          <div class="pyung-selector">
             <button class="pyung-chip" :class="{ active: currentPyung === 'all' }" @click="handlePyungSelect('all')">전체</button>
             <button 
              v-for="p in selectedProperty.pyungList" 
              :key="p" 
              class="pyung-chip" 
              :class="{ active: currentPyung === p }" 
              @click="handlePyungSelect(p)"
            >
              {{ p }}평
            </button>
          </div>

          <!-- Price Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>실거래가 추이</h3>
               <div class="period-toggle">
                <button :class="{ active: selectedPeriod === '3y' }" @click="selectedPeriod = '3y'">3년</button>
                <button :class="{ active: selectedPeriod === '6m' }" @click="selectedPeriod = '6m'">6개월</button>
              </div>
            </div>
             <div class="chart-box">
              <TrendGraph :data="filteredPriceTrend" :height="300" color="var(--color-primary)" />
            </div>
          </div>

          <!-- Transaction History -->
          <div class="history-card">
            <h3>최근 실거래 내역</h3>
            <div class="history-list">
              <div v-for="(deal, idx) in selectedProperty.deals" :key="idx" class="history-item">
                <span class="date">{{ formatDate(deal.dealDate) }}</span>
                <div class="deal-meta">
                  <span class="floor">{{ deal.floor }}층</span>
                  <span class="area">{{ deal.excluUseAr }}평</span>
                </div>
                <span class="amount">{{ formatPrice(deal.dealAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- AI Chat Modal -->
    <AIChatModal 
      :is-open="isChatModalOpen" 
      :apartment-name="selectedProperty?.aptNm || ''"
      :area-code="String(selectedProperty?.aptSeq || 0)"
      @close="isChatModalOpen = false"
    />
  </div>
</template>

<style scoped>
.price-detail-view {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding-bottom: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.detail-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--color-gray-50);
}

.header-content {
  flex: 1;
}

.apt-name {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.apt-address {
  color: var(--color-text-light);
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border-radius: 0.6rem;
}

.compare-btn {
  background: white;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
}

.compare-btn.active {
  background: var(--color-primary-transparent-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Layout */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.media-section {
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: white;
  aspect-ratio: 16/10;
  width: 100%;
}

/* Unused old media classes removed */

.info-card, .chart-card, .history-card {
  background: white;
  border-radius: 1.2rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.spec-item .label {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.spec-item .value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.spec-item .price {
  color: var(--color-primary);
  font-weight: 800;
  font-size: 1.4rem;
}

.description {
  line-height: 1.6;
  color: var(--color-gray-600);
  background: var(--color-gray-50);
  padding: 1rem;
  border-radius: 0.8rem;
}

.ai-location-card {
  background: white;
  border-radius: 1.2rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  background: linear-gradient(to bottom right, #ffffff, #f8faff);
  border: 1px solid #e0e7ff;
}

.ai-location-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ai-location-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-badge {
  font-size: 0.75rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-weight: 600;
}

.ai-loading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-gray-500);
  font-size: 0.95rem;
  padding: 1rem 0;
}

.spinner-sm {
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.ai-content {
  min-height: 4rem;
}

.ai-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-gray-700);
  white-space: pre-line; /* Handle newlines from AI */
}

.mt-4 { margin-top: 1rem; }
.w-full { width: 100%; }

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pyung-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.pyung-chip {
  padding: 0.5rem 1.2rem;
  border-radius: 2rem;
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-gray-600);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.pyung-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pyung-chip.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
}

.period-toggle {
  display: flex;
  background: var(--color-gray-100);
  padding: 0.25rem;
  border-radius: 0.6rem;
}

.period-toggle button {
  padding: 0.4rem 0.8rem;
  border: none;
  background: none;
  font-size: 0.85rem;
  color: var(--color-gray-500);
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
}

.period-toggle button.active {
  background: white;
  color: var(--color-primary);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.chart-box {
  height: 300px;
}

.history-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-100);
}

.history-item:last-child {
  border-bottom: none;
}

.history-item .date {
  color: var(--color-text-light);
  font-size: 0.95rem;
  width: 100px;
}

.deal-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-gray-600);
}

.history-item .amount {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.1rem;
}

.icon { width: 1.5rem; height: 1.5rem; }
.icon-sm { width: 1.2rem; height: 1.2rem; }
.icon-md { width: 1.5rem; height: 1.5rem; }
.icon-xs { width: 1rem; height: 1rem; }
.mr-1 { margin-right: 0.25rem; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
