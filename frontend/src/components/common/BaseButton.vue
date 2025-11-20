<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false
})

const baseClasses = 'inline-flex items-center justify-center rounded-lg font-bold transition-all transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-[#E84545] hover:bg-[#D63939] text-white shadow-lg shadow-[#E84545]/30 focus:ring-[#E84545]'
    case 'secondary':
      return 'bg-[#903749] hover:bg-[#7A2F3E] text-white shadow-md shadow-[#903749]/20 focus:ring-[#903749]'
    case 'outline':
      return 'bg-white border-2 border-[#E5E7EB] hover:border-[#E84545] hover:text-[#E84545] text-[#6B7280] focus:ring-[#E84545]'
    case 'danger':
      return 'bg-[#E84545] hover:bg-[#D63939] text-white shadow-lg shadow-[#E84545]/30 focus:ring-[#E84545]'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-4 py-2 text-base'
    case 'lg':
      return 'px-6 py-3.5 text-lg'
    default:
      return ''
  }
})
</script>

<template>
  <button 
    :class="[
      baseClasses, 
      variantClasses, 
      sizeClasses, 
      { 'w-full': fullWidth, 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>
