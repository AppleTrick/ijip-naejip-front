<script setup lang="ts">
import { ChevronDown, ChevronUp, MapPin } from 'lucide-vue-next'
import TrendGraph from './TrendGraph.vue'

defineProps<{
  id: string
  name: string
  avgPrice: string
  trendData: any[]
  isExpanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'select'): void
}>()
</script>

<template>
  <div class="accordion-item" :class="{ 'is-expanded': isExpanded }">
    <!-- Accordion Header -->
    <div class="accordion-header">
      <div class="header-content" @click="emit('toggle', id)">
        <span class="region-name">{{ name }}</span>
        <span class="avg-price">{{ avgPrice }}</span>
      </div>
      
      <div class="header-controls">
        <button class="control-btn go-to-btn" @click.stop="emit('select')" title="지도로 이동">
          <MapPin class="icon-xs" />
        </button>
        <button class="control-btn toggle-btn" @click.stop="emit('toggle', id)" title="그래프 보기">
          <component :is="isExpanded ? ChevronUp : ChevronDown" class="icon-xs" />
        </button>
      </div>
    </div>

    <!-- Accordion Content -->
    <div class="accordion-content" v-if="isExpanded">
      <div class="content-inner">
        <p class="trend-label">가격 추이</p>
        <div class="sub-graph-wrapper">
          <TrendGraph :data="trendData" :height="100" color="#2B2E4A" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-item {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
}

.accordion-item.is-expanded {
  border-color: var(--color-primary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.accordion-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-white);
  min-height: 3.5rem;
}

.accordion-header:hover {
  background-color: var(--color-gray-50);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  cursor: pointer;
  overflow: hidden;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.control-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-gray-500);
  flex-shrink: 0;
}

.control-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  border-color: var(--color-gray-300);
}

.go-to-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: var(--color-red-50); /* Assuming this exists or falls back */
}

.region-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avg-price {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.accordion-content {
  border-top: 1px solid var(--color-gray-100);
  background-color: var(--color-gray-50);
}

.content-inner {
  padding: 1rem;
}

.trend-label {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin-bottom: 0.5rem;
}

.sub-graph-wrapper {
  background-color: var(--color-white);
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-200);
  height: 120px;
}

.icon-xs {
  width: 1rem;
  height: 1rem;
}
</style>
