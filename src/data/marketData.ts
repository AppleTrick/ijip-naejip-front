import http from '@/api/http'
import type { Property, DongCode } from '@/api/types'

// Helper to fetch dongs for Songpa-gu
const fetchSongpaDongs = async (): Promise<DongCode[]> => {
  try {
    console.log('Fetching dongs for Seoul Songpa-gu...')
    const response = await http.get<DongCode[]>('/api/dongcode/dong', {
      params: {
        sido: '서울특별시',
        gugun: '송파구'
      }
    })
    console.log('Fetched dongs:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to fetch dongs:', error)
    return []
  }
}

// Helper to fetch deals for a specific dong
const fetchDealsByDong = async (dongCode: string, limit: number = 50): Promise<any[]> => {
  try {
    console.log(`Fetching deals for dong ${dongCode}...`)
    const response = await http.get<any[]>(`/api/house/deals/dong/${dongCode}`, {
      params: { limit }, // Use the passed limit
      timeout: 5000 // 5 seconds timeout
    })
    console.log(`Fetched deals for dong ${dongCode}: ${response.data.length} items`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch deals for dong ${dongCode}:`, error)
    return []
  }
}

export const fetchSongpaMarketData = async (): Promise<Property[]> => {
  console.log('Starting fetchSongpaMarketData...')
  const dongs = await fetchSongpaDongs()
  console.log(`Found ${dongs.length} dongs.`)
  
  if (dongs.length === 0) return []

  // Fetch deals for all dongs in parallel
  // Limit to 10 per dong to get roughly 130 items total (13 dongs * 10)
  const dealsPromises = dongs.map(dong => fetchDealsByDong(dong.dongCode, 10))
  console.log('Fetching deals for all dongs...')
  
  let dealsResults: any[][] = []
  try {
    // Use allSettled to handle partial failures
    const results = await Promise.allSettled(dealsPromises)
    
    dealsResults = results
      .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
      .map(result => result.value)
      
    console.log(`Promise.allSettled completed. Success: ${dealsResults.length}, Failed: ${results.length - dealsResults.length}`)
  } catch (error) {
    console.error('Error in fetching deals:', error)
    return []
  }
  
  // Flatten all deals
  const allDeals = dealsResults.flat()
  console.log(`Fetched total ${allDeals.length} deals.`)

  const allProperties: Property[] = []
  const MAX_LIMIT = 100 // Reduced limit as requested
  
  // Group deals by AptSeq to form Properties
  
  // Group deals by AptSeq to form Properties
  const propertiesMap = new Map<string, Property>()
  
  for (const deal of allDeals) {
    if (propertiesMap.size >= MAX_LIMIT) break

    if (!propertiesMap.has(deal.aptSeq)) {
      propertiesMap.set(deal.aptSeq, {
        aptSeq: deal.aptSeq,
        aptNm: deal.aptNm,
        dealAmount: deal.dealAmount.toLocaleString() + '만원', // Format as string
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
  
  allProperties.push(...propertiesMap.values())
  return allProperties.slice(0, MAX_LIMIT)
}

// Deprecated: generateMarketData is removed in favor of fetchSongpaMarketData
export const generateMarketData = (): Property[] => {
  return []
}

