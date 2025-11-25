export interface User {
  id: number
  name: string
  email: string
  phone?: string
  profileImage?: string
}

export interface Property {
  id: string
  name: string
  type: string
  price: string
  deposit: string
  lat: number
  lng: number
  address: string
  area: string
  floor: string
  maintenanceFee: string
  description: string
  safetyScore: number
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface MarketFilters {
  minLat?: number
  maxLat?: number
  minLng?: number
  maxLng?: number
  type?: string
  minPrice?: number
  maxPrice?: number
}
