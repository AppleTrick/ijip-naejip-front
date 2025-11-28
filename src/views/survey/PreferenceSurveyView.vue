<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SignUpStep3 from '@/views/auth/signup/components/SignUpStep3.vue'

const router = useRouter()
const authStore = useAuthStore()

const preferences = reactive({
  budget: { min: 0, max: 10 },
  interestAreas: [] as string[],
  commuteLocation: ''
})

onMounted(() => {
  if (authStore.user) {
    if (authStore.user.budget) preferences.budget = { ...authStore.user.budget }
    if (authStore.user.interestAreas) preferences.interestAreas = [...authStore.user.interestAreas]
    if (authStore.user.commuteLocation) preferences.commuteLocation = authStore.user.commuteLocation
  }
})

const handleUpdate = (data: any) => {
  Object.assign(preferences, data)
}

const handleSubmit = async () => {
  await authStore.updateUser({
    budget: preferences.budget,
    interestAreas: preferences.interestAreas,
    commuteLocation: preferences.commuteLocation
  })
  alert('성향 정보가 업데이트되었습니다.')
  router.push('/settings')
}
</script>

<template>
  <div class="survey-page">
    <div class="survey-container">
      <SignUpStep3 
        :data="preferences"
        :is-edit-mode="true"
        @update="handleUpdate"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
.survey-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.survey-container {
  width: 100%;
  max-width: 32rem;
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
