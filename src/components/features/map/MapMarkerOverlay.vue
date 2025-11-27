<script setup lang="ts">
import { computed } from 'vue'
import { colors } from '@/constants/colors'
import { formatPrice } from '@/utils/formatters'

const props = defineProps<{
  price: string | number
  isSelected?: boolean
}>()

const formattedPrice = computed(() => formatPrice(props.price))
</script>

<template>
  <div class="marker-overlay">
    <span class="price-text">{{ formattedPrice }}</span>
  </div>
</template>

<style scoped>
.marker-overlay {
  padding: 0.5rem 1rem;
  background-color: v-bind('colors.primary');
  border: 2px solid v-bind('colors.primary');
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(43, 46, 74, 0.3); /* primaryTransparent30 */
  transition: transform 0.2s;
}

.marker-overlay:hover {
  transform: scale(1.1);
}

.price-text {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  font-family: 'Pretendard', sans-serif;
}
</style>
