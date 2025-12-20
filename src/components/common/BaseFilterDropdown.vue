<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  label: string
  isActive?: boolean
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', close))
onUnmounted(() => document.removeEventListener('click', close))
</script>

<template>
  <div ref="containerRef" class="dropdown-container">
    <button 
      @click="toggle"
      class="filter-btn"
      :class="{ 'active': isOpen || isActive }"
    >
      <slot name="icon"></slot>
      <span class="label-text">{{ label }}</span>
      <ChevronDown class="chevron-icon" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
  background-color: var(--color-white);
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-100);
  color: var(--color-gray-700);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
  cursor: pointer;
  box-sizing: border-box;
}

.filter-btn:hover {
  border-color: var(--color-primary);
}

.filter-btn.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.label-text {
  margin-right: 0.25rem;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.25rem;
  color: var(--color-gray-400);
  transition: transform 0.2s;
}

.filter-btn.active .chevron-icon {
  color: var(--color-primary);
}

.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background-color: var(--color-white);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-gray-200);
  padding: 1rem;
  z-index: 50;
  min-width: 200px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
