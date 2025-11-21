<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

const handleSignUp = () => {
  console.log('Sign up attempt:', { name: name.value, email: email.value })
  // TODO: Implement actual sign up logic
  alert('회원가입이 완료되었습니다. (Mock)')
  router.push('/login')
}
</script>

<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-header">
        <h2 class="signup-title">
          회원가입
        </h2>
        <p class="signup-subtitle">
          SafeHome과 함께 안전한 집을 찾아보세요
        </p>
      </div>
      <form class="signup-form" @submit.prevent="handleSignUp">
        <div class="input-group">
          <BaseInput
            id="name"
            v-model="name"
            label="이름"
            type="text"
            placeholder="이름을 입력하세요"
          />
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
          <BaseInput
            id="password-confirm"
            v-model="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <div class="button-group">
          <BaseButton
            type="submit"
            variant="primary"
            :full-width="true"
            size="lg"
          >
            가입하기
          </BaseButton>
          
          <div class="login-link-container">
            이미 계정이 있으신가요? 
            <a href="#" @click.prevent="router.push('/login')" class="login-link">
              로그인하기
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .signup-page {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .signup-page {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.signup-container {
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

.signup-header {
  text-align: center;
}

.signup-title {
  margin-top: 1.5rem;
  font-size: 1.875rem; /* 3xl */
  line-height: 2.25rem;
  font-weight: 800;
  color: var(--color-primary);
}

.signup-subtitle {
  margin-top: 0.5rem;
  font-size: 0.875rem; /* sm */
  color: var(--color-text-light);
}

.signup-form {
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

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-link-container {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.login-link {
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
}

.login-link:hover {
  color: var(--color-primary-hover);
}
</style>
