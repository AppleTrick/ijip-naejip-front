import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, SignUpData } from '@/api/types'
import * as authApi from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.login(credentials)
      
      // 1. 토큰 저장
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken)
      }

      // 2. 사용자 정보 조회 (전체 정보 가져오기)
      // login response에는 name만 있으므로, 전체 정보를 위해 getUserInfo 호출
      const userData = await authApi.getUserInfo()
      user.value = userData
      
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function signup(data: SignUpData) {
    isLoading.value = true
    error.value = null
    try {
      const userData = await authApi.signup(data)
      user.value = userData
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('accessToken')
  }

  async function verifyEmail(email: string) {
    return await authApi.verifyEmail(email)
  }

  async function updateUser(updates: Partial<User>) {
    isLoading.value = true
    try {
      const updatedUser = await authApi.updateProfile(updates)
      user.value = updatedUser
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const isAuthInitialized = ref(false)

  async function checkAuth() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      isAuthInitialized.value = true
      return
    }

    isLoading.value = true
    try {
      const userData = await authApi.getUserInfo()
      user.value = userData
    } catch (e) {
      console.error('Failed to restore session:', e)
      logout() // 토큰이 유효하지 않으면 로그아웃
    } finally {
      isLoading.value = false
      isAuthInitialized.value = true
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    verifyEmail,
    updateUser,
    checkAuth,
    isAuthInitialized
  }
})
