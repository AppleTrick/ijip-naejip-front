import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as statsApi from '@/api/statsApi'
import type { RegionStats } from '@/api/statsApi'

export type ViewLevel = 'city' | 'district' | 'neighborhood' | 'apartment'

export const useMarketStatsStore = defineStore('marketStats', () => {
  const currentLevel = ref<ViewLevel>('city')
  const isSidebarOpen = ref(false)
  
  // Current Region Data (Self)
  const currentRegion = ref<RegionStats | null>(null)
  
  // List of Sub-regions (Children)
  const statsList = ref<RegionStats[]>([])
  
  const selectedApartmentId = ref<string | null>(null)
  const isLoading = ref(false)

  // Actions
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

  const selectDistrict = async (district: RegionStats) => {
    isLoading.value = true
    try {
      const data = await statsApi.getDistrictStats(district.id)
      currentRegion.value = data.self
      statsList.value = data.children
      currentLevel.value = 'district'
      selectedApartmentId.value = null
      selectedApartmentId.value = null
      openSidebar()
    } finally {
      isLoading.value = false
    }
  }

  const selectNeighborhood = async (neighborhood: RegionStats) => {
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
      // Go back to neighborhood view
      // Ideally we should have the parent neighborhood ID stored or passed
      // For now, we'll just reload the current neighborhood if we have it, or default to city
      if (currentRegion.value) {
        // If we are at apartment level, currentRegion is actually the Neighborhood
        // So we just switch level back
        currentLevel.value = 'neighborhood'
        selectedApartmentId.value = null
      } else {
        fetchCityStats()
      }
    } else if (currentLevel.value === 'neighborhood') {
      // Go back to District
      // We need to know which district we were in. 
      // Simplified: Go to City for now, or we need to store history/parent
      fetchCityStats()
    } else if (currentLevel.value === 'district') {
      fetchCityStats()
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
