import { mockAuthResponse } from '../data/authData'
import type { AuthResponse } from './types'

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Mock login validation
  if (password === 'error') {
    throw new Error('Invalid credentials')
  }
  return mockAuthResponse
}

export const signup = async (_name: string, _email: string, _password: string): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockAuthResponse
}

export const logout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return
}
