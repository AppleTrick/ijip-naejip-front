<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ArrowLeft, Mail } from 'lucide-vue-next'

const router = useRouter()
const email = ref('')
const isSent = ref(false)

const handleSend = () => {
  if (!email.value) {
    alert('이메일을 입력해주세요.')
    return
  }
  // TODO: Implement password reset email sending logic
  isSent.value = true
}
</script>

<template>
  <div class="find-password-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="router.back()">
          <ArrowLeft class="icon" />
        </button>
        <h1 class="page-title">비밀번호 찾기</h1>
        <div class="placeholder"></div>
      </div>

      <div class="content-card">
        <div class="icon-header">
          <div class="icon-wrapper">
            <Mail class="mail-icon" />
          </div>
          <p class="header-desc">
            가입하신 이메일 주소를 입력해주시면<br>
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        <div v-if="!isSent" class="form-section">
          <form @submit.prevent="handleSend" class="send-form">
            <BaseInput 
              id="email" 
              v-model="email" 
              label="이메일" 
              type="email" 
              placeholder="example@ssafy.com" 
            />

            <div class="actions">
              <BaseButton type="submit" full-width size="lg">
                이메일 전송
              </BaseButton>
            </div>
          </form>
        </div>

        <div v-else class="success-section">
          <div class="success-message">
            <h3>메일 전송 완료!</h3>
            <p>
              <strong>{{ email }}</strong>으로<br>
              비밀번호 재설정 링크가 전송되었습니다.<br>
              메일함을 확인해주세요.
            </p>
          </div>
          <BaseButton full-width size="lg" @click="router.push('/login')">
            로그인으로 돌아가기
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.find-password-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 32rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: var(--color-gray-100);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text);
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.placeholder {
  width: 2.5rem;
}

.content-card {
  background-color: var(--color-white);
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.icon-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
}

.icon-wrapper {
  width: 4rem;
  height: 4rem;
  background-color: rgba(144, 55, 73, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.mail-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
}

.header-desc {
  color: var(--color-text-light);
  line-height: 1.5;
  font-size: 0.875rem;
}

.send-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.actions {
  margin-top: 1rem;
}

.success-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.success-message h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.success-message p {
  color: var(--color-text-light);
  line-height: 1.6;
}

.success-message strong {
  color: var(--color-primary);
}
</style>
