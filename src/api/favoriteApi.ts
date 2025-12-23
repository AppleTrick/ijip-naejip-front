import http from './http'

export interface FavoriteApartment {
  id: number
  aptSeq: string
  aptName: string
  address: string
  pyung: number
  dealAmount: string
  createdAt: string
}

export interface FavoriteAddRequest {
  aptSeq: string
  aptName: string
  address: string
  pyung: number
  dealAmount: string
}

/**
 * 관심 아파트 목록 조회
 */
export const getFavorites = async (): Promise<FavoriteApartment[]> => {
  try {
    const response = await http.get('/api/v1/favorites')
    return response.data.data || []
  } catch (error) {
    console.error('관심 아파트 목록 조회 실패:', error)
    return []
  }
}

/**
 * 관심 아파트 추가
 */
export const addFavorite = async (data: FavoriteAddRequest): Promise<FavoriteApartment | null> => {
  try {
    const response = await http.post('/api/v1/favorites', data)
    return response.data.data
  } catch (error: any) {
    const message = error.response?.data?.message || '관심 아파트 추가 실패'
    console.error(message)
    throw new Error(message)
  }
}

/**
 * 관심 아파트 삭제 (ID)
 */
export const removeFavorite = async (id: number): Promise<void> => {
  try {
    await http.delete(`/api/v1/favorites/${id}`)
  } catch (error) {
    console.error('관심 아파트 삭제 실패:', error)
    throw error
  }
}

/**
 * 관심 아파트 삭제 (aptSeq)
 */
export const removeFavoriteByAptSeq = async (aptSeq: string): Promise<void> => {
  try {
    await http.delete(`/api/v1/favorites/apt/${aptSeq}`)
  } catch (error) {
    console.error('관심 아파트 삭제 실패:', error)
    throw error
  }
}


/**
 * 관심 등록 여부 확인
 */
export const checkFavorite = async (aptSeq: string, pyung: number): Promise<boolean> => {
  try {
    const response = await http.get('/api/v1/favorites/check', {
      params: { aptSeq, pyung }
    })
    return response.data.data || false
  } catch (error) {
    console.error('관심 확인 실패:', error)
    return false
  }
}
