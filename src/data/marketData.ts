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

  const types = ['APT', 'OPST', 'VILLA']
  const properties: Property[] = []

  districts.forEach(district => {
    for (let i = 0; i < 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const price = Math.floor(Math.random() * 150000) + 10000 // 1억 ~ 16억
      const deposit = Math.floor(price * (Math.random() * 0.4 + 0.5)) // 매매가의 50~90%

      properties.push({
        id: `${district.name}-${i}`,
        name: `${district.name} ${type} ${i + 1}호`,
        type: type === 'APT' ? '아파트' : type === 'OPST' ? '오피스텔' : '빌라',
        price: `${Math.floor(price / 10000)}억 ${price % 10000 > 0 ? (price % 10000) + '만원' : ''}`,
        deposit: `${Math.floor(deposit / 10000)}억 ${deposit % 10000 > 0 ? (deposit % 10000) + '만원' : ''}`,
        lat: district.lat + (Math.random() - 0.5) * 0.04,
        lng: district.lng + (Math.random() - 0.5) * 0.04,
        address: `서울시 ${district.name} 역삼동 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 100) + 1}`,
        area: `${Math.floor(Math.random() * 50) + 20}평`,
        floor: `${Math.floor(Math.random() * 20) + 1}층`,
        maintenanceFee: `${Math.floor(Math.random() * 20) + 5}만원`,
        description: '역세권, 채광 좋음, 풀옵션, 주차 가능, 즉시 입주 가능. 신혼부부 추천 매물입니다.',
        safetyScore: Math.floor(Math.random() * 100)
      })
    }
  })
  return properties
}
