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
      return 'bg-lime-500 hover:bg-lime-600 text-white shadow-lg shadow-lime-500/30 focus:ring-lime-500'
    case 'secondary':
      return 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500'
    case 'outline':
      return 'bg-white border-2 border-gray-200 hover:border-lime-500 hover:text-lime-600 text-gray-500 focus:ring-lime-500'
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 focus:ring-red-500'
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
