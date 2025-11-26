import { ref } from 'vue'
import * as marketApi from '@/api/marketApi'
import type { MarketFilters } from '@/api/types'
import { useSafeHomeStore } from '@/stores/safehome'

export function useMarket() {
  const store = useSafeHomeStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProperties = async (filters?: MarketFilters, bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await marketApi.getProperties(filters, bounds)
      store.setMarketProperties(data)
    } catch (e: any) {
      error.value = e.message || '매물 목록을 불러오는데 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchPropertyDetail = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await marketApi.getPropertyDetail(id)
      if (data) {
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
