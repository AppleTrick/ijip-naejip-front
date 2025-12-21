
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Property } from '@/api/types'

export interface House {
  aptNm: string
  roadNm: string
  dealAmount: string
  excluUseAr: string
  floor: string
  buildYear?: number
}

// [데이터 저장소/Store] 앱 전역에서 사용하는 부동산 관련 데이터를 저장하고 관리합니다. (Pinia)
// 여러 컴포넌트(지도, 사이드바, 필터)가 이 데이터를 공유해서 봅니다.

export const useMainDataStore = defineStore('mainData', () => {
  // 1. [State] 데이터 그 자체
  const marketProperties = ref<Property[]>([]) // 지도에 뿌려질 매물/지역 마커 리스트
  const selectedProperty = ref<Property | null>(null) // 현재 사용자가 클릭해서 보고 있는 상세 아파트 정보
  const currentAddress = ref<string>('')
  const searchQuery = ref<string>('')

  const myHouse = ref<House | null>(null)
  const comparisonList = ref<Property[]>([])

  const filters = ref({
    priceRange: { min: 0, max: 100 },
    areaRange: { min: 0, max: 100 }
  })

  // 2. [Getters] 데이터를 가공해서 보여주는 함수들 (Computed)
  // 예: 검색어나 필터 조건에 맞는 매물만 걸러서 보여주기
  const filteredProperties = computed(() => {
    // 이제 서버에서 이미 필터링된 데이터를 가져오므로, 
    // 프론트엔드에서는 검색어 필터링만 수행하거나 필요 시 추가 처리만 합니다.
    let result = marketProperties.value

    // Search Query (서버에서 지원하지 않는 경우 프론트에서 수행)
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.aptNm.toLowerCase().includes(query) || 
        (p.roadNm && p.roadNm.toLowerCase().includes(query))
      )
    }

    return result
  })

  const isInComparison = computed(() => {
    return (propertyId: string) => comparisonList.value.some(p => p.aptSeq === propertyId)
  })

  const getPropertyById = computed(() => {
    return (id: string) => marketProperties.value.find(p => p.aptSeq === id)
  })

  // 3. [Actions] 데이터를 변경(수정/저장)하는 함수들
  function setMarketProperties(properties: Property[]) {
    marketProperties.value = properties
  }

  // 사용자가 마커를 클릭했을 때 "이게 선택된 아파트야"라고 저장하는 함수
  function selectProperty(property: Property | null) {
    selectedProperty.value = property
  }

  function setAddress(address: string) {
    currentAddress.value = address
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setFilters(newFilters: any) {
    filters.value = newFilters
  }

  function setMyHouse(house: House | null) {
    myHouse.value = house
  }

  function addToComparison(property: Property) {
    if (!isInComparison.value(property.aptSeq)) {
      comparisonList.value.push(property)
    }
  }

  function removeFromComparison(propertyId: string) {
    comparisonList.value = comparisonList.value.filter(p => p.aptSeq !== propertyId)
  }

  return {
    marketProperties,
    selectedProperty,
    currentAddress,
    searchQuery,
    filters,
    filteredProperties,
    myHouse,
    comparisonList,
    getPropertyById,
    setMarketProperties,
    selectProperty,
    setAddress,
    setSearchQuery,
    setFilters,
    setMyHouse,
    addToComparison,
    removeFromComparison,
    isInComparison
  }
})
