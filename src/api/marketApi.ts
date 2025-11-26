import http from '@/api/http'
import type { Property, MarketFilters } from './types'

// Helper to fetch deals by bounds
const fetchDealsByBounds = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }, limit: number = 100): Promise<any[]> => {
  try {
    console.log('Fetching deals by bounds:', bounds)
    const response = await http.get<any[]>('/api/house/deals/bounds', {
      params: {
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
        minLng: bounds.minLng,
        maxLng: bounds.maxLng,
        limit
      }
    })
    console.log(`Fetched deals by bounds: ${response.data.length} items`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch deals by bounds:', error)
    return []
  }
}

// Cache the data so we don't regenerate it on every call
// Note: With bounds fetching, caching strategy might need to change (e.g., cache by bounds or clear on move)
// For now, we will simply replace the cache with the new bounds data
let cachedProperties: Property[] = []

const getPropertiesData = async (bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number }) => {
  if (bounds) {
    const deals = await fetchDealsByBounds(bounds)
    
    // Convert deals to Properties
    const propertiesMap = new Map<string, Property>()
    
    for (const deal of deals) {
      if (!propertiesMap.has(deal.aptSeq)) {
        propertiesMap.set(deal.aptSeq, {
          aptSeq: deal.aptSeq,
          aptNm: deal.aptNm,
          dealAmount: deal.dealAmount.toLocaleString() + '만원',
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
    
    cachedProperties = Array.from(propertiesMap.values())
  }
  
  // If no bounds provided and no cache, return empty or default (could be improved)
  return cachedProperties
}

export const getProperties = async (filters?: MarketFilters, bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {
  let properties = await getPropertiesData(bounds)

  if (filters) {
    // Client-side filtering if needed (e.g. price range, but bounds are already handled by API)
    // Note: Lat/Lng filtering is redundant if API handles it, but keeping it for safety or other filters
    if (filters.minLat && filters.maxLat && filters.minLng && filters.maxLng) {
       // If filters provide bounds (e.g. from map filter component), we might want to use them if not passed as argument
       // But typically map movement drives the bounds.
    }
  }

  return properties
}

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 300))
  const properties = await getPropertiesData()
  return properties.find(p => p.aptSeq === id)
}
