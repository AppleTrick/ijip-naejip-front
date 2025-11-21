<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ArrowLeft, Camera } from 'lucide-vue-next'

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
  <div class="profile-edit-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="router.back()">
          <ArrowLeft class="icon" />
        </button>
        <h1 class="page-title">개인정보 수정</h1>
        <div class="placeholder"></div>
      </div>

      <!-- Profile Image -->
      <div class="profile-image-section">
        <div class="image-wrapper">
          <div class="avatar-placeholder">
            {{ user.name[0] }}
          </div>
          <button class="camera-btn">
            <Camera class="camera-icon" />
          </button>
        </div>
      </div>

      <!-- Form -->
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
    </div>
  </div>
</template>

<style scoped>
.profile-edit-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 2rem 1rem;
}

.container {
  max-width: 32rem;
  margin: 0 auto;
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

.profile-image-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.image-wrapper {
  position: relative;
}

.avatar-placeholder {
  width: 6rem;
  height: 6rem;
  background-color: rgba(144, 55, 73, 0.2);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--color-primary);
  border: 2px solid var(--color-white);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
}

.camera-icon {
  width: 1rem;
  height: 1rem;
}

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
