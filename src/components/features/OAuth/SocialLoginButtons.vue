<script setup lang="ts">
defineProps<{
  showDivider?: boolean
}>()

const handleKakaoLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
}

const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google'
}
</script>

<template>
  <div class="social-login-container">
    <div v-if="showDivider" class="divider">
      <span>소셜 계정으로 간편 로그인</span>
    </div>

    <div class="buttons-wrapper">
      <!-- Kakao -->
      <button class="social-btn kakao" @click="handleKakaoLogin" aria-label="카카오 로그인">
        <span class="icon">💬</span>
      </button>

      <!-- Google -->
      <button class="social-btn google" @click="handleGoogleLogin" aria-label="구글 로그인">
        <span class="icon">G</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.social-login-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--color-gray-400);
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-gray-200);
}

.divider span {
  padding: 0 1rem;
  white-space: nowrap;
}

.buttons-wrapper {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-btn {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 1.5rem;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kakao {
  background-color: #FEE500;
  color: #000000;
}

.google {
  background-color: #FFFFFF;
  color: #000000;
  border: 1px solid #E5E7EB;
}

.google .icon {
  font-weight: 700;
}
</style>
