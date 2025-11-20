<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'file-analyzed', data: { deposit: number, marketValue: number, priorDebt: number }): void
}>()
const isAnalyzing = ref<boolean>(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isAnalyzing.value = true
  
  // Mocking AI Analysis (3 seconds delay)
  setTimeout(() => {
    isAnalyzing.value = false
    // Mock Data extracted from "PDF"
    const mockData = {
      deposit: 200000000, // 2억
      marketValue: 250000000, // 2.5억
      priorDebt: 30000000 // 3천
    }
    emit('file-analyzed', mockData)
    alert('AI가 등기부등본 분석을 완료했습니다!')
  }, 3000)
}
</script>

<template>
  <div class="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-lime-400 transition-colors cursor-pointer relative">
    <input 
      type="file" 
      accept=".pdf,.jpg,.png" 
      @change="handleFileUpload"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    >
    <div v-if="isAnalyzing" class="text-lime-400 animate-pulse">
      <p class="text-lg font-bold">AI가 문서를 분석 중입니다...</p>
      <p class="text-sm text-gray-400">잠시만 기다려주세요.</p>
    </div>
    <div v-else>
      <p class="text-gray-300 font-medium">등기부등본(PDF)을 여기에 드래그하거나 클릭하세요</p>
      <p class="text-sm text-gray-500 mt-2">AI가 자동으로 보증금과 융자를 분석합니다.</p>
    </div>
  </div>
</template>
