import type { User, LoginCredentials, SignUpData } from './types'
import http from '@/api/http'

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await http.post('/user/login', credentials)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data || '로그인 실패')
  }
}

export const verifyEmail = async (email: string): Promise<boolean> => {
  // 이 함수는 더 이상 사용되지 않을 수 있음 (Step1에서 직접 sendVerificationCode 호출)
  return true
}

export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    await http.post('/user/email-verification/request', { email })
  } catch (error: any) {
    throw new Error(error.response?.data || '인증 코드 전송 실패')
  }
}

export const checkVerificationCode = async (email: string, code: string): Promise<boolean> => {
  try {
    await http.post('/user/email-verification/confirm', { email, code })
    return true
  } catch (error: any) {
    throw new Error(error.response?.data || '인증 코드 확인 실패')
  }
}

export const signup = async (data: SignUpData): Promise<User> => {
  // SignUpData를 백엔드 User DTO 형식에 맞게 변환
  const userDto = {
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
    // personalInfo 객체 평탄화
    gender: data.personalInfo.gender,
    ageGroup: data.personalInfo.ageGroup,
    job: data.personalInfo.job,
    maritalStatus: data.personalInfo.maritalStatus,

    // 백엔드 미지원으로 인한 주석 처리
    // budget: data.preferences.budget,
    // interestAreas: data.preferences.interestAreas,
    // commuteLocation: data.preferences.commuteLocation,
  }

  try {
    const response = await http.post('/user/signup', userDto)
    console.log('Signup response:', response.data)
    
    // 타입 요구사항을 만족시키기 위해 더미 사용자 객체 반환
    // 실제 로그인은 별도로 진행됨
    return { ...userDto, id: '0' } as unknown as User
  } catch (error: any) {
    throw new Error(error.response?.data || '회원가입 실패')
  }
}

export const updateProfile = async (user: Partial<User>): Promise<User> => {
  // 구현 예정
  return user as User
}

export const updateNotifications = async (settings: any): Promise<void> => {
  // 구현 예정
  console.log('Update notifications:', settings)
}
