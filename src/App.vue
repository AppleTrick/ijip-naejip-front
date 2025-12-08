<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div class="app-container">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh; /* Changed from height to min-height */
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: "Pretendard", sans-serif;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column; /* Ensure children fill height */
}
</style>
