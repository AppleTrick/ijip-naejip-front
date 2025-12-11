import { getSidoList, getGugunList, getDongList, getDongDetail } from '@/api/regionApi'
import type { RegionStats, PriceTrend } from '@/api/types'

export type { RegionStats, PriceTrend }

// 동코드를 RegionStats로 변환하는 헬퍼 함수
const convertToRegionStats = (
  id: string,
  name: string,
  parentId?: string
): RegionStats => {
  return {
    id,
    name,
    avgPrice: 0, // 동코드 API에서는 데이터 미제공
    trend: [],   // 동코드 API에서는 데이터 미제공
    parentId
  }
}

// 최상위 레벨의 모든 시/도 반환
export const getCityStats = async (): Promise<{ self: RegionStats; children: RegionStats[] }> => {
  // 모든 시/도를 자식으로 갖는 가상의 "전국" 부모 반환
  const sidoList = await getSidoList()
  
  const children = sidoList.map(sido => 
    convertToRegionStats(`city-${sido.sidoName}`, sido.sidoName, 'nation')
  )

  return {
    self: {
      id: 'nation',
      name: '전국',
      avgPrice: 0,
      trend: []
    },
    children
  }
}

export const getDistrictStats = async (districtId: string): Promise<{ self: RegionStats; children: RegionStats[] }> => {
  // districtId는 "city-시도명" 형식으로 예상됨
  const sidoName = districtId.replace('city-', '')
  const gugunList = await getGugunList(sidoName)
  
  const children = gugunList.map(gugun => 
    convertToRegionStats(`gu-${sidoName}-${gugun.gugunName}`, gugun.gugunName, districtId)
  )

  return {
    self: convertToRegionStats(districtId, sidoName, 'nation'),
    children
  }
}

export const getNeighborhoodStats = async (neighborhoodId: string): Promise<{ self: RegionStats, children: RegionStats[] }> => {
  // neighborhoodId는 "gu-시도명-구군명" 형식으로 예상됨
  const rawId = neighborhoodId.replace('gu-', '')
  const [sidoName, gugunName] = rawId.split('-')
  
  if (!sidoName || !gugunName) {
    return {
      self: convertToRegionStats(neighborhoodId, neighborhoodId),
      children: []
    }
  }

  const dongList = await getDongList(sidoName, gugunName)
  
  const children = dongList.map(dong => 
    convertToRegionStats(`dong-${dong.dongCode}`, dong.dongName, neighborhoodId)
  )

  return {
    self: convertToRegionStats(neighborhoodId, gugunName, `city-${sidoName}`),
    children
  }
}

export const getDongStats = async (dongId: string): Promise<{ self: RegionStats, children: RegionStats[] }> => {
  // dongId는 "dong-동코드" 형식으로 예상됨
  const dongCode = dongId.replace('dong-', '')
  
  // 임시: 해당 동의 상세 정보를 가져와서 self로 설정
  const dongDetail = await getDongDetail(dongCode)
  
  return {
    self: convertToRegionStats(dongId, dongDetail?.dongName || '알 수 없음', 'unknown'), // parentId는 역추적 어려움
    children: [] // 아파트 목록은 별도 API로 가져와야 함 (RegionStats 구조 아님)
  }
}
