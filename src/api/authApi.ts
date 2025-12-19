import type { User, LoginCredentials, SignUpData, LoginResponse, ChangePasswordRequest, NotificationSettings } from './types'
import http from '@/api/http'

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await http.post('/user/login', credentials)
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '로그인 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    await http.post('/user/email-verification/request', { email })
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '인증 코드 전송 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const checkVerificationCode = async (email: string, code: string): Promise<boolean> => {
  try {
    await http.post('/user/email-verification/confirm', { email, code })
    return true
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '인증 코드 확인 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const signup = async (data: SignUpData): Promise<User> => {
  // SignUpData를 백엔드 User DTO 형식에 맞게 변환
  const userDto = {
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
    gender: data.personalInfo.gender,
    ageGroup: data.personalInfo.ageGroup,
    job: data.personalInfo.job,
    maritalStatus: data.personalInfo.maritalStatus,
  }

  try {
    const response = await http.post('/user/signup', userDto)
    console.log('Signup response:', response.data)
    
    return { ...userDto, id: '0' } as unknown as User
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '회원가입 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const updateProfile = async (user: Partial<User>): Promise<User> => {
  try {
    const response = await http.put('/user/update', user)
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '회원 정보 수정 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const getUserInfo = async (): Promise<User> => {
  try {
    const response = await http.get<User>('/user/info')
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '사용자 정보 조회 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  try {
    await http.post('/user/change-password', data)
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '비밀번호 변경 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await http.post('/user/reset-password', { email })
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '비밀번호 초기화 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const updateNotifications = async (settings: NotificationSettings): Promise<void> => {
  try {
    await http.put('/user/notifications', settings)
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data || '알림 설정 업데이트 실패';
    throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
  }
}