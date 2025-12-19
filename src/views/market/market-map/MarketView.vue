<script setup lang="ts">
import { onMounted, computed } from 'vue'
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

const store = useMainDataStore()
const { filteredProperties } = storeToRefs(store)
const { selectProperty, setSearchQuery } = store
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

const handleFilter = (filters: any) => {
  store.setFilters(filters)
}

const handleMarkerSelect = (property: Property) => {
  console.log(`Clicked Marker: ${property.aptNm}, ${property.dealAmount}, Type: ${property.type}`)
  selectProperty(property)
  
  // 가격 정보 파싱 (utils/formatters.ts 사용)
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
    // APT와 APT_DONG 모두 아파트 상세 정보 조회
    // APT_DONG의 경우 primaryPyung이 있으면 해당 평형 데이터 요청
    const pyung = property.primaryPyung ? String(property.primaryPyung) : 'all'
    statsStore.selectApartment(property.aptSeq, pyung)
  } else {
    // 타입 정보가 누락된 경우, ID 접두사를 기반으로 추론하여 처리 (Fallback 로직)
    const id = property.aptSeq
    if (id.startsWith('city-')) {
      statsStore.selectDistrict({ id: id, name: property.aptNm, avgPrice })
    } else if (id.startsWith('gu-')) {
      statsStore.selectNeighborhood({ id: id, name: property.aptNm, avgPrice })
    } else if (id.startsWith('dong-')) {
      statsStore.selectDong({ id: id, name: property.aptNm, avgPrice })
    } else {
      statsStore.selectApartment(property.aptSeq, 'all')
    }
  }
}

// 지도 영역 변경 시 호출: 변경된 영역(bounds)에 해당하는 매물 데이터를 다시 가져옴
const handleBoundsUpdate = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }) => {
  await fetchProperties(undefined, bounds)
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
      
      <!-- 플로팅 검색바 -->
      <div class="floating-search">
        <div class="search-container">
          <MarketFilter @search="handleSearch" @filter="handleFilter" />
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

.floating-search {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: 90%;
  max-width: 600px;
}

.search-container {
  padding: 0.75rem;
}
</style>
