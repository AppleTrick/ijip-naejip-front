import { generateMarketData } from '../data/marketData'
import type { Property, MarketFilters } from './types'

// Cache the data so we don't regenerate it on every call
let cachedProperties: Property[] = []

const getPropertiesData = () => {
  if (cachedProperties.length === 0) {
    cachedProperties = generateMarketData()
  }
  return cachedProperties
}

export const getProperties = async (filters?: MarketFilters): Promise<Property[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let properties = getPropertiesData()

  if (filters) {
    if (filters.minLat && filters.maxLat && filters.minLng && filters.maxLng) {
      properties = properties.filter(p => 
        p.lat >= filters.minLat! && p.lat <= filters.maxLat! &&
        p.lng >= filters.minLng! && p.lng <= filters.maxLng!
      )
    }
    // Add other filter logic here if needed
  }

  return properties
}

export const getPropertyDetail = async (id: string): Promise<Property | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const properties = getPropertiesData()
  return properties.find(p => p.id === id)
}
