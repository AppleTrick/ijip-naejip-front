import type { Property, MarketFilters, AddressResponse } from '@/api/types'
import { searchAreaAddress } from '@/api/regionApi'

// 지도 표시를 위해 AddressResponse를 Property로 변환
const convertToProperty = (item: AddressResponse, type: 'APT' | 'DONG' | 'GUGUN' | 'SIDO'): Property => {
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
    deals: [],
    type: type
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

  const propertyType = (scope === 'APT_DONG' || scope === 'APT') ? 'APT' : scope
  return areas.map(item => convertToProperty(item, propertyType))
}

import http from '@/api/http'
import type { CommonResponse } from '@/api/http'
import type { ApartmentDetailResponse } from '@/api/types'

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  try {
    const response = await http.get<CommonResponse<ApartmentDetailResponse>>(`/api/v1/apartments/${id}`)
    const data = response.data.data
    
    if (!data) return undefined

    // ApartmentDetailResponse를 Property 형식으로 변환
    const property: Property = {
      aptSeq: String(data.apartmentInfo.aptSeq),
      aptNm: data.apartmentInfo.aptName,
      dealAmount: data.apartmentInfo.avgPrice ? (data.apartmentInfo.avgPrice / 10000).toFixed(1) + '억' : '0억', // 예: 245000 -> 24.5억
      latitude: 0, // 상세 정보에는 좌표가 없으므로 0 또는 기존 값 유지 필요 (여기서는 0으로 설정)
      longitude: 0,
      roadNm: data.apartmentInfo.address,
      excluUseAr: data.apartmentInfo.pyungTypes.join(', ') + '평',
      floor: '-', // 상세 정보에 층수 요약은 없음
      description: `건축년도: ${data.apartmentInfo.buildYear}년, 평형: ${data.apartmentInfo.pyungTypes.join(', ')}`,
      buildYear: data.apartmentInfo.buildYear,
      deals: data.recentTransactions.map((deal, index) => ({
        no: index,
        aptSeq: String(data.apartmentInfo.aptSeq),
        aptDong: deal.aptDong,
        floor: String(deal.floor),
        dealDate: Number(deal.transactionDate.replace(/-/g, '')), // YYYY-MM-DD -> YYYYMMDD
        excluUseAr: Number(deal.pyungType),
        dealAmount: deal.dealAmount
      })),
      priceTrend: data.priceTrend ? data.priceTrend.dataPoints.map(point => ({
        date: point.month,
        price: point.avgPrice
      })) : [],
      type: 'APT'
    }
    
    return property
  } catch (error) {
    console.error('아파트 상세 정보 조회 실패:', error)
    return undefined
  }
}
