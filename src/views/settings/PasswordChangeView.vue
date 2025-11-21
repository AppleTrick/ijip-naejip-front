<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ArrowLeft, Lock } from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSave = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }
  // TODO: Implement password change logic
  alert('비밀번호가 변경되었습니다.')
  router.back()
}
</script>

<template>
  <div class="password-change-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="router.back()">
          <ArrowLeft class="icon" />
        </button>
        <h1 class="page-title">비밀번호 변경</h1>
        <div class="placeholder"></div>
      </div>

      <div class="content-card">
        <div class="icon-header">
          <div class="icon-wrapper">
            <Lock class="lock-icon" />
          </div>
          <p class="header-desc">
            안전한 계정 보호를 위해<br>
            비밀번호를 주기적으로 변경해주세요.
          </p>
        </div>

        <form class="password-form" @submit.prevent="handleSave">
          <BaseInput 
            id="currentPassword" 
            v-model="form.currentPassword" 
            label="현재 비밀번호" 
            type="password" 
            placeholder="현재 비밀번호를 입력하세요" 
          />

          <BaseInput 
            id="newPassword" 
            v-model="form.newPassword" 
            label="새 비밀번호" 
            type="password" 
            placeholder="새 비밀번호를 입력하세요" 
          />

          <BaseInput 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            label="새 비밀번호 확인" 
            type="password" 
            placeholder="새 비밀번호를 다시 입력하세요" 
          />

          <div class="actions">
            <BaseButton type="submit" full-width size="lg">
              변경하기
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.password-change-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 2rem 1rem;
}

.container {
  max-width: 32rem;
  margin: 0 auto;
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
  padding: 2rem;
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

.lock-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
}

.header-desc {
  color: var(--color-text-light);
  line-height: 1.5;
  font-size: 0.875rem;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.actions {
  margin-top: 1rem;
}
</style>
