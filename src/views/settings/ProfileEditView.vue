<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Camera } from 'lucide-vue-next'
import ProfileEditForm from './components/ProfileEditForm.vue'

const router = useRouter()
const userName = '김싸피' // This would typically come from a store or prop
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
            {{ userName[0] }}
          </div>
          <button class="camera-btn">
            <Camera class="camera-icon" />
          </button>
        </div>
      </div>

      <!-- Form -->
      <ProfileEditForm />
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
</style>
