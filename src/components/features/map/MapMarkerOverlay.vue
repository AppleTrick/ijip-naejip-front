<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { formatPrice } from '@/utils/formatters'

const props = defineProps<{
  price: string | number
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
    <span v-if="name" class="region-name">{{ name }}</span>
    <span v-if="displayAptDong" class="dong-text">{{ displayAptDong }}</span>
    <span v-if="displayPyung" class="pyung-text">{{ displayPyung }}</span>
    <span v-if="formattedPrice" class="price-text">{{ formattedPrice }}</span>
  </div>
</template>

<style scoped>
.marker-overlay {
  padding: 0.6rem 0.9rem;
  /* Glassmorphism Effect */
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  
  border: 1.5px solid var(--color-primary);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 70px;
}

.marker-overlay:hover {
  transform: translateY(-5px) scale(1.05);
  background: var(--color-primary);
  border-color: var(--color-white);
  z-index: 100;
}

.marker-overlay:hover span {
  color: var(--color-white);
  opacity: 1;
}

.region-name {
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  opacity: 0.8;
}

.pyung-text {
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 400;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  opacity: 0.7;
}

.dong-text {
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  opacity: 0.85;
}

.price-text {
  color: var(--color-primary);
  font-weight: 800;
  font-size: 1rem;
  white-space: nowrap;
  font-family: 'Pretendard', sans-serif;
  transition: color 0.3s;
}

.marker-overlay:hover .price-text {
  color: var(--color-white);
}

/* Selected State */
.marker-overlay.selected {
  background: var(--color-primary);
  border-color: var(--color-white);
  box-shadow: 0 0 15px var(--color-primary-transparent-30);
}

.marker-overlay.selected span {
  color: var(--color-white);
  opacity: 1;
}
</style>
