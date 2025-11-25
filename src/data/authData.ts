import { mockUser, type User } from './userData'

export interface AuthResponse {
  accessToken: string
  user: User
}

export const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  user: mockUser
}
