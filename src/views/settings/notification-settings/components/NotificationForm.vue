<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseToggle from '@/components/common/BaseToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

const settings = ref({
  pushEnabled: true,
  emailEnabled: false,
  marketingEnabled: false
})

onMounted(() => {
  if (authStore.user) {
    settings.value = {
      pushEnabled: authStore.user.appPush ?? true,
      emailEnabled: authStore.user.emailNotification ?? false,
      marketingEnabled: authStore.user.marketingNotification ?? false
    }
  }
})

const handleSave = async () => {
  await authStore.updateUser({
    appPush: settings.value.pushEnabled,
    emailNotification: settings.value.emailEnabled,
    marketingNotification: settings.value.marketingEnabled
  })
  alert('알림 설정이 저장되었습니다.')
  router.back()
}
</script>

<template>
  <form class="settings-form" @submit.prevent="handleSave">
    <div class="setting-item">
      <div class="setting-info">
        <h3 class="setting-title">앱 푸시 알림</h3>
        <p class="setting-desc">주요 서비스 이용 알림을 받습니다.</p>
      </div>
      <BaseToggle v-model="settings.pushEnabled" />
    </div>

    <div class="setting-item">
      <div class="setting-info">
        <h3 class="setting-title">이메일 알림</h3>
        <p class="setting-desc">주요 공지사항 및 소식을 메일로 받습니다.</p>
      </div>
      <BaseToggle v-model="settings.emailEnabled" />
    </div>

    <div class="setting-item">
      <div class="setting-info">
        <h3 class="setting-title">마케팅 정보 수신</h3>
        <p class="setting-desc">이벤트 및 혜택 정보를 받습니다.</p>
      </div>
      <BaseToggle v-model="settings.marketingEnabled" />
    </div>

    <div class="actions">
      <BaseButton type="submit" full-width size="lg">
        저장하기
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
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

.actions {
  margin-top: 1rem;
}
</style>
