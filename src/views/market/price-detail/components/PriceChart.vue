<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  data: Array<{ date: string; price: string }>
}>()

const parsePrice = (priceStr: string) => {
  // "34억 5000" -> 34.5
  const parts = priceStr.split('억')
  let val = parseFloat(parts[0])
  if (parts[1]) {
    val += parseFloat(parts[1]) / 10000
  }
  return val
}

const chartData = computed(() => {
  return props.data.map(d => ({
    label: d.date,
    value: parsePrice(d.price),
    displayValue: d.price
  })).reverse() // Show oldest to newest
})

const maxVal = computed(() => Math.max(...chartData.value.map(d => d.value)) * 1.1)
const minVal = computed(() => Math.min(...chartData.value.map(d => d.value)) * 0.9)

const getBarHeight = (val: number) => {
  const range = maxVal.value - minVal.value
  return ((val - minVal.value) / range) * 100
}

const hoveredIndex = ref<number | null>(null)
</script>

<template>
  <div class="price-chart">
    <div class="chart-container">
      <div 
        v-for="(item, index) in chartData" 
        :key="index" 
        class="bar-group"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <!-- Tooltip -->
        <div class="tooltip" :class="{ visible: hoveredIndex === index }">
          <span class="tooltip-price">{{ item.displayValue }}</span>
          <span class="tooltip-date">{{ item.label }}</span>
        </div>

        <!-- Bar -->
        <div class="bar-wrapper">
          <div 
            class="bar" 
            :style="{ height: `${getBarHeight(item.value)}%` }"
            :class="{ active: hoveredIndex === index }"
          ></div>
        </div>

        <!-- Label -->
        <span class="x-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.price-chart {
  width: 100%;
  height: 100%;
  padding: 1rem 0;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 1.5rem; /* Space for labels */
  position: relative;
}

.bar-group {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.bar-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 0.5rem;
}

.bar {
  width: 100%;
  max-width: 2rem;
  background-color: var(--color-primary);
  opacity: 0.3;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  min-height: 4px;
}

.bar.active {
  opacity: 1;
  transform: scaleY(1.05);
  box-shadow: 0 4px 12px rgba(232, 69, 69, 0.3);
}

.x-label {
  position: absolute;
  bottom: -1.5rem;
  font-size: 0.75rem;
  color: var(--color-text-light);
  white-space: nowrap;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: var(--color-text);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(-8px);
}

.tooltip-price {
  font-weight: 700;
  font-size: 0.875rem;
}

.tooltip-date {
  font-size: 0.75rem;
  opacity: 0.8;
}
</style>
