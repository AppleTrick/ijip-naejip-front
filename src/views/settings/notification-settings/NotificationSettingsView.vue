<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Bell } from 'lucide-vue-next'
import NotificationForm from './components/NotificationForm.vue'

const router = useRouter()
</script>

<template>
  <div class="notification-settings-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="router.back()">
          <ArrowLeft class="icon" />
        </button>
        <h1 class="page-title">알림 설정</h1>
        <div class="placeholder"></div>
      </div>

      <div class="content-card">
        <div class="icon-header">
          <div class="icon-wrapper">
            <Bell class="bell-icon" />
          </div>
          <p class="header-desc">
            중요한 정보를 놓치지 않도록<br>
            알림 설정을 관리하세요.
          </p>
        </div>

        <NotificationForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-settings-view {
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
  background-color: var(--color-primary-transparent-10);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.bell-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
}

.header-desc {
  color: var(--color-text-light);
  line-height: 1.5;
  font-size: 0.875rem;
}
</style>
