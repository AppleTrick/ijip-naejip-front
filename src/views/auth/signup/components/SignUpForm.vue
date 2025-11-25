<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signup, isLoading, error } = useAuth()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

const handleSignUp = async () => {
  if (password.value !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  await signup(name.value, email.value, password.value)
}
</script>

<template>
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
</template>

<style scoped>
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
