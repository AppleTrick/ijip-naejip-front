<script setup lang="ts">
import { useRouter } from 'vue-router'
import { User, Bell, Lock, Home, LogOut, ChevronRight, Trash2 } from 'lucide-vue-next'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()

const menuItems = [
  { 
    id: 'profile', 
    label: '개인정보 수정', 
    icon: User, 
    action: () => router.push('/settings/profile'),
    desc: '이름, 이메일 등 개인정보를 수정합니다.'
  },
  { 
    id: 'house', 
    label: '내 집 관리', 
    icon: Home, 
    action: () => router.push('/settings/house'),
    desc: '나의 거주지 정보를 등록하고 관리합니다.'
  },
  { 
    id: 'notification', 
    label: '알림 설정', 
    icon: Bell, 
    action: () => router.push('/settings/notifications'),
    desc: '앱 푸시 알림 및 이메일 수신 설정을 변경합니다.'
  },
  { 
    id: 'password', 
    label: '비밀번호 변경', 
    icon: Lock, 
    action: () => router.push('/settings/password'),
    desc: '계정 비밀번호를 주기적으로 변경하여 보안을 강화하세요.'
  }
]

const handleLogout = () => {
  // TODO: Implement logout logic
  router.push('/login')
}

const handleDeleteAccount = () => {
  if (confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    // TODO: Implement delete account logic
  }
}
</script>

<template>
  <div class="settings-view">
    <div class="container">
      <h1 class="page-title">설정</h1>
      
      <div class="settings-list">
        <BaseCard 
          v-for="item in menuItems" 
          :key="item.id" 
          class="settings-item"
          :hoverable="true"
          @click="item.action"
        >
          <div class="item-icon-wrapper">
            <component :is="item.icon" class="item-icon" />
          </div>
          <div class="item-content">
            <h3 class="item-label">{{ item.label }}</h3>
            <p class="item-desc">{{ item.desc }}</p>
          </div>
          <ChevronRight class="arrow-icon" />
        </BaseCard>
      </div>

      <div class="danger-zone">
        <h3 class="danger-title">계정 관리</h3>
        <div class="danger-actions">
          <button class="action-btn logout" @click="handleLogout">
            <LogOut class="btn-icon" /> 로그아웃
          </button>
          <button class="action-btn delete" @click="handleDeleteAccount">
            <Trash2 class="btn-icon" /> 회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 3rem 1rem;
}

.container {
  max-width: 48rem;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 2rem;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  text-align: left;
  width: 100%;
}

.settings-item:hover {
  border-color: var(--color-primary);
}

.item-icon-wrapper {
  width: 3rem;
  height: 3rem;
  background-color: rgba(144, 55, 73, 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  flex-shrink: 0;
}

.item-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary);
}

.item-content {
  flex: 1;
}

.item-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.item-desc {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-400);
}

.danger-zone {
  border-top: 1px solid var(--color-gray-200);
  padding-top: 2rem;
}

.danger-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-light);
  margin-bottom: 1rem;
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.logout {
  background-color: var(--color-white);
  color: var(--color-text);
  border: 1px solid var(--color-gray-200);
}

.logout:hover {
  background-color: var(--color-gray-50);
}

.delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete:hover {
  background-color: rgba(239, 68, 68, 0.2);
}
</style>
