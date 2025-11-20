<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: Option[]
  label?: string
  id?: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '선택하세요'
})

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-semibold text-[#2B2E4A] mb-2">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#2B2E4A] font-medium focus:ring-2 focus:ring-[#E84545] focus:border-transparent transition-all appearance-none cursor-pointer"
      >
        <option value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-5 h-5 text-[#9CA3AF]" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>
