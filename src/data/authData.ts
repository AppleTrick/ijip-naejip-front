import { mockUser } from './userData'
import type { User } from '@/api/types'

export interface AuthResponse {
  accessToken: string
  user: User
}

export const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  user: mockUser
}
