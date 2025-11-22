<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')

const handleLogin = () => {
  console.log('Login attempt:', email.value, password.value)
  // TODO: Implement actual login logic
  router.push('/home')
}
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
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <BaseInput
            id="email"
            v-model="email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
          />
          <BaseInput
            id="password"
            v-model="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div class="form-actions">
          <div class="remember-me">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="checkbox"
            >
            <label for="remember-me" class="checkbox-label">
              로그인 유지
            </label>
          </div>

          <div class="forgot-password">
            <a href="#" class="forgot-link">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        <div class="button-group">
          <BaseButton type="submit"
            variant="primary"
            :full-width="true"
            size="lg">
            로그인
          </BaseButton>
        </div>
      </form>
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

.login-form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-me {
  display: flex;
  align-items: center;
}

.checkbox {
  height: 1rem;
  width: 1rem;
  color: var(--color-primary);
  border-radius: 0.25rem;
  border-color: var(--color-gray-400);
}

.checkbox:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--color-primary);
}

.checkbox-label {
  margin-left: 0.5rem;
  display: block;
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 500;
}

.forgot-password {
  font-size: 0.875rem;
}

.forgot-link {
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
}

.forgot-link:hover {
  color: var(--color-primary-hover);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
