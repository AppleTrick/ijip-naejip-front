<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  title: string
  variant: 'semantic' | 'filter' | 'stats'
}>()

const emit = defineEmits(['click'])

const btnClass = computed(() => {
  return {
    'semantic': props.variant === 'semantic',
    'filter': props.variant === 'filter',
    'stats': props.variant === 'stats'
  }
})
</script>

<template>
  <button 
    class="ai-fab-btn" 
    :class="btnClass"
    @click="emit('click')" 
    :title="title"
  >
    <div class="icon-wrapper">
      <slot name="icon"></slot>
    </div>
    <span class="fab-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.ai-fab-btn {
  display: flex;
  align-items: center;
  height: 3.5rem; /* 고정 높이 */
  min-width: 3.5rem; /* 최소 너비 (원형 유지) */
  padding: 0; /* 패딩 초기화 */
  border: none;
  border-radius: 9999px;
  background-color: var(--color-white);
  color: var(--color-gray-700);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  max-width: 3.5rem; /* 기본 상태: 아이콘만 보임 */
  white-space: nowrap;
}

.ai-fab-btn:hover {
  max-width: 12rem; /* 확장 상태 */
  padding-right: 1.5rem; /* 텍스트 여백 확보 */
  background-color: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-2px);
}

.icon-wrapper {
  width: 3.5rem; /* 아이콘 영역 너비 고정 */
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 아이콘 영역 줄어들지 않음 */
}

/* 슬롯 내부 아이콘 크기 강제 */
:deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}

.fab-label {
  font-weight: 700;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  margin-left: -0.5rem; /* 아이콘과의 간격 조절 */
}

.ai-fab-btn:hover .fab-label {
  opacity: 1;
  margin-left: 0;
}

/* Variant Styles */
.ai-fab-btn.semantic {
  border: 1px solid var(--color-primary-transparent-20);
}

.ai-fab-btn.filter {
  border: 1px solid var(--color-secondary-transparent-20);
}

.ai-fab-btn.stats {
  border: 1px solid rgba(139, 92, 246, 0.2); /* Violet secondary */
}
</style>
