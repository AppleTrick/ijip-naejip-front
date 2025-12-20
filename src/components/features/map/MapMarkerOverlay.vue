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
  <div v-if="isVisible" class="marker-overlay">
    <span v-if="name" class="region-name">{{ name }}</span>
    <span v-if="displayAptDong" class="dong-text">{{ displayAptDong }}</span>
    <span v-if="displayPyung" class="pyung-text">{{ displayPyung }}</span>
    <span v-if="formattedPrice" class="price-text">{{ formattedPrice }}</span>
  </div>
</template>

<style scoped>
.marker-overlay {
  padding: 0.5rem 0.75rem;
  background-color: var(--color-soft-red);
  border: 2px solid var(--color-primary);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(43, 46, 74, 0.3); /* primaryTransparent30 */
  transition: transform 0.2s;
  min-width: 60px;
}

.marker-overlay:hover {
  transform: scale(1.1);
  z-index: 10;
}

.region-name {
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  opacity: 0.9;
}

.pyung-text {
  color: white;
  font-size: 0.7rem;
  font-weight: 400;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  opacity: 0.8;
}

.dong-text {
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  opacity: 0.85;
}

.price-text {
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  font-family: 'Pretendard', sans-serif;
}
</style>
