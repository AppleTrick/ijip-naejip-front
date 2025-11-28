<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')

const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  const success = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (success) {
    router.push('/')
  } else {
    alert('로그인 실패: ' + authStore.error)
  }
}
</script>

<template>
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
        <router-link to="/find-password" class="forgot-link">
          비밀번호를 잊으셨나요?
        </router-link>
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
</template>

<style scoped>
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
