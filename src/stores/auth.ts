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
      const userData = await authApi.login(credentials)
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

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    verifyEmail,
    updateUser
  }
})
