<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Camera } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ProfileEditForm from './components/ProfileEditForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const fileInput = ref<HTMLInputElement | null>(null)

const user = computed(() => authStore.user)
const profileImage = ref<string | null>(null)

watch(() => authStore.user, (newUser) => {
  if (newUser?.profileImage) {
    profileImage.value = newUser.profileImage
  }
}, { immediate: true })

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Mock upload: create object URL
    profileImage.value = URL.createObjectURL(file)
    // In real app, upload to server here
  }
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
          <div v-if="profileImage" class="avatar-image">
            <img :src="profileImage" alt="Profile" />
          </div>
          <div v-else class="avatar-placeholder">
            {{ user?.name?.[0] || 'U' }}
          </div>
          <button class="camera-btn" @click="triggerFileInput">
            <Camera class="camera-icon" />
          </button>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            class="hidden-input"
            @change="handleFileChange"
          >
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
  background-color: var(--color-primary-transparent-20);
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

.avatar-image {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden-input {
  display: none;
}
</style>
