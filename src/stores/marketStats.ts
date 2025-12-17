import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as statsApi from '@/api/statsApi'
import type { RegionStats } from '@/api/statsApi'

export type ViewLevel = 'city' | 'district' | 'neighborhood' | 'dong' | 'apartment'

// [지역 분석 데이터 저장소]
// 아파트 개별 매물이 아닌, "지역 단위(시/구/동)"의 통계 데이터를 관리합니다.
// 예: 서울시 전체 평균 가격, 강남구 가격 추이 등
export const useMarketStatsStore = defineStore('marketStats', () => {
  // [State] 현재 보고 있는 지역의 레벨 (시 -> 구 -> 동 -> 아파트)
  const currentLevel = ref<ViewLevel>('city')
  const isSidebarOpen = ref(false)

  // 현재 선택된 지역의 상세 통계 (이름, 평균가, 거래량 등)
  const currentRegion = ref<RegionStats | null>(null)

  // 해당 지역의 하위 지역 목록 (예: 서울시 선택 시 -> 강남구, 서초구 ... 리스트)
  const statsList = ref<RegionStats[]>([])

  const selectedApartmentId = ref<string | null>(null)
  const isLoading = ref(false)

  // [Actions] 지역 이동 및 데이터 로딩 함수들

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  /**
   * [시 단위 통계 조회]
   * 최상위 레벨(예: 서울시)의 통계 데이터를 가져옵니다.
   * 처음 페이지에 들어왔을 때나 '뒤로가기'를 끝까지 했을 때 호출됩니다.
   */
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

  /**
   * [구 단위로 진입]
   * 사용자가 특정 구(예: 강남구, 송파구)를 선택했을 때 호출됩니다.
   * 해당 구의 상세 통계와 하위 동 목록을 로딩합니다.
   */
  const selectDistrict = async (district: { id: string, name?: string, avgPrice?: number }) => {
    isLoading.value = true
    try {
      const data = await statsApi.getDistrictStats(district.id)
      console.log('[[DEBUG]] selectDistrict API Response:', data)
      
      // 마커에서 전달받은 정보로 덮어쓰기
      if (district.name) data.self.name = district.name
      if (district.avgPrice) data.self.avgPrice = district.avgPrice

      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'district'
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * [동 단위로 진입] (현재 API 구조상 Neighborhood = 구 상세/동 목록)
   * 구 내부의 특정 동을 선택하기 직전 단계나 상세 동 뷰를 처리합니다.
   */
  const selectNeighborhood = async (neighborhood: { id: string, name?: string, avgPrice?: number }) => {
    isLoading.value = true
    try {
      const data = await statsApi.getNeighborhoodStats(neighborhood.id)
      console.log('[[DEBUG]] selectNeighborhood API Response:', data)

      // 마커에서 전달받은 정보로 덮어쓰기
      if (neighborhood.name) data.self.name = neighborhood.name
      if (neighborhood.avgPrice) data.self.avgPrice = neighborhood.avgPrice

      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'neighborhood'
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * [최하위 동 단위 진입]
   * 특정 동(예: 삼성동)을 선택했을 때 호출됩니다.
   * 이 단계에서는 더 이상 하위 지역 목록이 없고, 대신 아파트 단지들이 지도에 보입니다.
   */
  const selectDong = async (dong: { id: string, name?: string, avgPrice?: number }) => {
    isLoading.value = true
    try {
      const data = await statsApi.getDongStats(dong.id)

      // 마커에서 전달받은 정보로 덮어쓰기
      if (dong.name) data.self.name = dong.name
      if (dong.avgPrice) data.self.avgPrice = dong.avgPrice

      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'dong'
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  // 아파트 단지를 선택했을 때 (실제 데이터 로딩은 safehome.ts에서 함)
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
      if (currentRegion.value && currentRegion.value.parentId) {
         fetchCityStats()
      } else {
        fetchCityStats()
      }
    } else if (currentLevel.value === 'neighborhood') {
      if (currentRegion.value && currentRegion.value.parentId) {
        selectDistrict({ id: currentRegion.value.parentId })
      } else {
        fetchCityStats()
      }
    } else if (currentLevel.value === 'district') {
      if (currentRegion.value && currentRegion.value.parentId) {
        selectDistrict({ id: currentRegion.value.parentId })
      } else {
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
