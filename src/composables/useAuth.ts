import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as authApi from '@/api/authApi'
import * as userApi from '@/api/userApi'
import type { User } from '@/api/types'

// Global state
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.login(email, password)
      user.value = response.user
      // In a real app, save token to localStorage here
      router.push('/')
    } catch (e: any) {
      error.value = e.message || '로그인에 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.signup(name, email, password)
      user.value = response.user
      router.push('/')
    } catch (e: any) {
      error.value = e.message || '회원가입에 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authApi.logout()
      user.value = null
      router.push('/login')
    } catch (e: any) {
      console.error('Logout failed', e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserProfile = async () => {
    if (user.value) return
    
    isLoading.value = true
    try {
      const profile = await userApi.getUserProfile()
      user.value = profile
    } catch (e) {
      console.error('Failed to fetch user profile', e)
    } finally {
      isLoading.value = false
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
    fetchUserProfile
  }
}
