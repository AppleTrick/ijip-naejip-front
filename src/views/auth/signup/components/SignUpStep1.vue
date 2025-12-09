<script setup lang="ts">
import { reactive } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useEmailVerification } from '@/composables/useEmailVerification'

const props = defineProps<{
  data: any
  isSocialSignup?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', data: any): void
  (e: 'next'): void
}>()

const {
  isVerifying,
  isVerified,
  verificationCode,
  sentCode,
  message,
  isError,
  sendCode,
  verifyCode
} = useEmailVerification()

const formData = reactive({
  email: props.data.email || '',
  password: props.data.password || '',
  confirmPassword: '',
  name: props.data.name || '',
  phone: props.data.phone || ''
})

const handleSendVerification = async () => {
  await sendCode(formData.email)
}

const handleVerifyCode = async () => {
  await verifyCode(formData.email)
}

const handleNext = () => {
  if (formData.password !== formData.confirmPassword) {
    message.value = '비밀번호가 일치하지 않습니다.'
    isError.value = true
    return
  }
  
  // 소셜 회원가입이 아닐 때만 이메일 인증 확인
  if (!props.isSocialSignup && !isVerified.value) {
    message.value = '이메일 인증을 완료해주세요.'
    isError.value = true
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
          v-if="!isSocialSignup"
          size="sm" 
          variant="outline"
          class="action-btn"
          :disabled="isVerified || isVerifying"
          @click="handleSendVerification"
        >
          {{ isVerifying ? '전송중...' : (sentCode ? '재전송' : '인증번호 전송') }}
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
          class="action-btn"
          @click="handleVerifyCode"
        >
          확인
        </BaseButton>
      </div>
    </div>

    <!-- 메시지 표시 영역 -->
    <div v-if="message" :class="['message', isError ? 'error' : 'success']">
      {{ message }}
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
      class="next-btn"
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
  gap: 1.25rem; /* Increased slightly for better breathing room between distinct sections, but will tighten groups */
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem; /* Reduced from 1rem */
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem; /* Reduced from 0.5rem */
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

/* Fixed width for action buttons */
.action-btn {
  min-width: 6.5rem;
  white-space: nowrap;
}

.verified-msg {
  color: var(--color-success);
  font-size: 0.875rem;
  font-weight: 600;
}

.message {
  font-size: 0.8125rem; /* Slightly smaller */
  font-weight: 500;
  margin-top: 0.25rem; /* Reduced from 0.5rem */
}

.message.error {
  color: #ef4444;
}

.message.success {
  color: var(--color-success);
}

.next-btn {
  margin-top: 1rem;
  height: 3.5rem; /* Increased height */
  font-size: 1rem;
  font-weight: 600;
}
</style>
