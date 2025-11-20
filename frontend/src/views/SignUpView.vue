<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const handleSignUp = () => {
  console.log('Sign up attempt:', { name: name.value, email: email.value })
  // TODO: Implement actual sign up logic
  alert('회원가입이 완료되었습니다. (Mock)')
  router.push('/login')
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          SafeHome과 함께 안전한 집을 찾아보세요
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignUp">
        <div class="space-y-4">
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

        <div class="space-y-3">
          <BaseButton
            type="submit"
            variant="primary"
            :full-width="true"
            size="lg"
          >
            가입하기
          </BaseButton>
          
          <div class="text-center text-sm text-gray-600">
            이미 계정이 있으신가요? 
            <a href="#" @click.prevent="router.push('/login')" class="font-medium text-lime-600 hover:text-lime-500">
              로그인하기
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
