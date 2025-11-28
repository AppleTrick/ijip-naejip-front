// Unified Market Data File
// Hierarchy: 전국 → 시/도 → 구/시 → 동 → 아파트
// All prices are in 만원 (10,000 KRW) units

export interface PriceTrend {
  date: string
  price: number // 만원 units
}

export interface RegionStats {
  id: string
  name: string
  avgPrice: number // 만원 units (e.g., 125000 = 12.5억)
  trend: PriceTrend[]
  volume?: number
  lat?: number
  lng?: number
  parentId?: string
}

// Helper: Generate 6-month price trend
const generateTrend = (basePrice: number): PriceTrend[] => {
  const trend: PriceTrend[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const randomFluctuation = (Math.random() - 0.5) * 0.1 * basePrice
    trend.push({
      date: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
      price: Math.round((basePrice + randomFluctuation) / 100) * 100
    })
  }
  return trend
}

// ============================================
// LEVEL 1: 시/도 (Cities)
// ============================================
export const CITIES: RegionStats[] = [
  {
    id: 'city-seoul',
    name: '서울특별시',
    avgPrice: 125000, // 12.5억
    trend: generateTrend(125000),
    lat: 37.5665,
    lng: 126.9780
  },
  {
    id: 'city-gyeonggi',
    name: '경기도',
    avgPrice: 68000, // 6.8억
    trend: generateTrend(68000),
    lat: 37.4138,
    lng: 127.5183
  },
  {
    id: 'city-incheon',
    name: '인천광역시',
    avgPrice: 52000, // 5.2억
    trend: generateTrend(52000),
    lat: 37.4563,
    lng: 126.7052
  },
  {
    id: 'city-busan',
    name: '부산광역시',
    avgPrice: 48000, // 4.8억
    trend: generateTrend(48000),
    lat: 35.1796,
    lng: 129.0756
  },
  {
    id: 'city-daegu',
    name: '대구광역시',
    avgPrice: 42000, // 4.2억
    trend: generateTrend(42000),
    lat: 35.8714,
    lng: 128.6014
  }
]

// Backward compatibility
export const SEOUL_CITY = CITIES[0]

// ============================================
// LEVEL 2: 구/시 (Districts)
// ============================================
export const DISTRICTS: RegionStats[] = [
  // 서울특별시 (10개 구)
  { id: 'gu-seoul-1', name: '강남구', avgPrice: 332000, trend: generateTrend(332000), lat: 37.5172, lng: 127.0473, parentId: 'city-seoul' },
  { id: 'gu-seoul-2', name: '서초구', avgPrice: 295000, trend: generateTrend(295000), lat: 37.4837, lng: 127.0324, parentId: 'city-seoul' },
  { id: 'gu-seoul-3', name: '송파구', avgPrice: 248000, trend: generateTrend(248000), lat: 37.5145, lng: 127.1066, parentId: 'city-seoul' },
  { id: 'gu-seoul-4', name: '용산구', avgPrice: 271000, trend: generateTrend(271000), lat: 37.5326, lng: 126.9900, parentId: 'city-seoul' },
  { id: 'gu-seoul-5', name: '성동구', avgPrice: 185000, trend: generateTrend(185000), lat: 37.5633, lng: 127.0371, parentId: 'city-seoul' },
  { id: 'gu-seoul-6', name: '마포구', avgPrice: 162000, trend: generateTrend(162000), lat: 37.5663, lng: 126.9016, parentId: 'city-seoul' },
  { id: 'gu-seoul-7', name: '양천구', avgPrice: 158000, trend: generateTrend(158000), lat: 37.5169, lng: 126.8660, parentId: 'city-seoul' },
  { id: 'gu-seoul-8', name: '영등포구', avgPrice: 145000, trend: generateTrend(145000), lat: 37.5264, lng: 126.8962, parentId: 'city-seoul' },
  { id: 'gu-seoul-9', name: '광진구', avgPrice: 142000, trend: generateTrend(142000), lat: 37.5385, lng: 127.0823, parentId: 'city-seoul' },
  { id: 'gu-seoul-10', name: '강동구', avgPrice: 135000, trend: generateTrend(135000), lat: 37.5301, lng: 127.1238, parentId: 'city-seoul' },

  // 경기도 (주요 시)
  { id: 'gu-gyeonggi-1', name: '성남시', avgPrice: 95000, trend: generateTrend(95000), lat: 37.4201, lng: 127.1262, parentId: 'city-gyeonggi' },
  { id: 'gu-gyeonggi-2', name: '수원시', avgPrice: 72000, trend: generateTrend(72000), lat: 37.2636, lng: 127.0286, parentId: 'city-gyeonggi' },
  { id: 'gu-gyeonggi-3', name: '용인시', avgPrice: 68000, trend: generateTrend(68000), lat: 37.2410, lng: 127.1776, parentId: 'city-gyeonggi' },
  { id: 'gu-gyeonggi-4', name: '고양시', avgPrice: 78000, trend: generateTrend(78000), lat: 37.6584, lng: 126.8320, parentId: 'city-gyeonggi' },
  { id: 'gu-gyeonggi-5', name: '화성시', avgPrice: 55000, trend: generateTrend(55000), lat: 37.1990, lng: 126.8312, parentId: 'city-gyeonggi' },

  // 인천광역시
  { id: 'gu-incheon-1', name: '연수구', avgPrice: 68000, trend: generateTrend(68000), lat: 37.4106, lng: 126.6784, parentId: 'city-incheon' },
  { id: 'gu-incheon-2', name: '남동구', avgPrice: 52000, trend: generateTrend(52000), lat: 37.4475, lng: 126.7314, parentId: 'city-incheon' },
  { id: 'gu-incheon-3', name: '부평구', avgPrice: 48000, trend: generateTrend(48000), lat: 37.5070, lng: 126.7218, parentId: 'city-incheon' },

  // 부산광역시
  { id: 'gu-busan-1', name: '해운대구', avgPrice: 72000, trend: generateTrend(72000), lat: 35.1631, lng: 129.1635, parentId: 'city-busan' },
  { id: 'gu-busan-2', name: '수영구', avgPrice: 65000, trend: generateTrend(65000), lat: 35.1454, lng: 129.1134, parentId: 'city-busan' },
  { id: 'gu-busan-3', name: '동래구', avgPrice: 48000, trend: generateTrend(48000), lat: 35.2048, lng: 129.0783, parentId: 'city-busan' },

  // 대구광역시
  { id: 'gu-daegu-1', name: '수성구', avgPrice: 58000, trend: generateTrend(58000), lat: 35.8581, lng: 128.6311, parentId: 'city-daegu' },
  { id: 'gu-daegu-2', name: '달서구', avgPrice: 42000, trend: generateTrend(42000), lat: 35.8297, lng: 128.5326, parentId: 'city-daegu' },
  { id: 'gu-daegu-3', name: '북구', avgPrice: 38000, trend: generateTrend(38000), lat: 35.8858, lng: 128.5829, parentId: 'city-daegu' }
]

// ============================================
// LEVEL 3: 동 (Neighborhoods)
// ============================================
export const NEIGHBORHOODS: RegionStats[] = [
  // 서울 - 강남구 (8개 동)
  { id: 'dong-seoul-1', name: '역삼동', avgPrice: 255000, trend: generateTrend(255000), lat: 37.5006, lng: 127.0364, parentId: 'gu-seoul-1', volume: 45 },
  { id: 'dong-seoul-2', name: '신사동', avgPrice: 282000, trend: generateTrend(282000), lat: 37.5240, lng: 127.0227, parentId: 'gu-seoul-1', volume: 38 },
  { id: 'dong-seoul-3', name: '청담동', avgPrice: 451000, trend: generateTrend(451000), lat: 37.5245, lng: 127.0493, parentId: 'gu-seoul-1', volume: 22 },
  { id: 'dong-seoul-4', name: '삼성동', avgPrice: 358000, trend: generateTrend(358000), lat: 37.5140, lng: 127.0565, parentId: 'gu-seoul-1', volume: 52 },
  { id: 'dong-seoul-5', name: '대치동', avgPrice: 324000, trend: generateTrend(324000), lat: 37.4985, lng: 127.0602, parentId: 'gu-seoul-1', volume: 67 },
  { id: 'dong-seoul-6', name: '논현동', avgPrice: 215000, trend: generateTrend(215000), lat: 37.5111, lng: 127.0286, parentId: 'gu-seoul-1', volume: 41 },
  { id: 'dong-seoul-7', name: '압구정동', avgPrice: 523000, trend: generateTrend(523000), lat: 37.5305, lng: 127.0297, parentId: 'gu-seoul-1', volume: 18 },
  { id: 'dong-seoul-8', name: '개포동', avgPrice: 267000, trend: generateTrend(267000), lat: 37.4789, lng: 127.0633, parentId: 'gu-seoul-1', volume: 35 },
  
  // 서울 - 서초구 (5개 동)
  { id: 'dong-seoul-9', name: '서초동', avgPrice: 245000, trend: generateTrend(245000), lat: 37.4877, lng: 127.0174, parentId: 'gu-seoul-2', volume: 48 },
  { id: 'dong-seoul-10', name: '반포동', avgPrice: 489000, trend: generateTrend(489000), lat: 37.5038, lng: 127.0046, parentId: 'gu-seoul-2', volume: 25 },
  { id: 'dong-seoul-11', name: '방배동', avgPrice: 205000, trend: generateTrend(205000), lat: 37.4816, lng: 126.9924, parentId: 'gu-seoul-2', volume: 56 },
  { id: 'dong-seoul-12', name: '잠원동', avgPrice: 312000, trend: generateTrend(312000), lat: 37.5126, lng: 127.0116, parentId: 'gu-seoul-2', volume: 33 },
  { id: 'dong-seoul-13', name: '양재동', avgPrice: 268000, trend: generateTrend(268000), lat: 37.4844, lng: 127.0344, parentId: 'gu-seoul-2', volume: 42 },
  
  // 서울 - 송파구 (4개 동)
  { id: 'dong-seoul-14', name: '잠실동', avgPrice: 278000, trend: generateTrend(278000), lat: 37.5123, lng: 127.0869, parentId: 'gu-seoul-3', volume: 62 },
  { id: 'dong-seoul-15', name: '신천동', avgPrice: 265000, trend: generateTrend(265000), lat: 37.5186, lng: 127.1026, parentId: 'gu-seoul-3', volume: 44 },
  { id: 'dong-seoul-16', name: '가락동', avgPrice: 156000, trend: generateTrend(156000), lat: 37.4957, lng: 127.1223, parentId: 'gu-seoul-3', volume: 71 },
  { id: 'dong-seoul-17', name: '문정동', avgPrice: 198000, trend: generateTrend(198000), lat: 37.4845, lng: 127.1223, parentId: 'gu-seoul-3', volume: 58 },
  
  // 서울 - 용산구 (3개 동)
  { id: 'dong-seoul-18', name: '한남동', avgPrice: 654000, trend: generateTrend(654000), lat: 37.5345, lng: 127.0064, parentId: 'gu-seoul-4', volume: 12 },
  { id: 'dong-seoul-19', name: '이촌동', avgPrice: 345000, trend: generateTrend(345000), lat: 37.5216, lng: 126.9744, parentId: 'gu-seoul-4', volume: 29 },
  { id: 'dong-seoul-20', name: '용산동', avgPrice: 198000, trend: generateTrend(198000), lat: 37.5311, lng: 126.9810, parentId: 'gu-seoul-4', volume: 38 },
  
  // 서울 - 성동구 (3개 동)
  { id: 'dong-seoul-21', name: '성수동1가', avgPrice: 389000, trend: generateTrend(389000), lat: 37.5446, lng: 127.0445, parentId: 'gu-seoul-5', volume: 38 },
  { id: 'dong-seoul-22', name: '옥수동', avgPrice: 198000, trend: generateTrend(198000), lat: 37.5413, lng: 127.0178, parentId: 'gu-seoul-5', volume: 54 },
  { id: 'dong-seoul-23', name: '행당동', avgPrice: 167000, trend: generateTrend(167000), lat: 37.5605, lng: 127.0296, parentId: 'gu-seoul-5', volume: 47 },

  // 서울 - 마포구 (2개 동)
  { id: 'dong-seoul-24', name: '아현동', avgPrice: 178000, trend: generateTrend(178000), lat: 37.5577, lng: 126.9563, parentId: 'gu-seoul-6', volume: 52 },
  { id: 'dong-seoul-25', name: '연남동', avgPrice: 195000, trend: generateTrend(195000), lat: 37.5632, lng: 126.9255, parentId: 'gu-seoul-6', volume: 61 },

  // 서울 - 양천구 (2개 동)
  { id: 'dong-seoul-26', name: '목동', avgPrice: 172000, trend: generateTrend(172000), lat: 37.5263, lng: 126.8748, parentId: 'gu-seoul-7', volume: 68 },
  { id: 'dong-seoul-27', name: '신정동', avgPrice: 145000, trend: generateTrend(145000), lat: 37.5176, lng: 126.8565, parentId: 'gu-seoul-7', volume: 55 },

  // 서울 - 영등포구 (2개 동)
  { id: 'dong-seoul-28', name: '여의도동', avgPrice: 168000, trend: generateTrend(168000), lat: 37.5219, lng: 126.9245, parentId: 'gu-seoul-8', volume: 49 },
  { id: 'dong-seoul-29', name: '당산동', avgPrice: 132000, trend: generateTrend(132000), lat: 37.5345, lng: 126.9024, parentId: 'gu-seoul-8', volume: 63 },

  // 서울 - 광진구 (1개 동)
  { id: 'dong-seoul-30', name: '자양동', avgPrice: 142000, trend: generateTrend(142000), lat: 37.5346, lng: 127.0712, parentId: 'gu-seoul-9', volume: 58 },

  // 경기 - 성남시 (3개 동)
  { id: 'dong-gyeonggi-1', name: '분당동', avgPrice: 125000, trend: generateTrend(125000), lat: 37.3826, lng: 127.1219, parentId: 'gu-gyeonggi-1', volume: 72 },
  { id: 'dong-gyeonggi-2', name: '판교동', avgPrice: 145000, trend: generateTrend(145000), lat: 37.3952, lng: 127.1106, parentId: 'gu-gyeonggi-1', volume: 58 },
  { id: 'dong-gyeonggi-3', name: '야탑동', avgPrice: 82000, trend: generateTrend(82000), lat: 37.4119, lng: 127.1278, parentId: 'gu-gyeonggi-1', volume: 65 },

  // 경기 - 수원시 (2개 동)
  { id: 'dong-gyeonggi-4', name: '영통동', avgPrice: 78000, trend: generateTrend(78000), lat: 37.2572, lng: 127.0728, parentId: 'gu-gyeonggi-2', volume: 54 },
  { id: 'dong-gyeonggi-5', name: '매탄동', avgPrice: 68000, trend: generateTrend(68000), lat: 37.2645, lng: 127.0446, parentId: 'gu-gyeonggi-2', volume: 61 },

  // 경기 - 용인시 (2개 동)
  { id: 'dong-gyeonggi-6', name: '수지동', avgPrice: 85000, trend: generateTrend(85000), lat: 37.3217, lng: 127.0943, parentId: 'gu-gyeonggi-3', volume: 68 },
  { id: 'dong-gyeonggi-7', name: '기흥동', avgPrice: 62000, trend: generateTrend(62000), lat: 37.2759, lng: 127.1158, parentId: 'gu-gyeonggi-3', volume: 52 },

  // 인천 - 연수구 (2개 동)
  { id: 'dong-incheon-1', name: '송도동', avgPrice: 82000, trend: generateTrend(82000), lat: 37.3895, lng: 126.6396, parentId: 'gu-incheon-1', volume: 78 },
  { id: 'dong-incheon-2', name: '옥련동', avgPrice: 58000, trend: generateTrend(58000), lat: 37.4254, lng: 126.6788, parentId: 'gu-incheon-1', volume: 45 },

  // 부산 - 해운대구 (2개 동)
  { id: 'dong-busan-1', name: '우동', avgPrice: 85000, trend: generateTrend(85000), lat: 35.1621, lng: 129.1603, parentId: 'gu-busan-1', volume: 62 },
  { id: 'dong-busan-2', name: '중동', avgPrice: 68000, trend: generateTrend(68000), lat: 35.1586, lng: 129.1589, parentId: 'gu-busan-1', volume: 54 },

  // 대구 - 수성구 (2개 동)
  { id: 'dong-daegu-1', name: '범어동', avgPrice: 68000, trend: generateTrend(68000), lat: 35.8581, lng: 128.6311, parentId: 'gu-daegu-1', volume: 48 },
  { id: 'dong-daegu-2', name: '수성동', avgPrice: 52000, trend: generateTrend(52000), lat: 35.8258, lng: 128.6307, parentId: 'gu-daegu-1', volume: 41 }
]

// ============================================
// LEVEL 4: 아파트 (Apartments)
// ============================================
const APARTMENT_NAMES = [
  '자이', '래미안', 'e편한세상', '푸르지오', 'SK뷰',
  '힐스테이트', '아이파크', '롯데캐슬', '디에이치', '더샵',
  '센트럴', '파크', '리버', '포레', '트리',
  '스타', '프라임', '그랑', '팰리스', '타워'
]

// Generate apartments for each neighborhood (5 per neighborhood)
export const APARTMENTS: RegionStats[] = NEIGHBORHOODS.flatMap((neighborhood, nIndex) => {
  const basePrice = neighborhood.avgPrice
  return Array.from({ length: 5 }, (_, i) => {
    const priceVariation = (Math.random() - 0.5) * basePrice * 0.3
    const aptPrice = Math.round((basePrice + priceVariation) / 1000) * 1000
    return {
      id: `apt-${nIndex * 5 + i + 1}`,
      name: `${neighborhood.name.replace('동', '')}${APARTMENT_NAMES[Math.floor(Math.random() * APARTMENT_NAMES.length)]}`,
      avgPrice: aptPrice,
      trend: generateTrend(aptPrice),
      lat: neighborhood.lat! + (Math.random() - 0.5) * 0.01,
      lng: neighborhood.lng! + (Math.random() - 0.5) * 0.01,
      parentId: neighborhood.id,
      volume: Math.floor(Math.random() * 20) + 5
    }
  })
})

// ============================================
// Helper Functions
// ============================================
export const getAllCities = (): RegionStats[] => {
  return CITIES
}

export const getCityData = (cityId?: string): { self: RegionStats; children: RegionStats[] } => {
  // If no cityId provided, return Seoul by default (backward compatibility)
  const city = cityId ? CITIES.find(c => c.id === cityId) || CITIES[0] : CITIES[0]
  const children = DISTRICTS.filter(d => d.parentId === city.id)
  return {
    self: city,
    children
  }
}

export const getDistrictData = (districtId: string): { self: RegionStats; children: RegionStats[] } => {
  const district = DISTRICTS.find(d => d.id === districtId)
  
  if (!district) {
    console.warn(`District not found: ${districtId}, returning first district`)
    const fallbackDistrict = DISTRICTS[0]
    return {
      self: fallbackDistrict,
      children: NEIGHBORHOODS.filter(n => n.parentId === fallbackDistrict.id)
    }
  }
  
  const children = NEIGHBORHOODS.filter(n => n.parentId === district.id)
  console.log(`District ${district.name} (${district.id}) has ${children.length} neighborhoods`)
  
  return {
    self: district,
    children
  }
}

export const getNeighborhoodData = (neighborhoodId: string): { self: RegionStats; children: RegionStats[] } => {
  const neighborhood = NEIGHBORHOODS.find(n => n.id === neighborhoodId) || NEIGHBORHOODS[0]
  const children = APARTMENTS.filter(a => a.parentId === neighborhoodId)
  return {
    self: neighborhood,
    children
  }
}
