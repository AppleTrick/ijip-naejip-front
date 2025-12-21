<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import type { Property } from '@/api/types'
import KakaoMap from '@/components/features/map/KakaoMap.vue'
import MarketFilter from './components/MarketFilter.vue'
import MarketSidebar from './components/MarketSidebar.vue'
import { useMarket } from '@/composables/useMarket'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { parseKoreanPrice } from '@/utils/formatters'
import { RotateCcw } from 'lucide-vue-next'

const store = useMainDataStore()
const { filteredProperties, filters } = storeToRefs(store)
const { selectProperty, setSearchQuery, setFilters } = store
const { fetchProperties } = useMarket()
const statsStore = useMarketStatsStore()
const { currentRegion } = storeToRefs(statsStore)

const mapCenter = computed(() => {
  // 1. 아파트가 선택된 경우, 해당 아파트 위치로 중심 이동
  if (store.selectedProperty) {
    const lat = Number(store.selectedProperty.latitude)
    const lng = Number(store.selectedProperty.longitude)
    return { lat, lng }
    
  }

  // 2. 선택된 아파트가 없으면 현재 지역(시/군/구)의 중심으로 이동
  if (currentRegion.value && currentRegion.value.lat && currentRegion.value.lng) {
    const lat = Number(currentRegion.value.lat)
    const lng = Number(currentRegion.value.lng)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng }
    }
  }
  
  // 3. 기본값: 서울시청 (초기 로딩 시 또는 데이터가 없을 때)
  return DEFAULT_MAP_CENTER
})

const mapLevel = computed(() => {
  switch (statsStore.currentLevel) {
    case 'city': return 9        // SIDO (> 9)
    case 'district': return 9    // GUGUN (<= 9)
    case 'neighborhood': return 5 // DONG (<= 5)
    case 'apartment': return 3   // APT (<= 4)
    default: return 9
  }
})

onMounted(async () => {
  // 초기 데이터 로딩은 지도의 'idle' 이벤트(영역 변경 감지)에 의해 트리거됩니다.
})

const handleSearch = (query: string) => {
  setSearchQuery(query)
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
const handleBoundsUpdate = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }) => {
  lastBounds.value = bounds // 마지막 영역 정보 업데이트
  await fetchProperties(filters.value, bounds)
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
</style>
