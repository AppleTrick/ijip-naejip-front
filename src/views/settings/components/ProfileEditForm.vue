<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const user = ref({
  name: '김싸피',
  email: 'ssafy@example.com',
  phone: '010-1234-5678'
})

const handleSave = () => {
  // TODO: Implement save logic
  alert('프로필이 저장되었습니다.')
  router.back()
}
</script>

<template>
  <form class="edit-form" @submit.prevent="handleSave">
    <div class="form-group">
      <BaseInput 
        id="name" 
        v-model="user.name" 
        label="이름" 
        placeholder="이름을 입력하세요" 
      />
      <BaseInput 
        id="email" 
        v-model="user.email" 
        label="이메일" 
        type="email" 
        placeholder="이메일을 입력하세요" 
      />
      <BaseInput 
        id="phone" 
        v-model="user.phone" 
        label="전화번호" 
        placeholder="전화번호를 입력하세요" 
      />
    </div>

    <div class="actions">
      <BaseButton type="submit" full-width size="lg">
        저장하기
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
