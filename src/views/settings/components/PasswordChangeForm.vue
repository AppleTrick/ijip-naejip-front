<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
</template>

<style scoped>
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.actions {
  margin-top: 1rem;
}
</style>
