<script setup lang="ts">
import { ref, reactive } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'


const props = defineProps<{
  data: any
}>()

const emit = defineEmits<{
  (e: 'update', data: any): void
  (e: 'next'): void
}>()


const isVerifying = ref(false)
const isVerified = ref(false)
const verificationCode = ref('')
const sentCode = ref(false)

const formData = reactive({
  email: props.data.email || '',
  password: props.data.password || '',
  confirmPassword: '',
  name: props.data.name || '',
  phone: props.data.phone || ''
})

const handleSendVerification = async () => {
  if (!formData.email) return
  isVerifying.value = true
  // Mock sending email
  await new Promise(resolve => setTimeout(resolve, 1000))
  sentCode.value = true
  isVerifying.value = false
  alert(`인증번호가 ${formData.email}로 전송되었습니다. (테스트용: 아무 번호나 입력하세요)`)
}

const handleVerifyCode = () => {
  if (verificationCode.value.length > 0) {
    isVerified.value = true
  }
}

const handleNext = () => {
  if (formData.password !== formData.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  if (!isVerified.value) {
    alert('이메일 인증을 완료해주세요.')
    return
  }
  
  emit('update', {
    email: formData.email,
    password: formData.password,
    name: formData.name,
    phone: formData.phone
  })
  emit('next')
}
</script>

<template>
  <div class="step-container">
    <h3 class="step-title">기본 정보 입력</h3>
    
    <div class="form-group">
      <label class="label">이메일</label>
      <div class="input-row">
        <BaseInput 
          v-model="formData.email" 
          placeholder="example@email.com"
          :disabled="isVerified"
        />
        <BaseButton 
          size="sm" 
          variant="outline"
          :disabled="isVerified || isVerifying"
          @click="handleSendVerification"
        >
          {{ sentCode ? '재전송' : '인증번호 전송' }}
        </BaseButton>
      </div>
    </div>

    <div v-if="sentCode && !isVerified" class="form-group">
      <div class="input-row">
        <BaseInput 
          v-model="verificationCode" 
          placeholder="인증번호 입력"
        />
        <BaseButton 
          size="sm" 
          variant="primary"
          @click="handleVerifyCode"
        >
          확인
        </BaseButton>
      </div>
    </div>

    <div v-if="isVerified" class="verified-msg">
      ✓ 이메일 인증이 완료되었습니다.
    </div>

    <div class="form-group">
      <label class="label">비밀번호</label>
      <BaseInput 
        v-model="formData.password" 
        type="password" 
        placeholder="영문, 숫자, 특수문자 포함 8자 이상"
      />
    </div>

    <div class="form-group">
      <label class="label">비밀번호 확인</label>
      <BaseInput 
        v-model="formData.confirmPassword" 
        type="password" 
        placeholder="비밀번호 재입력"
      />
    </div>

    <div class="form-group">
      <label class="label">이름</label>
      <BaseInput 
        v-model="formData.name" 
        placeholder="실명 입력"
      />
    </div>

    <div class="form-group">
      <label class="label">휴대폰 번호</label>
      <BaseInput 
        v-model="formData.phone" 
        placeholder="010-0000-0000"
      />
    </div>

    <BaseButton 
      full-width 
      variant="primary" 
      class="mt-6"
      :disabled="!isVerified || !formData.password || !formData.name"
      @click="handleNext"
    >
      다음 단계로
    </BaseButton>
  </div>
</template>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.input-row :first-child {
  flex: 1;
}

.verified-msg {
  color: var(--color-success);
  font-size: 0.875rem;
  font-weight: 600;
}

.mt-6 {
  margin-top: 1.5rem;
}
</style>
