<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import { colors } from '@/constants/colors'

onMounted(() => {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables (e.g., primaryHover -> --color-primary-hover)
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  })
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
  height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: "Pretendard", sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
}
</style>
