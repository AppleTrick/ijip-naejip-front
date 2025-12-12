import { ref } from 'vue'
import * as marketApi from '@/api/marketApi'
import type { MarketFilters } from '@/api/types'
import { useSafeHomeStore } from '@/stores/safehome'

export function useMarket() {
  const store = useSafeHomeStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let lastRequestId = 0

  const fetchProperties = async (filters?: MarketFilters, bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }) => {
    const requestId = ++lastRequestId
    isLoading.value = true
    error.value = null
    try {
      const data = await marketApi.getProperties(filters, bounds)
      if (requestId === lastRequestId) {
        store.setMarketProperties(data)
      }
    } catch (e: any) {
      if (requestId === lastRequestId) {
        error.value = e.message || '매물 목록을 불러오는데 실패했습니다.'
      }
    } finally {
      if (requestId === lastRequestId) {
        isLoading.value = false
      }
    }
  }

  const fetchPropertyDetail = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await marketApi.getPropertyDetail(id)
      if (data) {
        // 기존 선택된 매물이 있고 ID가 같다면 좌표 유지 (상세 API에는 좌표가 없을 수 있음)
        if (store.selectedProperty && store.selectedProperty.aptSeq === id) {
          if (data.latitude === 0) data.latitude = store.selectedProperty.latitude
          if (data.longitude === 0) data.longitude = store.selectedProperty.longitude
        }
        store.selectProperty(data)
      }
    } catch (e: any) {
      error.value = e.message || '매물 상세 정보를 불러오는데 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    fetchProperties,
    fetchPropertyDetail
  }
}
