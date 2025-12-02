<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore } from '@/stores/safehome'
import { useMarketStatsStore } from '@/stores/marketStats'
import type { Property } from '@/api/types'
import KakaoMap from '@/components/features/map/KakaoMap.vue'
import MarketFilter from './components/MarketFilter.vue'
import MarketSidebar from './components/sidebar/MarketSidebar.vue'
import { useMarket } from '@/composables/useMarket'

const store = useSafeHomeStore()
const { filteredProperties } = storeToRefs(store)
const { selectProperty, setSearchQuery } = store
const { fetchProperties } = useMarket()
const statsStore = useMarketStatsStore()
const { currentRegion } = storeToRefs(statsStore)

const mapCenter = computed(() => {
  if (currentRegion.value && currentRegion.value.lat && currentRegion.value.lng) {
    return { lat: currentRegion.value.lat, lng: currentRegion.value.lng }
  }
  // Default center (Korea)
  return { lat: 36.5, lng: 127.5 }
})

const mapLevel = computed(() => {
  switch (statsStore.currentLevel) {
    case 'city': return 9
    case 'district': return 7
    case 'neighborhood': return 5
    case 'apartment': return 3
    default: return 9
  }
})

onMounted(async () => {
  // Initial fetch is triggered by map 'idle' event providing bounds
})

const handleSearch = (query: string) => {
  setSearchQuery(query)
}

const handleFilter = (filters: any) => {
  store.setFilters(filters)
}

const handleMarkerSelect = (property: Property) => {
  selectProperty(property)
  
  const id = property.aptSeq
  
  if (id.startsWith('city-')) {
    statsStore.selectDistrict({ id: id })
  } else if (id.startsWith('gu-')) {
    statsStore.selectDistrict({ id: id })
  } else if (id.startsWith('dong-')) {
    statsStore.selectNeighborhood({ id: id })
  } else {
    statsStore.selectApartment(property.aptSeq)
  }
}

const handleBoundsUpdate = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }) => {
  await fetchProperties(undefined, bounds)
}
</script>

<template>
  <div class="market-page">
    <!-- Left Sidebar -->
    <MarketSidebar />

    <!-- Map Area -->
    <div class="map-area">
      <KakaoMap 
        :markers="filteredProperties" 
        :center="mapCenter"
        :level="mapLevel"
        @select-marker="handleMarkerSelect" 
        @update-bounds="handleBoundsUpdate"
      />
      
      <!-- Floating Search Bar -->
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
