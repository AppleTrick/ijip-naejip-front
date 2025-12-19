import { ref } from 'vue'
import * as marketApi from '@/api/marketApi'
import type { MarketFilters } from '@/api/types'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'

// [서비스 로직/중계자] UI(화면)와 API(서버 통신) 사이를 연결하는 역할
// 로딩 상태(isLoading)와 에러(error)를 관리하며, API 결과를 Store에 저장합니다.

export function useMarket() {
  const store = useMainDataStore()
  const statsStore = useMarketStatsStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let lastRequestId = 0

  /**
   * [지도 매물 목록 로딩]
   * 지도가 움직일 때마다 호출되어 화면에 보일 아파트/지역 마커 데이터를 가져옵니다.
   * 빠르게 여러 번 호출될 때 마지막 요청만 처리하여 데이터 꼬임을 방지합니다.
   */
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

  /**
   * [단일 매물 상세 정보 로딩]
   * 사용자가 특정 마커를 클릭했을 때 호출됩니다.
   * 아파트의 상세 정보(거래 내역, 평형 리스트 등)를 가져와서 Store의 selectedProperty에 저장합니다.
   * 상세 정보에 좌표가 없는 경우, 기존 마커의 좌표를 유지해줍니다.
   */
  const fetchPropertyDetail = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const pyung = statsStore.selectedPyung || 'all'
      console.log('[DEBUG] fetchPropertyDetail - id:', id, 'pyung:', pyung, 'statsStore.selectedPyung:', statsStore.selectedPyung)
      const data = await marketApi.getPropertyDetail(id, pyung)
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
