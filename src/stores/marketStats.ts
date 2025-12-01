import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as statsApi from '@/api/statsApi'
import type { RegionStats } from '@/api/statsApi'

export type ViewLevel = 'city' | 'district' | 'neighborhood' | 'apartment'

export const useMarketStatsStore = defineStore('marketStats', () => {
  const currentLevel = ref<ViewLevel>('city')
  const isSidebarOpen = ref(false)

  // 현재 지역 데이터 (자신)
  const currentRegion = ref<RegionStats | null>(null)

  // 하위 지역 목록 (자식)
  const statsList = ref<RegionStats[]>([])

  const selectedApartmentId = ref<string | null>(null)
  const isLoading = ref(false)

  // 액션
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const fetchCityStats = async () => {
    isLoading.value = true
    try {
      const data = await statsApi.getCityStats()
      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'city'
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  // district는 id만 있으면 됨
  const selectDistrict = async (district: { id: string }) => {
    isLoading.value = true
    try {
      const data = await statsApi.getDistrictStats(district.id)
      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'district'
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  const selectNeighborhood = async (neighborhood: { id: string }) => {
    isLoading.value = true
    try {
      const data = await statsApi.getNeighborhoodStats(neighborhood.id)
      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'neighborhood'
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  const selectApartment = (aptId: string) => {
    selectedApartmentId.value = aptId
    currentLevel.value = 'apartment'
    openSidebar()
  }

  const goBack = () => {
    if (currentLevel.value === 'apartment') {
      if (currentRegion.value) {
        currentLevel.value = 'neighborhood'
        selectedApartmentId.value = null
      } else {
        fetchCityStats()
      }
    } else if (currentLevel.value === 'neighborhood') {
      // 구 단계로 돌아가기
      if (currentRegion.value && currentRegion.value.parentId) {
        // 부모 구 데이터를 가져와야 함
        selectDistrict({ id: currentRegion.value.parentId })
      } else {
        fetchCityStats()
      }
    } else if (currentLevel.value === 'district') {
      // 시 단계로 돌아가기
      if (currentRegion.value && currentRegion.value.parentId) {
        // 부모(시) 데이터로 이동 (예: 강남구 -> 서울시)
        selectDistrict({ id: currentRegion.value.parentId })
      } else {
        // 부모가 없으면 최상위(전국)로 이동 (예: 서울시 -> 전국)
        fetchCityStats()
      }
    }
  }

  return {
    currentLevel,
    isSidebarOpen,
    currentRegion,
    statsList,
    selectedApartmentId,
    isLoading,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    fetchCityStats,
    selectDistrict,
    selectNeighborhood,
    selectApartment,
    goBack
  }
})
