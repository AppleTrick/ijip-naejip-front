<script setup lang="ts">
import { Search } from 'lucide-vue-next'

interface Props {
  modelValue?: string
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const openPostcode = () => {
  new (window as any).daum.Postcode({
    oncomplete: function(data: any) {
      emit('update:modelValue', data.address)
    }
  }).open()
}
</script>

<template>
  <div class="relative">
    <input 
      :value="modelValue" 
      readonly 
      @click="openPostcode"
      type="text" 
      class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all cursor-pointer" 
      placeholder="주소 검색 (클릭)"
    >
    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  </div>
</template>

