<script setup lang="ts">
const handleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
}
</script>

<template>
  <button class="kakao-btn" @click="handleLogin">
    <span class="icon">💬</span>
    <span class="text">카카오로 시작하기</span>
  </button>
</template>

<style scoped>
.kakao-btn {
  width: 100%;
  height: 3rem;
  background-color: #FEE500;
  color: #000000;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.kakao-btn:hover {
  opacity: 0.9;
}

.icon {
  font-size: 1.2rem;
}
</style>
