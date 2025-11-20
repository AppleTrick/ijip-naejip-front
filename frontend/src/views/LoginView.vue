<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Login attempt:', email.value, password.value)
  // TODO: Implement actual login logic
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          서비스 이용을 위해 로그인해주세요
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
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

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              로그인 유지
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-lime-600 hover:text-lime-500">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        <div class="space-y-3">
          <BaseButton
            type="submit"
            variant="primary"
            :full-width="true"
            size="lg"
          >
            로그인
          </BaseButton>
          
          <BaseButton
            type="button"
            variant="outline"
            :full-width="true"
            size="lg"
          >
            회원가입
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
