<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore } from '../stores/safehome'
import AnalysisForm from '../components/features/AnalysisForm.vue'
import KakaoMap from '../components/features/KakaoMap.vue'

const store = useSafeHomeStore()
const { currentAddress } = storeToRefs(store)
const { setAddress } = store

interface FormData {
  address: string
  deposit: number
  marketValue: number
  priorDebt: number
}

// Local state for the form, initialized with store value
const formData = ref<FormData>({
  address: currentAddress.value,
  deposit: 0,
  marketValue: 0,
  priorDebt: 0
})

// Sync local form address back to store if it changes
watch(() => formData.value.address, (newVal) => {
  setAddress(newVal)
})

// Sync store address changes to local form (e.g. if set from MarketView)
watch(currentAddress, (newVal) => {
  formData.value.address = newVal
})
</script>

<template>
  <div class="flex h-full w-full">
    <!-- Left Side: Analysis Form -->
    <div class="w-full md:w-[600px] h-full border-r border-gray-200 bg-white z-10 shadow-xl overflow-hidden">
      <AnalysisForm v-model="formData" />
    </div>

    <!-- Right Side: Map -->
    <div class="hidden md:block flex-1 relative bg-gray-100">
      <KakaoMap :address="formData.address" />
    </div>
  </div>
</template>
