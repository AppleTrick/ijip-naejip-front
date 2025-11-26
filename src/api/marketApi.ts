import { fetchSongpaMarketData } from '../data/marketData'
import type { Property, MarketFilters } from './types'

// Cache the data so we don't regenerate it on every call
let cachedProperties: Property[] = []

const getPropertiesData = async () => {
  if (cachedProperties.length === 0) {
    cachedProperties = await fetchSongpaMarketData()
  }
  return cachedProperties
}

export const getProperties = async (filters?: MarketFilters): Promise<Property[]> => {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500)) // No need for fake delay with real API
  
  let properties = await getPropertiesData()

  if (filters) {
    if (filters.minLat && filters.maxLat && filters.minLng && filters.maxLng) {
      properties = properties.filter(p => 
        p.latitude >= filters.minLat! && p.latitude <= filters.maxLat! &&
        p.longitude >= filters.minLng! && p.longitude <= filters.maxLng!
      )
    }
    // Add other filter logic here if needed
  }

  return properties
}

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  // await new Promise(resolve => setTimeout(resolve, 300))
  const properties = await getPropertiesData()
  return properties.find(p => p.aptSeq === id)
}
