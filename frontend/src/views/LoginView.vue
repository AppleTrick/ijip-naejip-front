<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const email = ref<string>('')
const password = ref<string>('')

const handleLogin = () => {
  console.log('Login attempt:', email.value, password.value)
  // TODO: Implement actual login logic
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center bg-[#F5F5F5] px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border-2 border-[#E84545]/20">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-[#E84545]">
          로그인
        </h2>
        <p class="mt-2 text-center text-sm text-[#6B7280]">
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
              class="h-4 w-4 text-[#E84545] focus:ring-[#E84545] border-[#9CA3AF] rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-[#2B2E4A] font-medium">
              로그인 유지
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-[#E84545] hover:text-[#D63939]">
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
