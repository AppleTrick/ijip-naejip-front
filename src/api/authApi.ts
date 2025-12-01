import type { User, LoginCredentials, SignUpData } from './types'

// Mock User Data
const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  name: '김싸피',
  phone: '010-1234-5678',
  profileImage: null,
  // Personal Info
  gender: 'male',
  ageGroup: '20s',
  job: 'student',
  maritalStatus: 'single',
  // Preferences
  budget: { min: 0, max: 10 }, // 억 단위
  interestAreas: ['investment', 'residence'],
  commuteLocation: 'Gangnam',
  // Notifications
  notifications: {
    appPush: true,
    email: true,
    marketing: false
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const login = async (credentials: LoginCredentials): Promise<User> => {
  await delay(1000)
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    return MOCK_USER
  }
  throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
}

export const verifyEmail = async (email: string): Promise<boolean> => {
  await delay(1500)
  // Mock verification logic: always success for test emails
  return email.includes('@')
}

export const signup = async (data: SignUpData): Promise<User> => {
  await delay(2000)
  // Return a new user object based on input
  return {
    ...MOCK_USER,
    email: data.email,
    name: data.name,
    ...data.personalInfo,
    gender: data.personalInfo.gender as 'male' | 'female' | 'other',
    maritalStatus: data.personalInfo.maritalStatus as 'single' | 'married',
    ...data.preferences
  }
}

export const updateProfile = async (user: Partial<User>): Promise<User> => {
  await delay(1000)
  return { ...MOCK_USER, ...user }
}

export const updateNotifications = async (settings: any): Promise<void> => {
  await delay(500)

}
