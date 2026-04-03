import http from '@/api/http'
import type { CommonResponse } from '@/api/http'
import type { DongCode, AddressResponse } from '@/api/types'

// 동코드 API
export const getSidoList = async (): Promise<DongCode[]> => {
  try {
    const response = await http.get<CommonResponse<DongCode[]>>('/dongcode/sido')
    return response.data.data
  } catch (error) {
    console.error('시도 목록 조회 실패:', error)
    return []
  }
}

export const getGugunList = async (sidoName: string): Promise<DongCode[]> => {
  try {
    const response = await http.get<CommonResponse<DongCode[]>>('/dongcode/gugun', {
      params: { sido: sidoName }
    })
    return response.data.data
  } catch (error) {
    console.error('구군 목록 조회 실패:', error)
    return []
  }
}

export const getDongList = async (sidoName: string, gugunName: string): Promise<DongCode[]> => {
  try {
    const response = await http.get<CommonResponse<DongCode[]>>('/dongcode/dong', {
      params: { sido: sidoName, gugun: gugunName }
    })
    return response.data.data
  } catch (error) {
    console.error('동 목록 조회 실패:', error)
    return []
  }
}

export const getDongDetail = async (code: string): Promise<DongCode | null> => {
  try {
    const response = await http.get<CommonResponse<DongCode>>(`/dongcode/${code}`)
    return response.data.data
  } catch (error) {
    console.error('동 상세 정보 조회 실패:', error)
    return null
  }
}

// 지역 API
export interface AreaSearchParams {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
  scope?: 'APT_DONG' | 'APT' | 'DONG' | 'GUGUN' | 'SIDO'
  minPrice?: number
  maxPrice?: number
  minPyung?: number
  maxPyung?: number
}

export const searchAreaAddress = async (params: AreaSearchParams): Promise<AddressResponse[]> => {
  try {
    const response = await http.get<CommonResponse<AddressResponse[]>>('/area', {
      params
    })
    return response.data.data
  } catch (error) {
    console.error('지역 주소 검색 실패:', error)
    return []
  }
}
