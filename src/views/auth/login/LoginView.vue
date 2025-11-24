<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2 class="login-title">
          로그인
        </h2>
        <p class="login-subtitle">
          서비스 이용을 위해 로그인해주세요
        </p>
      </div>
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .login-page {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .login-page {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.login-container {
  max-width: 28rem; /* max-w-md */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(232, 69, 69, 0.2); /* primary-transparent20 */
}

.login-header {
  text-align: center;
}

.login-title {
  margin-top: 1.5rem;
  font-size: 1.875rem; /* 3xl */
  line-height: 2.25rem;
  font-weight: 800;
  color: var(--color-primary);
}

.login-subtitle {
  margin-top: 0.5rem;
  font-size: 0.875rem; /* sm */
  color: var(--color-text-light);
}
</style>
