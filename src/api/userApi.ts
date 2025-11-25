import { mockUser } from '../data/userData'
import type { User } from './types'

export const getUserProfile = async (): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockUser
}

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return { ...mockUser, ...data }
}

export const getUserHomes = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    {
      id: 1,
      address: '서울시 강남구 역삼동 123-45',
      nickname: '우리집'
    }
  ]
}
