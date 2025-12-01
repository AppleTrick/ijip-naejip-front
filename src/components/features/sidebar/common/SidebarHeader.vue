<script setup lang="ts">
import { X, ArrowLeft } from 'lucide-vue-next'

defineProps<{
  title?: string
  subtitle?: string
  avgPrice?: string
  showBackBtn?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'back'): void
}>()
</script>

<template>
  <div class="sidebar-header">
    <div class="header-nav">
      <button v-if="showBackBtn" class="back-btn" @click="emit('back')">
        <ArrowLeft class="icon-sm" />
      </button>
      
      <div class="header-info-top">
        <h2 class="view-title">{{ title }}</h2>
        <span v-if="avgPrice" class="avg-badge">평균 {{ avgPrice }}</span>
      </div>
      
      <button class="close-btn" @click="emit('close')">
        <X class="icon-sm" />
      </button>
    </div>
    
    <p v-if="subtitle" class="view-subtitle">{{ subtitle }}</p>
    
    <slot name="content"></slot>
  </div>
</template>

<style scoped>
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  flex-shrink: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.header-info-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.avg-badge {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.view-subtitle {
  color: var(--color-gray-500);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding-left: 0.25rem; /* Adjusted alignment */
}

.back-btn, .close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  transition: all 0.2s;
}

.back-btn:hover, .close-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
