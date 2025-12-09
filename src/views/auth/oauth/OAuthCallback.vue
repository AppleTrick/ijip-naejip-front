<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()



onMounted(() => {
  // URL 쿼리 파라미터에서 토큰 추출
  const accessToken = route.query.accessToken as string
  
  if (accessToken) {
    // 1. 토큰 저장
    localStorage.setItem('accessToken', accessToken)
    
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
    }).catch(() => {
        alert('사용자 정보를 불러오는데 실패했습니다.')
        router.replace('/login')
    })
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
