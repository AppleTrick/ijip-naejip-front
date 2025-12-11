import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as statsApi from '@/api/statsApi'
import type { RegionStats } from '@/api/statsApi'

export type ViewLevel = 'city' | 'district' | 'neighborhood' | 'dong' | 'apartment'

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

  const selectDong = async (dong: { id: string }) => {
    isLoading.value = true
    try {
      const data = await statsApi.getDongStats(dong.id)
      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'dong'
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
        currentLevel.value = 'dong'
        selectedApartmentId.value = null
      } else {
        fetchCityStats()
      }
    } else if (currentLevel.value === 'dong') {
      // 동 단계에서 구(Neighborhood) 단계로 돌아가기
      // 주의: parentId를 통해 역추적해야 함. 현재 API 구조상 parentId가 정확하지 않을 수 있음.
      // 일단 city stats로 가는 것이 안전할 수 있으나, 최대한 parentId 활용
      if (currentRegion.value && currentRegion.value.parentId) {
         // parentId가 불확실하므로 일단 상위로 이동 시도, 실패 시 city로
         // 여기서는 dong의 부모가 neighborhood(구)라고 가정하지만, 
         // 실제로는 dong의 부모는 neighborhood가 아니라 district(구)일 수도 있고 구조에 따라 다름.
         // statsApi에서 parentId를 잘 넣어줘야 함.
         // 현재 statsApi에서 dong의 parentId는 'unknown'임.
         // 따라서 여기서는 일단 city로 가거나, 이전 히스토리를 관리해야 완벽함.
         // 임시로 fetchCityStats() 호출
         fetchCityStats()
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
    selectDong,
    selectApartment,
    goBack
  }
})
