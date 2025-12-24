
import { useRouter } from 'vue-router'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import type { Property } from '@/api/types'

export const useMapNavigation = () => {
  const router = useRouter()
  const store = useMainDataStore()
  const statsStore = useMarketStatsStore()

  /**
   * 특정 아파트/매물의 지도 위치로 이동합니다.
   * @param property 이동할 대상 아파트 객체
   * @param zoomLevel 지도의 줌 레벨 (기본값 3)
   */
  const moveToMap = (property: Property, zoomLevel: number = 3) => {
    console.log(`${property.latitude}, ${property.longitude} 좌표로 이동!`)
    // 1. 스토어에 선택된 아파트 정보 저장
    store.selectProperty(property)
    
    // 2. 통계 스토어 상태 업데이트 (사이드바 오픈 및 상세 정보 조회를 위함)
    const pyung = property.primaryPyung ? String(property.primaryPyung) : 'all'
    statsStore.selectApartment(property.aptSeq, pyung)

    // 3. 지도 이동 시 사용할 메타데이터 저장 (MarketView에서 감지)
    // selectedProperty watch 가 동작하도록 처리됨
    
    // 4. 지도 페이지로 이동
    router.push({
      path: '/map',
      query: {
        lat: property.latitude,
        lng: property.longitude,
        level: zoomLevel,
        aptSeq: property.aptSeq
      }
    })
  }

  /**
   * 특정 좌표 정보로 지도를 이동시킵니다.
   * @param lat 위도
   * @param lng 경도
   * @param zoomLevel 지도의 줌 레벨 (기본값 3)
   * @param aptSeq 선택된 아파트 시퀀스 (옵션)
   */
  const moveToLocation = (lat: number, lng: number, zoomLevel: number = 3, aptSeq?: string) => {
    console.log(`${lat}, ${lng} 좌표로 이동 (레벨: ${zoomLevel}, aptSeq: ${aptSeq})`)
    
    // 1. 선택된 특정 아파트는 해제 (장소 검색 시에는 특정 매물이 선택된 상태가 아니므로)
    store.selectProperty(null)

    // 2. 지도 페이지로 이동 및 쿼리 파라미터 전달
    const query: any = { lat, lng, level: zoomLevel }
    if (aptSeq) query.aptSeq = aptSeq

    router.push({
      path: '/map',
      query
    })
  }

  return {
    moveToMap,
    moveToLocation
  }
}
