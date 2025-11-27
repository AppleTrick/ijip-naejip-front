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
// Cache the data
// Cache the data
let cachedDeals: any[] = []
let latestFetchId = 0

const fetchRawDeals = async (bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number }) => {
  if (bounds) {
    const fetchId = ++latestFetchId
    const data = await fetchDealsByBounds(bounds)
    
    // Only update cache if this is the latest request
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
        dealAmount: deal.dealAmount.toLocaleString() + '만원', // Initial display amount (most recent)
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
    // Group by AptSeq + AptDong
    const key = `${deal.aptSeq}-${deal.aptDong}`
    
    if (!propertiesMap.has(key)) {
      propertiesMap.set(key, {
        aptSeq: deal.aptSeq, // Keep original aptSeq for reference
        aptNm: `${deal.aptNm} ${deal.aptDong}동`, // Append Dong name
        dealAmount: deal.dealAmount.toLocaleString() + '만원',
        // Note: Using same lat/lng as complex. Markers might overlap if DB doesn't have dong-specific coords.
        // In a real app, we might apply a small random offset or use specific dong coords.
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

import { dongAggregates, guAggregates, cityAggregates } from '@/data/mockMarketData'

// ... (existing helper functions)

// Mock API calls for aggregates
const fetchDongAggregates = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {
  console.log('Fetching dong aggregates (Mock)')
  // In a real app, we would filter by bounds here
  return dongAggregates
}

const fetchGuAggregates = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {
  return guAggregates
}

const fetchCityAggregates = async (bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }): Promise<Property[]> => {
  return cityAggregates
}

export const getProperties = async (filters?: MarketFilters, bounds?: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }): Promise<Property[]> => {
  let properties: Property[] = []

  if (bounds) {
    if (bounds.level <= 2) {
      // Level 1-2: Apartment Dong Level (Detailed)
      console.log(`Level ${bounds.level}: Grouping by Apt Dong`)
      const rawDeals = await fetchRawDeals(bounds)
      properties = groupDealsByAptDong(rawDeals)
    } else if (bounds.level <= 4) {
      // Level 3-4: Apartment Complex Level (Average)
      console.log(`Level ${bounds.level}: Grouping by Apt Complex`)
      const rawDeals = await fetchRawDeals(bounds)
      properties = groupDealsByAptComplex(rawDeals)
    } else if (bounds.level <= 5) {
      // Level 5: Dong aggregates
      properties = await fetchDongAggregates(bounds)
    } else if (bounds.level <= 7) {
      // Level 6-7: Gu aggregates
      properties = await fetchGuAggregates(bounds)
    } else {
      // Level 8+: City (Do/Si) aggregates
      properties = await fetchCityAggregates(bounds)
    }
  } else {
    // Fallback if no bounds (return cached complex view)
    const rawDeals = await fetchRawDeals()
    properties = groupDealsByAptComplex(rawDeals)
  }

  if (filters) {
    // Apply client-side filters if needed
    // Note: For aggregates, filtering might need to be different or disabled
  }

  return properties
}

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 300))
  const rawDeals = await fetchRawDeals()
  const properties = groupDealsByAptComplex(rawDeals)
  return properties.find(p => p.aptSeq === id)
}
