import type { Property, MarketFilters, AddressResponse } from '@/api/types'
import { searchAreaAddress } from '@/api/regionApi'

// 지도 표시를 위해 AddressResponse를 Property로 변환
const convertToProperty = (item: AddressResponse): Property => {
  return {
    aptSeq: item.aptSeq || item.dongCode, // 지역의 경우 동코드를 대체 ID로 사용
    aptNm: item.aptName || item.dongName || item.gugunName || item.sidoName,
    dealAmount: item.avgPrice ? item.avgPrice.toLocaleString() + '만원' : '0만원',
    latitude: item.latitude,
    longitude: item.longitude,
    roadNm: item.dongName || '',
    excluUseAr: item.primaryPyung ? item.primaryPyung + '평' : '-',
    floor: '-',
    description: `${item.sidoName} ${item.gugunName} ${item.dongName}`,
    buildYear: 0,
    deals: []
  }
}

export const getProperties = async (filters?: MarketFilters, bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }): Promise<Property[]> => {
  if (!bounds) {
    return []
  }

  let scope: 'APT_DONG' | 'APT' | 'DONG' | 'GUGUN' | 'SIDO' = 'APT'

  if (bounds.level <= 2) {
    scope = 'APT_DONG' // 상세 뷰 (아파트 + 동)
  } else if (bounds.level <= 4) {
    scope = 'APT' // 아파트 단지 뷰
  } else if (bounds.level <= 5) {
    scope = 'DONG' // 동 뷰
  } else if (bounds.level <= 7) {
    scope = 'GUGUN' // 구군 뷰
  } else {
    scope = 'SIDO' // 시도 뷰
  }

  const areas = await searchAreaAddress({
    minLat: bounds.minLat,
    maxLat: bounds.maxLat,
    minLng: bounds.minLng,
    maxLng: bounds.maxLng,
    scope,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    // 필터가 지원되면 minPyung, maxPyung 추가 가능
  })

  return areas.map(convertToProperty)
}

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  // TODO: HouseDealController API를 사용하여 getPropertyDetail 구현
  console.log('getPropertyDetail called with id:', id)
  return undefined
}
