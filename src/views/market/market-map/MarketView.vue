<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import type { Property } from '@/api/types'
import KakaoMap from '@/components/features/map/KakaoMap.vue'
import MarketFilter from './components/MarketFilter.vue'
import MarketSidebar from './components/MarketSidebar.vue'
import { useMarket } from '@/composables/useMarket'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { parseKoreanPrice } from '@/utils/formatters'
import { RotateCcw, Sparkles, Wand2, LayoutDashboard, Bot, SlidersHorizontal } from 'lucide-vue-next'
import AISearchModal from '@/components/features/ai/AISearchModal.vue'
import AIStatsModal from '@/components/features/ai/AIStatsModal.vue'
import AIFloatingButton from '@/components/common/AIFloatingButton.vue'


const router = useRouter()
const authStore = useAuthStore()
const store = useMainDataStore()
const { filteredProperties, filters } = storeToRefs(store)
const { selectProperty, setSearchQuery, setFilters } = store
const { fetchProperties } = useMarket()
const statsStore = useMarketStatsStore()
const { currentRegion } = storeToRefs(statsStore)

const isAIModalOpen = ref(false)
const isStatsModalOpen = ref(false)
const aiMode = ref<'semantic' | 'filter'>('semantic')
const isShowingAIResults = ref(false) // AI 추천 결과가 지도에 표시 중인지 여부

const openSemanticSearch = () => {
  aiMode.value = 'semantic'
  isAIModalOpen.value = true
}

const openNaturalFilter = () => {
  aiMode.value = 'filter'
  isAIModalOpen.value = true
}

const openStatsSearch = () => {
  isStatsModalOpen.value = true
}

const handleAiAnalysisClick = () => {
  if (!authStore.isAuthenticated) {
    if (confirm('AI 부동산 분석은 로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
      router.push('/login')
    }
    return
  }
  openStatsSearch()
}

const handleAISearchResult = (result: any) => {
  console.log('AI Search Result:', result)
  // For filters, we could update the store here
  if (aiMode.value === 'filter' && result.filters) {
    setFilters(result.filters)
    isAIModalOpen.value = false // 필터 적용 후 모달 닫기
  }
}

const handleMoveLocation = (location: { lat: number, lng: number, aptSeq?: string }) => {
  if (location.lat && location.lng) {
    // 지도 중심 이동 및 줌 레벨 조정
    mapCenter.value = { lat: location.lat, lng: location.lng }
    mapLevel.value = 3 
    
    // 모달은 AISearchModal 내부에서 이미 닫힘(closeModal 호출) 
    // 하지만 상태 동기화를 위해 여기서 명시적으로 false 처리해도 좋음 (이벤트 흐름상 자동 처리됨)
  }
}

// 지도의 현재 상태 관리 (URL 쿼리 파라미터 우선 적용)
const currentQuery = router.currentRoute.value.query
const initialLat = currentQuery.lat ? Number(currentQuery.lat) : DEFAULT_MAP_CENTER.lat
const initialLng = currentQuery.lng ? Number(currentQuery.lng) : DEFAULT_MAP_CENTER.lng
const initialLevel = currentQuery.level ? Number(currentQuery.level) : 9

const mapCenter = ref<{ lat: number, lng: number }>({ lat: initialLat, lng: initialLng })
const mapLevel = ref<number>(initialLevel)

// 1. 선택된 아파트나 지역이 변경될 때 지도를 이동시킴
watch([() => store.selectedProperty, currentRegion], ([prop, region], [oldProp, oldRegion]) => {
  // 검색 중이거나 초기화 중인 경우를 위해 이전 값과 비교하여 유의미한 변화가 있을 때만 이동
  const isAptChanged = prop && prop.aptSeq !== oldProp?.aptSeq
  const isRegionChanged = region && region.id !== oldRegion?.id

  // 아파트가 선택된 경우 우선순위 (새로 선택된 경우에만 이동)
  if (isAptChanged) {
    const lat = Number(prop.latitude)
    const lng = Number(prop.longitude)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      mapCenter.value = { lat, lng }
    }
    return
  }

  // 선택된 지역(시/군/구)이 새로 변경된 경우에만 이동
  if (isRegionChanged && region.lat && region.lng) {
    const lat = Number(region.lat)
    const lng = Number(region.lng)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      mapCenter.value = { lat, lng }
      
      // 지역 레벨에 따른 줌 레벨 설정
      switch (statsStore.currentLevel) {
        case 'city': mapLevel.value = 9; break
        case 'district': mapLevel.value = 9; break
        case 'neighborhood': mapLevel.value = 5; break
        case 'dong': mapLevel.value = 5; break
        default: mapLevel.value = 9
      }
    }
  }
}, { immediate: false }) // 초기값에 의한 스냅백 방지를 위해 immediate: false로 설정

// 검색 시에는 mapCenter와 mapLevel을 직접 업데이트합니다.

onMounted(async () => {
  // 초기 로딩 시 AI 결과 모드 해제 상태임을 보장
  isShowingAIResults.value = false
  
  if (currentQuery.lat && currentQuery.lng) {
    console.log(`MarketView 마운트: ${currentQuery.lat}, ${currentQuery.lng} 위치로 초기화 시도 (레벨: ${initialLevel})`)
  }
})

const handleSearch = (query: string) => {
  if (!query || !query.trim()) return
  
  handleResetAIResults() // 일반 검색 시 AI 결과 모드 해제
  setSearchQuery(query)

  // 카카오맵 장소 검색 서비스 객체 생성
  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    console.error('카카오맵 서비스 로드되지 않음')
    return
  }

  const ps = new window.kakao.maps.services.Places()

  // 키워드로 장소를 검색합니다
  ps.keywordSearch(query, (data: any, status: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      // 검색 결과 중 가장 첫 번째 장소의 정보를 기반으로 이동
      const firstResult = data[0]
      const newPos = {
        lat: Number(firstResult.y),
        lng: Number(firstResult.x)
      }
      
      // 장소 성격(카테고리)에 따른 스마트 줌 레벨 결정 (marketApi Scope 기준)
      let targetLevel = 5 
      const category = firstResult.category_name || ''
      const name = firstResult.place_name || ''
      
      if (category.includes('아파트') || name.includes('아파트')) {
        targetLevel = 2 // APT 레벨
      } else if (category.includes('지하철')) {
        targetLevel = 3 // DONG/역세권 레벨
      } else if (category.includes('동') || category.includes('읍') || category.includes('면')) {
        targetLevel = 5 // DONG 레벨
      } else if (category.includes('구') || category.includes('군')) {
        targetLevel = 7 // GUGUN 레벨
      } else if (category.includes('시') || category.includes('도')) {
        targetLevel = 10 // SIDO 레벨 (제주도, 서울시 등)
      } else {
        targetLevel = 5 // 기본값
      }
      
      // mapCenter와 mapLevel을 업데이트하여 지도를 이동시킵니다.
      mapCenter.value = newPos
      mapLevel.value = targetLevel
      
      // 검색 시 선택된 특정 매물 정보는 해제합니다.
      selectProperty(null)
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 없습니다.')
    } else {
      alert('검색 중 오류가 발생했습니다.')
    }
  })
}

// 지도의 마지막 영역 정보를 저장 (필터 변경 시 재사용)
const lastBounds = ref<any>(null)
const filterRef = ref<any>(null)

const isFilterActive = computed(() => {
  return filters.value.priceRange.min > 0 || filters.value.priceRange.max < 100 || 
         filters.value.areaRange.min > 0 || filters.value.areaRange.max < 100
})

const handleFilter = (newFilters: any) => {
  setFilters(newFilters)
}

const resetAll = () => {
  handleResetAIResults() // 초기화 시 AI 결과 모드 해제
  filterRef.value?.resetFilters()
}

// 필터 변경 감지: 필터가 변경되면 지도의 마지막 영역 정보를 기반으로 데이터를 다시 가져옵니다.
watch(filters, async (newFilters) => {
  if (lastBounds.value) {
    await fetchProperties(newFilters, lastBounds.value)
  }
}, { deep: true })

const handleMarkerSelect = (property: Property) => {
  // 이미 선택된 매물과 같은 매물을 클릭한 경우, 상세 정보를 덮어쓰지 않도록 함
  if (store.selectedProperty?.aptSeq !== property.aptSeq) {
    selectProperty(property)
  }
  
    let avgPrice = 0
  if (property.dealAmount) {
    avgPrice = parseKoreanPrice(property.dealAmount)
  }

  // 마커 타입에 따라 적절한 스토어 액션 호출 (사이드바 상태 변경 등)
  // 이름(name)도 함께 전달하여 사이드바 타이틀이 ID가 아닌 지역명으로 나오도록 함
  if (property.type === 'SIDO') {
    statsStore.selectDistrict({ id: property.aptSeq, name: property.aptNm, avgPrice })
  } else if (property.type === 'GUGUN') {
    statsStore.selectNeighborhood({ id: property.aptSeq, name: property.aptNm, avgPrice })
  } else if (property.type === 'DONG') {
    statsStore.selectDong({ id: property.aptSeq, name: property.aptNm, avgPrice })
  } else if (property.type === 'APT' || property.type === 'APT_DONG') {
    const pyung = property.primaryPyung ? String(property.primaryPyung) : 'all'
    statsStore.selectApartment(property.aptSeq, pyung)
  } 
  // else {
  //   const id = property.aptSeq
  //   if (id.startsWith('city-')) {
  //     statsStore.selectDistrict({ id: id, name: property.aptNm, avgPrice })
  //   } else if (id.startsWith('gu-')) {
  //     statsStore.selectNeighborhood({ id: id, name: property.aptNm, avgPrice })
  //   } else if (id.startsWith('dong-')) {
  //     statsStore.selectDong({ id: id, name: property.aptNm, avgPrice })
  //   } else {
  //     statsStore.selectApartment(property.aptSeq, 'all')
  //   }
  // }
}

// 지도 영역 변경 시 호출: 변경된 영역(bounds)에 해당하는 매물 데이터를 다시 가져옴
const handleBoundsUpdate = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number, centerLat: number, centerLng: number }) => {
  lastBounds.value = bounds // 마지막 영역 정보 업데이트
  
  // 지도의 현재 상태(줌, 좌표)를 부모 상태와 동기화하여 스냅백 현상 방지
  if (mapLevel.value !== bounds.level) {
    mapLevel.value = bounds.level
  }
  
  const latDiff = Math.abs(mapCenter.value.lat - bounds.centerLat)
  const lngDiff = Math.abs(mapCenter.value.lng - bounds.centerLng)
  if (latDiff > 0.00001 || lngDiff > 0.00001) {
    mapCenter.value = { lat: bounds.centerLat, lng: bounds.centerLng }
  }
  
  console.log('Bounds Update:', bounds.level, bounds.centerLat)
  if (isShowingAIResults.value) {
    console.log('AI 추천 결과 유지 중 - 자동 새로고침 스킵')
    return
  }

  console.log('Fetching properties for scope:', bounds.level)
  await fetchProperties(filters.value, bounds)
}

const handleResetAIResults = () => {
  isShowingAIResults.value = false
  if (lastBounds.value) {
    fetchProperties(filters.value, lastBounds.value)
  }
}
</script>

<template>
  <div class="market-page">
    <!-- 왼쪽 사이드바 -->
    <MarketSidebar />

    <!-- 지도 영역 -->
    <div class="map-area">
      <KakaoMap 
        :markers="filteredProperties" 
        :center="mapCenter"
        :level="mapLevel"
        @select-marker="handleMarkerSelect" 
        @update-bounds="handleBoundsUpdate"
      />
      
      <!-- 플로팅 검색바 패키지: 중앙 정렬 유지용 -->
      <div class="floating-search-package">
        <!-- 검색바 본체 -->
        <div class="search-container">
          <MarketFilter ref="filterRef" @search="handleSearch" @filter="handleFilter" />
          
          <!-- 초기화 버튼: 컨테이너 우측 외부에 절대 위치로 배치 -->
          <button v-if="isFilterActive" @click.stop="resetAll" class="floating-reset-btn">
            <RotateCcw class="reset-icon" />
            <span>초기화</span>
          </button>
        </div>
      </div>
      <div class="ai-fab-container">
        <AIFloatingButton 
          label="AI 아파트 추천" 
          title="AI 아파트 추천" 
          variant="semantic" 
          @click="openSemanticSearch"
        >
          <template #icon><Sparkles /></template>
        </AIFloatingButton>
        
        <AIFloatingButton 
          label="AI 필터링 설정" 
          title="AI 자연어 필터링" 
          variant="filter" 
          @click="openNaturalFilter"
        >
          <template #icon><SlidersHorizontal /></template>
        </AIFloatingButton>

        <AIFloatingButton 
          label="AI 부동산 분석" 
          title="AI 부동산 분석" 
          variant="stats" 
          @click="handleAiAnalysisClick"
        >
          <template #icon><Bot /></template>
        </AIFloatingButton>
      </div>

      <!-- AI 검색 모달 -->
      <AISearchModal 
        :is-open="isAIModalOpen" 
        :mode="aiMode" 
        @close="isAIModalOpen = false"
        @search="handleAISearchResult"
        @move-location="handleMoveLocation"
      />

      <!-- AI 통계 분석 모달 -->
      <AIStatsModal 
        :is-open="isStatsModalOpen" 
        @close="isStatsModalOpen = false"
        @move-location="handleMoveLocation"
      />
    </div>
  </div>
</template>

<style scoped>
.market-page {
  flex: 1;
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
}

.map-area {
  flex: 1;
  position: relative;
}

.floating-search-package {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
}

.floating-search-package > * {
  pointer-events: auto; /* 자식 요소들은 클릭 가능 */
}

.search-container {
  position: relative; /* 버튼의 기준점 */
  padding: 0;
  display: flex;
  align-items: center;
  border-radius: 1rem;
  pointer-events: auto;
}

.floating-reset-btn {
  position: absolute;
  left: calc(100% + 0.75rem); /* 검색창 우측 끝에서 0.75rem 띄움 */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.25rem;
  height: 3.25rem;
  background-color: var(--color-white);
  border: none;
  border-radius: 1rem;
  font-weight: 700;
  color: var(--color-gray-700);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  pointer-events: auto;
}

.floating-reset-btn:hover {
  background-color: var(--color-gray-50);
  color: var(--color-primary);
  transform: translateY(calc(-50% - 2px)); /* 수직 중앙 유지하며 살짝 위로 */
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
}

.reset-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* AI FAB Styles */
.ai-fab-container {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 25;
  align-items: flex-end; /* 오른쪽 정렬로 변경하여 개별 확장 시 영향 없도록 함 */
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .ai-fab-container {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
