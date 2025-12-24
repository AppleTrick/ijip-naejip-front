<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { formatPrice } from '@/utils/formatters'

const props = defineProps<{
  price: string | number
  pricePerPyung?: number
  name?: string
  pyung?: string
  aptDong?: string
  isSelected?: boolean
}>()

// 마커 표시 여부를 결정하는 함수 (나중에 필터 로직 등으로 확장 가능)
const shouldShowMarker = (price: string | number) => {
  if (!price) return false
  if (price === 0 || price === '0' || price === '0만원') return false
  return true
}

const isVisible = computed(() => {
  return shouldShowMarker(props.price)
})

const formattedPrice = computed(() => {
  if (!isVisible.value) return ''
  return formatPrice(props.price)
})

const formattedPricePerPyung = computed(() => {
  if (!props.pricePerPyung) return ''
  return `평당 ${formatPrice(props.pricePerPyung)}`
})

const displayAptDong = computed(() => {
  const val = props.aptDong?.trim()
  if (!val || val === '' || val === '-' || val === 'null' || val === 'undefined') return ''
  
  const nameVal = props.name?.trim() || ''
  
  // 1. 중복 체크: 아파트 이름과 동 정보가 같거나 이름에 이미 포함된 경우 숨김
  if (nameVal && (val === nameVal || nameVal.includes(val))) return ''

  // 2. 이미 '동'으로 끝나면 그대로 반환
  if (val.endsWith('동')) return val
  
  // 3. 숫자가 포함되어 있거나, 아주 짧은 문자열(A, B, 가, 나 등)인 경우 -> '동' 추가
  if (/\d/.test(val) || val.length <= 2) return `${val}동`
  
  // 4. 그 외 문자열(건물명/단지명 등)은 그대로 반환
  return val
})

const displayPyung = computed(() => {
  const val = props.pyung?.trim()
  if (!val || val === '' || val === '-' || val === 'null' || val === 'undefined') return ''
  return val.endsWith('평') ? val : `${val}평`
})

onMounted(() => {
  // console.log('MapMarkerOverlay mounted:', props.name, props.aptDong);
})
</script>

<template>
  <div v-if="isVisible" class="marker-overlay" :class="{ 'selected': isSelected }">
    <div class="marker-body">
      <span v-if="name" class="region-name">{{ name }}</span>
      <div v-if="displayAptDong || displayPyung" class="sub-info">
        <span v-if="displayAptDong">{{ displayAptDong }}</span>
        <span v-if="displayAptDong && displayPyung">•</span>
        <span v-if="displayPyung">{{ displayPyung }}</span>
      </div>
      <span v-if="formattedPrice" class="price-text">{{ formattedPrice }}</span>
      <span v-if="formattedPricePerPyung" class="sub-price-text">{{ formattedPricePerPyung }}</span>
    </div>
  </div>
</template>

<style scoped>
.marker-overlay {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 4px 12px rgba(31, 38, 135, 0.2));
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom center;
}

/* Main Marker Body */
.marker-body {
  padding: 0.5rem 0.75rem;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1.5px solid var(--color-primary);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  min-width: 65px;
  z-index: 2;
  transition: all 0.3s ease;
}

/* Pin Tail (Pointer) */
.marker-overlay::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: var(--color-white);
  border-right: 1.5px solid var(--color-primary);
  border-bottom: 1.5px solid var(--color-primary);
  z-index: 1;
  transition: all 0.3s ease;
}

/* Typography Hierarchy */
.region-name {
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: -0.02em;
}

.sub-info {
  display: flex;
  gap: 0.25rem;
  font-size: 0.65rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.price-text {
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--color-primary);
  font-family: 'Pretendard', sans-serif;
  margin-top: 0.125rem;
}

.sub-price-text {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: 'Pretendard', sans-serif;
  margin-top: -0.1rem;
  opacity: 0.9;
}

/* Interaction States */
.marker-overlay:hover {
  transform: translateY(-8px) scale(1.08);
  z-index: 100;
}

.marker-overlay:hover .marker-body {
  background: var(--color-primary);
  border-color: var(--color-white);
}

.marker-overlay:hover::after {
  background: var(--color-primary);
  border-color: var(--color-white);
}

.marker-overlay:hover span {
  color: var(--color-white);
  opacity: 1;
}

.marker-overlay:hover .price-text {
  color: var(--color-white);
}

.marker-overlay:hover .sub-price-text {
  color: var(--color-white);
  opacity: 1;
}

/* Selected State */
.marker-overlay.selected .marker-body {
  background: var(--color-primary);
  border-color: var(--color-white);
  box-shadow: 0 0 15px var(--color-primary-transparent-30);
}

.marker-overlay.selected::after {
  background: var(--color-primary);
  border-color: var(--color-white);
}

.marker-overlay.selected span {
  color: var(--color-white);
}

.marker-overlay.selected .price-text {
  color: var(--color-white);
}

.marker-overlay.selected .sub-price-text {
  color: var(--color-white);
}
</style>
