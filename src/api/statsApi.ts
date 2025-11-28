import { getAllCities, getCityData, getDistrictData, getNeighborhoodData } from '@/data/marketData'
import type { RegionStats, PriceTrend } from '@/data/marketData'

export type { RegionStats, PriceTrend }

// Return all cities at top level
export const getCityStats = async (): Promise<{ self: RegionStats; children: RegionStats[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  // Return a virtual "전국" (nationwide) parent with all cities as children
  return {
    self: {
      id: 'country-korea',
      name: '대한민국',
      avgPrice: 85000, // National average
      trend: [],
      lat: 36.5,
      lng: 127.5
    },
    children: getAllCities()
  }
}

export const getDistrictStats = async (districtId: string): Promise<{ self: RegionStats; children: RegionStats[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  // Check if this is a city ID (for city -> district navigation)
  if (districtId.startsWith('city-')) {
    return getCityData(districtId)
  }
  // Otherwise it's a district ID
  return getDistrictData(districtId)
}

export const getNeighborhoodStats = async (neighborhoodId: string): Promise<{ self: RegionStats, children: RegionStats[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return getNeighborhoodData(neighborhoodId)
}
