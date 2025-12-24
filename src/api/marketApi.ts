import type { Property, MarketFilters, AddressResponse } from '@/api/types'
import { searchAreaAddress } from '@/api/regionApi'
import http from '@/api/http'
import type { CommonResponse } from '@/api/http'
import type { ApartmentDetailResponse } from '@/api/types'
import { formatPrice } from '@/utils/formatters'

/**
 * [데이터 변환 헬퍼]
 * 백엔드에서 받은 주소/단지 정보(AddressResponse)를 지도 마커와 UI에서 사용하는
 * 통합 형식(Property)으로 변환해주는 도구입니다.
 */
const convertToProperty = (item: AddressResponse, type: 'APT' | 'APT_DONG' | 'DONG' | 'GUGUN' | 'SIDO'): Property => {
  // APT_DONG의 경우: "아파트명 (동)" 형식으로 표시
  const displayName = type === 'APT_DONG' && item.aptDong
    ? `${item.aptName} (${item.aptDong}동)`
    : (item.aptName || item.dongName || item.gugunName || item.sidoName)

  return {
    aptSeq: item.aptSeq ? String(item.aptSeq) : item.dongCode, // 지역의 경우 동코드를 대체 ID로 사용
    aptNm: displayName,
    aptDong: item.aptDong && item.aptDong !== '-' ? item.aptDong : '',
    dealAmount: item.avgPrice ? item.avgPrice.toLocaleString() + '만원' : '0만원',
    latitude: item.latitude,
    longitude: item.longitude,
    roadNm: item.dongName || '',
    excluUseAr: item.primaryPyung && item.primaryPyung > 0 ? String(item.primaryPyung) : '',
    primaryPyung: item.primaryPyung || undefined,
    // 아파트/아파트동인 경우 평단가를 표시하지 않음 (백엔드에서 데이터가 오더라도 무시)
    pricePerPyung: (type !== 'APT' && type !== 'APT_DONG') ? (item.pricePerPyung || undefined) : undefined,
    floor: '-',
    description: `${item.sidoName} ${item.gugunName} ${item.dongName}`,
    buildYear: 0,
    deals: [],
    type: type
  }
}

/**
 * [매물 목록 조회 (지도 영역 기준)]
 * 현재 지도가 보고 있는 영역(bounds) 내의 아파트/지역 목록을 가져옵니다.
 * 줌 레벨에 따라 scope(단지, 동, 구, 시)를 결정하여 적절한 데이터를 요청합니다.
 */
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

  const isAptScope = scope === 'APT' || scope === 'APT_DONG'

  const areas = await searchAreaAddress({
    minLat: bounds.minLat,
    maxLat: bounds.maxLat,
    minLng: bounds.minLng,
    maxLng: bounds.maxLng,
    scope,
    // 가격: 100억 이상일 경우 상한선 없이 검색 (undefined)
    minPrice: (filters?.priceRange?.min && filters.priceRange.min !== 0) ? filters.priceRange.min * 10000 : undefined,
    maxPrice: (filters?.priceRange?.max && filters.priceRange.max < 100) ? filters.priceRange.max * 10000 : undefined,
    // 평형: APT/APT_DONG 스코프에서만 전송, 100평 이상일 경우 상한선 없이 검색
    minPyung: (isAptScope && filters?.areaRange?.min && filters.areaRange.min !== 0) ? filters.areaRange.min : undefined,
    maxPyung: (isAptScope && filters?.areaRange?.max && filters.areaRange.max < 100) ? filters.areaRange.max : undefined
  })

  const propertyType = (scope === 'APT_DONG' || scope === 'APT') ? 'APT' : scope
  return areas.map(item => convertToProperty(item, propertyType))
}


// [API 담당] 서버와 직접 통신하여 데이터를 가져오는 역할
// 지도에 표시할 데이터나 상세 정보를 가져와서 프론트엔드 형식에 맞게 변환합니다.

/**
 * [상세 정보 조회]
 * 특정 아파트의 구체적인 정보(평형 리스트, 실거래가 내역, 가격 추이 등)를 가져옵니다.
 * 이 정보는 사이드바 상세 뷰에 표시됩니다.
 */
export const getPropertyDetail = async (id: string, pyung: string = 'all'): Promise<Property | undefined> => {
  try {
    const response = await http.get<CommonResponse<ApartmentDetailResponse>>(`/api/v1/apartments/${id}`, {
      params: { pyung }
    })
    const data = response.data.data
    console.log('API Raw Response for ' + id, data)

    if (!data) return undefined

    const property: Property = {
      aptSeq: String(data.apartmentInfo.aptSeq),
      aptNm: data.apartmentInfo.aptName,
      dealAmount: data.apartmentInfo.avgPrice ? formatPrice(data.apartmentInfo.avgPrice) : '0억',
      latitude: Number(data.apartmentInfo.latitude) || 0,
      longitude: Number(data.apartmentInfo.longitude) || 0,
      roadNm: data.apartmentInfo.address,
      excluUseAr: (data.apartmentInfo.pyungTypes || []).join(', ') + '평',
      floor: '-', // 상세 정보에 층수 요약은 없음
      description: `건축년도: ${data.apartmentInfo.buildYear}년, 평형: ${(data.apartmentInfo.pyungTypes || []).join(', ')}`,
      buildYear: data.apartmentInfo.buildYear,
      pyungList: (data.apartmentInfo.pyungTypes || []).map(String),
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
        price: point.avgPrice,
        volume: point.transactionCount
      })) : [],
      type: 'APT'
    }

    return property
  } catch (error) {
    console.error('아파트 상세 정보 조회 실패:', error)
    return undefined
  }
}
