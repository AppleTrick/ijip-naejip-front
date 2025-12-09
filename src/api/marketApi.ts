import http from '@/api/http'
import type { Property, MarketFilters } from './types'
import { NEIGHBORHOODS, DISTRICTS, CITIES } from '@/data/marketData'
import type { RegionStats } from '@/data/marketData'

// 지도 영역(bounds) 내의 거래 정보를 가져오는 헬퍼 함수
const fetchDealsByBounds = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }, limit: number = 100): Promise<any[]> => {
  try {

    const response = await http.get<any[]>('/api/house/deals/bounds', {
      params: {
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
        minLng: bounds.minLng,
        maxLng: bounds.maxLng,
        limit
      }
    })

    return response.data
  } catch (error) {
    console.error('Failed to fetch deals by bounds:', error)
    return []
  }
}

// 매 호출마다 재생성하지 않도록 데이터 캐싱
// 참고: 영역 기반 조회 시 캐싱 전략 변경이 필요할 수 있음 (예: 영역별 캐시 또는 이동 시 초기화)
// 현재는 단순히 새로운 영역 데이터로 캐시를 교체함
// 데이터 캐시
let cachedDeals: any[] = []
let latestFetchId = 0

const fetchRawDeals = async (bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number }) => {
  if (bounds) {
    const fetchId = ++latestFetchId
    const data = await fetchDealsByBounds(bounds)

    // 가장 최근 요청인 경우에만 캐시 업데이트
    if (fetchId === latestFetchId) {
      cachedDeals = data
    }
    return data
  }
  return cachedDeals
}

const groupDealsByAptComplex = (deals: any[]): Property[] => {
  const propertiesMap = new Map<string, Property>()

  for (const deal of deals) {
    if (!propertiesMap.has(deal.aptSeq)) {
      propertiesMap.set(deal.aptSeq, {
        aptSeq: deal.aptSeq,
        aptNm: deal.aptNm,
        dealAmount: deal.dealAmount.toLocaleString() + '만원', // 초기 표시 금액 (가장 최근 거래)
        latitude: parseFloat(deal.latitude),
        longitude: parseFloat(deal.longitude),
        roadNm: deal.roadNm,
        excluUseAr: deal.excluUseAr + 'm²',
        floor: deal.floor + '층',
        description: `건축년도: ${deal.buildYear}년`,
        buildYear: deal.buildYear,
        jibunAddress: deal.jibun,
        deals: []
      })
    }

    const property = propertiesMap.get(deal.aptSeq)!
    property.deals?.push({
      no: deal.no,
      aptSeq: deal.aptSeq,
      aptDong: deal.aptDong,
      floor: deal.floor,
      dealDate: deal.dealDate,
      excluUseAr: deal.excluUseAr,
      dealAmount: deal.dealAmount
    })
  }
  return Array.from(propertiesMap.values())
}

const groupDealsByAptDong = (deals: any[]): Property[] => {
  const propertiesMap = new Map<string, Property>()

  for (const deal of deals) {
    // 아파트 일련번호 + 동 기준으로 그룹화
    const key = `${deal.aptSeq}-${deal.aptDong}`

    if (!propertiesMap.has(key)) {
      propertiesMap.set(key, {
        aptSeq: deal.aptSeq, // 참조용으로 원본 aptSeq 유지
        aptNm: `${deal.aptNm} ${deal.aptDong}동`, // 동 이름 추가
        dealAmount: deal.dealAmount.toLocaleString() + '만원',
        // 참고: 단지와 동일한 위도/경도 사용. DB에 동별 좌표가 없으면 마커가 겹칠 수 있음.
        // 실제 앱에서는 약간의 랜덤 오프셋을 적용하거나 구체적인 동 좌표를 사용해야 함.
        latitude: parseFloat(deal.latitude),
        longitude: parseFloat(deal.longitude),
        roadNm: deal.roadNm,
        excluUseAr: deal.excluUseAr + 'm²',
        floor: deal.floor + '층',
        description: `건축년도: ${deal.buildYear}년 / ${deal.aptDong}동`,
        buildYear: deal.buildYear,
        jibunAddress: deal.jibun,
        deals: []
      })
    }

    const property = propertiesMap.get(key)!
    property.deals?.push({
      no: deal.no,
      aptSeq: deal.aptSeq,
      aptDong: deal.aptDong,
      floor: deal.floor,
      dealDate: deal.dealDate,
      excluUseAr: deal.excluUseAr,
      dealAmount: deal.dealAmount
    })
  }
  return Array.from(propertiesMap.values())
}

// 지도 표시를 위해 RegionStats를 Property 형식으로 변환
const convertToProperty = (item: RegionStats): Property => {
  return {
    aptSeq: item.id,
    aptNm: item.name,
    dealAmount: String(item.avgPrice), // 문자열 숫자로 전달, MapMarkerOverlay에서 포맷팅 처리
    latitude: item.lat || 0,
    longitude: item.lng || 0,
    roadNm: item.name,
    excluUseAr: '-',
    floor: '-',
    description: item.name,
    buildYear: 0
  }
}

// 집계 데이터를 위한 모의 API 호출
const fetchDongAggregates = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {

  // 영역 내의 동(Neighborhood) 필터링
  const filtered = NEIGHBORHOODS.filter(n =>
    n.lat && n.lng &&
    n.lat >= bounds.minLat && n.lat <= bounds.maxLat &&
    n.lng >= bounds.minLng && n.lng <= bounds.maxLng
  )
  return filtered.map(convertToProperty)
}

const fetchGuAggregates = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {
  // 영역 내의 구(District) 필터링
  const filtered = DISTRICTS.filter(d =>
    d.lat && d.lng &&
    d.lat >= bounds.minLat && d.lat <= bounds.maxLat &&
    d.lng >= bounds.minLng && d.lng <= bounds.maxLng
  )
  return filtered.map(convertToProperty)
}

const fetchCityAggregates = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {
  // 영역 내의 시(City) 필터링
  const filtered = CITIES.filter(c =>
    c.lat && c.lng &&
    c.lat >= bounds.minLat && c.lat <= bounds.maxLat &&
    c.lng >= bounds.minLng && c.lng <= bounds.maxLng
  )
  return filtered.map(convertToProperty)
}

export const getProperties = async (filters?: MarketFilters, bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }): Promise<Property[]> => {
  let properties: Property[] = []

  if (bounds) {
    if (bounds.level <= 2) {
      // 레벨 1-2: 아파트 동 단위 (상세)

      const rawDeals = await fetchRawDeals(bounds)
      properties = groupDealsByAptDong(rawDeals)
    } else if (bounds.level <= 4) {
      // 레벨 3-4: 아파트 단지 단위 (평균)

      const rawDeals = await fetchRawDeals(bounds)
      properties = groupDealsByAptComplex(rawDeals)
    } else if (bounds.level <= 5) {
      // 레벨 5: 동 단위 집계
      properties = await fetchDongAggregates(bounds)
    } else if (bounds.level <= 7) {
      // 레벨 6-7: 구 단위 집계
      properties = await fetchGuAggregates(bounds)
    } else {
      // 레벨 8+: 시/도 단위 집계
      properties = await fetchCityAggregates(bounds)
    }
  } else {
    // 영역 정보가 없는 경우 대체 처리 (캐시된 단지 뷰 반환)
    const rawDeals = await fetchRawDeals()
    properties = groupDealsByAptComplex(rawDeals)
  }

  if (filters) {
    // 필요한 경우 클라이언트 측 필터 적용
    // 참고: 집계 데이터의 경우 필터링 방식이 다르거나 비활성화되어야 할 수 있음
  }

  return properties
}

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 300))
  const rawDeals = await fetchRawDeals()
  const properties = groupDealsByAptComplex(rawDeals)
  return properties.find(p => p.aptSeq === id)
}
