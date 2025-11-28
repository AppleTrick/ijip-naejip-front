export interface User {
  id: string
  name: string
  email: string
  phone?: string
  profileImage?: string | null
  // Personal Info
  gender?: 'male' | 'female' | 'other'
  ageGroup?: string
  job?: string
  maritalStatus?: 'single' | 'married'
  // Preferences
  budget?: { min: number, max: number }
  interestAreas?: string[]
  commuteLocation?: string
  // Notifications
  notifications?: {
    appPush: boolean
    email: boolean
    marketing: boolean
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
  phone: string
  personalInfo: {
    gender: string
    ageGroup: string
    job: string
    maritalStatus: string
  }
  preferences: {
    budget: { min: number, max: number }
    interestAreas: string[]
    commuteLocation: string
  }
}

export interface DongCode {
  dongCode: string
  sidoName: string
  gugunName: string
  dongName: string
}

export interface HouseInfo {
  aptSeq: string
  sggCd: string
  umdCd: string
  jibun: string
  roadNm: string
  roadNmBonbun: string
  roadNmBubun: string
  aptNm: string
  buildYear: number
  latitude: string
  longitude: string
  geoStatus: string
}

export interface HouseDeal {
  no: number
  aptSeq: string
  aptDong: string
  floor: string
  dealDate: number
  excluUseAr: number
  dealAmount: number
}

export interface Property {
  aptSeq: string
  aptNm: string
  dealAmount: string
  latitude: number
  longitude: number
  roadNm: string
  excluUseAr: string
  floor: string
  description: string
  buildYear?: number
  jibunAddress?: string
  deals?: HouseDeal[]
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
