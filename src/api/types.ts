export interface User {
  id: string
  name: string
  email: string
  phone?: string
  profileImage?: string | null
  // 개인 정보
  gender?: 'male' | 'female' | 'other'
  ageGroup?: string
  job?: string
  maritalStatus?: 'single' | 'married'
  // 선호도
  budget?: { min: number, max: number }
  interestAreas?: string[]
  commuteLocation?: string
  // 알림
  appPush?: boolean
  emailNotification?: boolean
  marketingNotification?: boolean
  // 내 집 정보
  myHouseName?: string
  myHouseAddress?: string
  myHouseArea?: string
  myHouseFloor?: string
  myHousePrice?: string
  
  socialType?: 'NONE' | 'KAKAO' | 'NAVER' | 'GOOGLE'
}

export interface LoginCredentials {
  email?: string
  password?: string
  socialType?: string
  code?: string
  state?: string
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

export interface SocialSignUpData extends SignUpData {
  socialId: string
  socialType: 'KAKAO' | 'NAVER' | 'GOOGLE'
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface NotificationSettings {
  appPush?: boolean
  emailNotification?: boolean
  marketingNotification?: boolean
}

export interface LoginResponse {
  accessToken: string
  name: string
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
  aptDong?: string
  dealAmount: string
  latitude: number
  longitude: number
  roadNm: string
  excluUseAr: string
  primaryPyung?: number
  floor: string
  description: string
  buildYear?: number
  jibunAddress?: string
  pyungList?: string[]
  deals?: HouseDeal[]
  priceTrend?: PriceTrend[]
  type?: 'APT' | 'APT_DONG' | 'DONG' | 'GUGUN' | 'SIDO'
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

export interface PriceTrend {
  date: string
  price: number // 만원 단위
  volume?: number // 거래량
}

export interface RegionStats {
  id: string
  name: string
  avgPrice: number // 만원 단위 (예: 125000 = 12.5억)
  trend: PriceTrend[]
  volume?: number
  lat?: number
  lng?: number
  parentId?: string
}

export interface AddressResponse {
  dongCode: string
  sidoName: string
  gugunName: string
  dongName: string
  aptSeq: string
  aptName: string
  aptDong: string
  latitude: number
  longitude: number
  avgPrice: number
  primaryPyung: number
}

export interface ApartmentInfoDto {
  aptSeq: number
  aptName: string
  address: string
  avgPrice: number
  buildYear: number
  pyungTypes: string[]
}

export interface RecentTransactionDto {
  transactionDate: string
  pyungType: string
  dealAmount: number
  floor: number
  aptDong: string
}

export interface PriceDataPointDto {
  month: string
  avgPrice: number
  transactionCount: number
}

export interface PriceTrendDto {
  unit: string
  dataPoints: PriceDataPointDto[]
}

export interface ApartmentDetailResponse {
  selectedPyung: string
  apartmentInfo: ApartmentInfoDto
  recentTransactions: RecentTransactionDto[]
  priceTrend: PriceTrendDto
}
