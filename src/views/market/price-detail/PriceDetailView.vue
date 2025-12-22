<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import { useAuthStore } from '@/stores/auth'
import { useMarket } from '@/composables/useMarket'
import BaseButton from '@/components/common/BaseButton.vue'
import { ArrowLeft, Map as MapIcon, Image as ImageIcon, MessageSquare as ChatIcon, Check, Plus, Heart } from 'lucide-vue-next'
import { formatPrice } from '@/utils/formatters'
import TrendGraph from '@/components/features/sidebar/common/TrendGraph.vue'
import { searchApartmentImage } from '@/api/imageApi'
import { getNearestPanoId } from '@/api/imageApi2'
import { loadKakaoSDK } from '@/utils/kakaoLoader'
import { addFavorite, removeFavoriteByAptSeq, checkFavorite } from '@/api/favoriteApi'
import AIChatModal from '@/components/features/ai/AIChatModal.vue'

const route = useRoute()
const router = useRouter()
const store = useMainDataStore()
const statsStore = useMarketStatsStore()
const authStore = useAuthStore()
const { fetchPropertyDetail } = useMarket()
const { selectedProperty } = storeToRefs(store)
const { selectedPyung } = storeToRefs(statsStore)
const { isAuthenticated } = storeToRefs(authStore)
const { addToComparison, removeFromComparison, isInComparison } = store

// 관심 아파트 여부 (DB 기준)
const isFavorite = ref(false)

// 관심 아파트 클릭 핸들러
const handleFavoriteClick = async () => {
  if (!selectedProperty.value) return
  
  if (!isAuthenticated.value) {
    if (confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
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
        dealAmount: apt.dealAmount || ''
      })
      addToComparison(apt)
      isFavorite.value = true
    }
  } catch (error: any) {
    alert(error.message || '관심 등록 중 오류가 발생했습니다.')
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
    
    // 3. 미디어 로드 (로드뷰 + 이미지)
    if (selectedProperty.value) {
      const p = selectedProperty.value
      fetchMedia(p.aptNm, p.roadNm || '', Number(p.latitude), Number(p.longitude))
      analyzeAutomatedLocation(p.aptNm, p.roadNm || '')
      
      // 4. 관심 아파트 여부 확인 (로그인 시)
      if (isAuthenticated.value) {
        const pyung = Number(selectedPyung.value) || 0
        isFavorite.value = await checkFavorite(p.aptSeq, pyung)
      }
    }
  }
})

// Current Pyung Computation
const currentPyung = computed(() => selectedPyung.value || 'all')

// Chat Modal State
const isChatModalOpen = ref(false)
const openChatModal = () => isChatModalOpen.value = true

// Period Selection
const selectedPeriod = ref<'3y' | '6m'>('3y')

// Media State
const propertyImage = ref<string | null>(null)
const isImageLoading = ref(false)
const showRoadview = ref(true)
const roadviewRef = ref<HTMLElement | null>(null)
const roadviewInstance = ref<any>(null)
const hasRoadview = ref(false)
const currentPanoId = ref<number | null>(null)
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'

// Fetch Media Logic (Simplified - Matches ApartmentLevelView)
let latestMediaRequestId = 0
const fetchMedia = async (aptName: string, address: string = '', lat?: number, lng?: number) => {
  if (!aptName) return
  
  const requestId = ++latestMediaRequestId
  
  // 상태 초기화
  isImageLoading.value = true
  hasRoadview.value = false
  currentPanoId.value = null
  propertyImage.value = null
  showRoadview.value = true
  
  try {
    console.log(`[Media] Fetching for: ${aptName}, coords: ${lat}, ${lng}`)
    
    // 로드뷰와 이미지 동시 검색
    const [panoId, url] = await Promise.all([
      lat && lng ? getNearestPanoId(lat, lng) : Promise.resolve(null),
      searchApartmentImage(aptName, address)
    ])

    // 최신 요청만 반영
    if (requestId !== latestMediaRequestId) {
      console.log(`[Media] Request #${requestId} discarded`)
      return
    }

    console.log(`[Media] Results - PanoID: ${panoId}, Image: ${url ? 'OK' : 'Fallback'}`)
    
    hasRoadview.value = !!panoId
    currentPanoId.value = panoId
    showRoadview.value = !!panoId
    propertyImage.value = url || FALLBACK_IMAGE
  } catch (error) {
    if (requestId === latestMediaRequestId) {
      console.error('fetchMedia error:', error)
      propertyImage.value = FALLBACK_IMAGE
      hasRoadview.value = false
    }
  } finally {
    if (requestId === latestMediaRequestId) {
      isImageLoading.value = false
    }
  }
}

// 로드뷰 초기화 및 갱신 함수 (Simplified - Matches ApartmentLevelView)
const updateRoadview = () => {
  if (!roadviewRef.value || !currentPanoId.value || !window.kakao) {
    console.warn('[Media] Cannot update roadview (missing Ref or PanoID)')
    return
  }
  
  console.log(`[Media] Updating roadview with PanoID: ${currentPanoId.value}`)
  
  try {
    const rv = new window.kakao.maps.Roadview(roadviewRef.value)
    roadviewInstance.value = rv
    
    rv.setPanoId(currentPanoId.value, new window.kakao.maps.LatLng(
      selectedProperty.value?.latitude, 
      selectedProperty.value?.longitude
    ))
  } catch (e) {
    console.error('[Media] Roadview initialization error:', e)
  }
}

watch([showRoadview, currentPanoId], async ([newShow, newPano]) => {
  if (newShow && newPano) {
    await nextTick()
    await updateRoadview()
  }
})

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

const analyzeAutomatedLocation = async (aptName: string, address: string) => {
  if (!aptName || !address) return
  isAiAnalyzing.value = true
  aiAnalysisResult.value = ''
  
  try {
    const response = await fetch(`/api/v1/ai/location-attraction?aptName=${encodeURIComponent(aptName)}&address=${encodeURIComponent(address)}`)
    
    if (!response.body) return
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let rawAccumulator = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      rawAccumulator += chunk
      
      // Heuristic: Check if response is wrapped in JSON (e.g. CommonResponse)
      if (rawAccumulator.trim().startsWith('{')) {
        // Try to parse partial or full JSON to extract 'data'
        // Since we can't parse partial JSON easily, we'll wait or try regex for "data" field
        // But for better UX if it *is* streaming inside the JSON (unlikely), we might want to peek.
        // For now, let's rely on cleaning it up. 
        // If it is a single block JSON, we will just parse it at the end or regex match.
        try {
          // Attempt to find "data":"..." pattern even in partial string
          const match = rawAccumulator.match(/"data"\s*:\s*"(.*)/s) // Capture from data until end
          if (match && match[1]) {
             // We have the start of data. formatting might be tricky due to JSON escapes.
             // Simplest: If it's a short response, just wait for full parsing?
             // User wants it to look like it's streaming.
             // Let's just try to parse the whole thing if it looks like a complete JSON.
             const parsed = JSON.parse(rawAccumulator)
             if (parsed.data) {
                aiAnalysisResult.value = parsed.data
             }
          }
        } catch (e) {
          // Incomplete JSON, ignore
        }
      } else {
        // Standard SSE or Raw Text Stream
        const lines = chunk.split('\n')
        for (const line of lines) {
           if (line.startsWith('data:')) {
             // Handle standard SSE data: prefix
             const content = line.replace('data:', '')
             // If the content itself is the JSON {"code":...}, we handle that too?
             // Assuming Spring AI defaults: data: "text"
             aiAnalysisResult.value += content
           } else {
             // Raw text
             aiAnalysisResult.value += line
           }
        }
      }
    }
    
    // Final Safe Parse if JSON was fully accumulated but not streamed
    if (rawAccumulator.trim().startsWith('{')) {
       try {
          const parsed = JSON.parse(rawAccumulator)
          if (parsed && parsed.data) {
             aiAnalysisResult.value = parsed.data
          }
       } catch (e) {
          // Fallback: If parse fails, maybe it wasn't JSON or was cut off.
          // Try to clean up artifacts manually
          // console.warn("JSON Parse failed, showing raw", e)
       }
    }

  } catch (error) {
    console.error('Streaming Error:', error)
    if (!aiAnalysisResult.value) {
       aiAnalysisResult.value = '일시적인 오류로 분석을 완료할 수 없습니다.'
    }
  } finally {
    isAiAnalyzing.value = false
  }
}

// Watch logic to refetch detail if needed (e.g. pyung change)
watch([() => selectedProperty.value?.aptSeq, selectedPyung], async ([newId, newPyung], [oldId, oldPyung]) => {
  if (!newId) return
  if (newId !== oldId || newPyung !== oldPyung) {
    await fetchPropertyDetail(newId)
  }
  
  // New Property Loaded -> Trigger Media & AI Analysis
  if (newId !== oldId && selectedProperty.value) {
    const p = selectedProperty.value
    fetchMedia(p.aptNm, p.roadNm || '', Number(p.latitude), Number(p.longitude))
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
const handleImageError = () => propertyImage.value = FALLBACK_IMAGE

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
             <div class="media-container">
               <div v-if="isImageLoading" class="image-loader">
                 <div class="spinner"></div>
               </div>
               
               <div v-if="showRoadview && hasRoadview" ref="roadviewRef" class="roadview-container"></div>
               
               <img v-else :src="propertyImage || FALLBACK_IMAGE" 
                    alt="Property" class="header-image"
                    referrerpolicy="no-referrer"
                    @error="handleImageError"
                    :class="{ 'is-loading': isImageLoading }">
               
               <div class="header-overlay"></div>
               
               <div v-if="hasRoadview" class="media-toggle">
                 <button 
                   @click="showRoadview = !showRoadview" 
                   class="toggle-btn"
                   :title="showRoadview ? '사진 보기' : '로드뷰 보기'"
                 >
                   <component :is="showRoadview ? ImageIcon : MapIcon" class="icon-xs" />
                   <span>{{ showRoadview ? '사진' : '로드뷰' }}</span>
                 </button>
               </div>
             </div>
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
}

.media-container {
  position: relative;
  aspect-ratio: 16/10;
  background: var(--color-gray-100);
  overflow: hidden;
}

.header-image, .roadview-container {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  pointer-events: none;
}

.image-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.8);
  z-index: 10;
}

.media-toggle {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 5;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: rgba(0,0,0,0.9);
}

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
</style>
