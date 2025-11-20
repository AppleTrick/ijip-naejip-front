<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  unit?: string
  id?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text'
})

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700 mb-2">{{ label }}</label>
    <div class="relative group">
      <input 
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full pl-4 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
        :class="{ 'pr-12': unit }"
        :placeholder="placeholder"
      >
      <span v-if="unit" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold group-focus-within:text-lime-500">{{ unit }}</span>
    </div>
  </div>
</template>
