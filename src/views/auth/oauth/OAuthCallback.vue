<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

onMounted(() => {
  // 쿠키에서 토큰 추출
  const token = getCookie('accessToken')
  
  if (token) {
    // 1. 토큰 저장
    localStorage.setItem('accessToken', token)
    
    // 보안을 위해 쿠키 삭제
    deleteCookie('accessToken')
    
    // 2. 사용자 정보 가져오기
    // 임시 데이터 대신 백엔드에서 최신 정보 조회
    authStore.checkAuth().then(() => {
      // 3. 페이지 이동
      const needsAdditionalInfo = route.query.needsAdditionalInfo === 'true'
      
      if (needsAdditionalInfo) {
        router.replace('/signup/social')
      } else {
        router.replace('/')
      }
    })
    return // 비동기 처리 대기

    // 3. 페이지 이동
    const needsAdditionalInfo = route.query.needsAdditionalInfo === 'true'
    
    if (needsAdditionalInfo) {
      router.replace('/signup/social')
    } else {
      router.replace('/')
    }
  } else if (route.query.needsEmail === 'true') {
    // 이메일 입력이 필요한 경우 (카카오 등)
    router.replace({
      path: '/signup/social',
      query: {
        needsEmail: 'true',
        socialId: route.query.socialId,
        socialType: route.query.socialType
      }
    })
  } else {
    alert('로그인에 실패했습니다.')
    router.replace('/login')
  }
})
</script>

<template>
  <div class="callback-container">
    <div class="loader">로그인 처리 중...</div>
  </div>
</template>

<style scoped>
.callback-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
}

.loader {
  font-size: 1.2rem;
  color: #666;
}
</style>
