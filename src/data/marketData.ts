import type { Property } from '@/api/types'

export const generateMarketData = (): Property[] => {
  const districts = [
    { name: '강남구', lat: 37.5172, lng: 127.0473 },
    { name: '서초구', lat: 37.4837, lng: 127.0324 },
    { name: '송파구', lat: 37.5145, lng: 127.1066 },
    { name: '마포구', lat: 37.5665, lng: 126.9018 },
    { name: '용산구', lat: 37.5326, lng: 126.9900 },
    { name: '성동구', lat: 37.5633, lng: 127.0371 },
    { name: '영등포구', lat: 37.5264, lng: 126.8962 },
    { name: '종로구', lat: 37.5730, lng: 126.9794 }
  ]

  const properties: Property[] = []

  districts.forEach(district => {
    for (let i = 0; i < 20; i++) {
      const price = Math.floor(Math.random() * 150000) + 10000 // 1억 ~ 16억

      properties.push({
        aptSeq: `${district.name}-${i}`,
        aptNm: `${district.name} 아파트 ${i + 1}호`, // Simplified name
        dealAmount: `${Math.floor(price / 10000)}억 ${price % 10000 > 0 ? (price % 10000) + '만원' : ''}`,
        latitude: district.lat + (Math.random() - 0.5) * 0.04,
        longitude: district.lng + (Math.random() - 0.5) * 0.04,
        roadNm: `서울시 ${district.name} 테헤란로 ${Math.floor(Math.random() * 100) + 1}길 ${Math.floor(Math.random() * 50) + 1}`,
        excluUseAr: `${Math.floor(Math.random() * 50) + 20}평`,
        floor: `${Math.floor(Math.random() * 20) + 1}층`,
        description: '역세권, 채광 좋음, 풀옵션, 주차 가능, 즉시 입주 가능. 신혼부부 추천 매물입니다.',
        buildYear: Math.floor(Math.random() * 30) + 1995, // 1995 ~ 2024
        jibunAddress: `서울시 ${district.name} 역삼동 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 100) + 1}`,
        deals: [
          {
            no: i * 100 + 1,
            aptSeq: `${district.name}-${i}`,
            aptDong: `${Math.floor(Math.random() * 10) + 101}동`,
            floor: `${Math.floor(Math.random() * 20) + 1}`,
            dealDate: 20231015,
            excluUseAr: 84.99,
            dealAmount: price
          },
          {
            no: i * 100 + 2,
            aptSeq: `${district.name}-${i}`,
            aptDong: `${Math.floor(Math.random() * 10) + 101}동`,
            floor: `${Math.floor(Math.random() * 20) + 1}`,
            dealDate: 20230920,
            excluUseAr: 84.99,
            dealAmount: price - 5000
          }
        ]
      })
    }
  })
  return properties
}
