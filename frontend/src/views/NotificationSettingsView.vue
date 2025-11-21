<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { ArrowLeft, Bell } from 'lucide-vue-next'

const router = useRouter()

const settings = ref({
  pushEnabled: true,
  emailEnabled: false,
  marketingEnabled: false
})

const handleSave = () => {
  // TODO: Implement save logic
  alert('알림 설정이 저장되었습니다.')
  router.back()
}
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

        <form class="settings-form" @submit.prevent="handleSave">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">앱 푸시 알림</h3>
              <p class="setting-desc">주요 서비스 이용 알림을 받습니다.</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.pushEnabled">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">이메일 알림</h3>
              <p class="setting-desc">주요 공지사항 및 소식을 메일로 받습니다.</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.emailEnabled">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">마케팅 정보 수신</h3>
              <p class="setting-desc">이벤트 및 혜택 정보를 받습니다.</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.marketingEnabled">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="actions">
            <BaseButton type="submit" full-width size="lg">
              저장하기
            </BaseButton>
          </div>
        </form>
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
  background-color: rgba(144, 55, 73, 0.1);
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.setting-desc {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.actions {
  margin-top: 1rem;
}
</style>
