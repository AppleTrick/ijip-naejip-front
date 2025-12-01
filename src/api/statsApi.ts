import { getAllCities, getCityData, getDistrictData, getNeighborhoodData } from '@/data/marketData'
import type { RegionStats, PriceTrend } from '@/data/marketData'

export type { RegionStats, PriceTrend }

// Return all cities at top level
export const getCityStats = async (): Promise<{ self: RegionStats; children: RegionStats[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  // Return a virtual "전국" (nationwide) parent with all cities as children
  // Return null for self to avoid showing "Korea" header
  return {
    self: null as any, // Cast to any to bypass type check for now, or update type definition
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
