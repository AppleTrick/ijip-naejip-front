<script setup lang="ts">
const handleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google'
}
</script>

<template>
  <button class="google-btn" @click="handleLogin">
    <span class="icon">G</span>
    <span class="text">구글로 시작하기</span>
  </button>
</template>

<style scoped>
.google-btn {
  width: 100%;
  height: 3rem;
  background-color: #FFFFFF;
  color: #000000;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.google-btn:hover {
  background-color: #F9FAFB;
}

.icon {
  font-weight: 700;
  font-size: 1.1rem;
}
</style>
