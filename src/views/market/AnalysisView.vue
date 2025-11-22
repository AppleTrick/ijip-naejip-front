<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore } from '@/stores/safehome'
import AnalysisForm from '@/components/features/AnalysisForm.vue'
import KakaoMap from '@/components/features/KakaoMap.vue'
import AnalysisMapOverlay from '@/components/features/AnalysisMapOverlay.vue'

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
  <div class="analysis-view">
    <!-- Left Side: Analysis Form -->
    <div class="sidebar">
      <AnalysisForm v-model="formData" />
    </div>

    <!-- Right Side: Map -->
    <div class="map-container">
      <KakaoMap :address="formData.address" />
      <AnalysisMapOverlay />
    </div>
  </div>
</template>

<style scoped>
.analysis-view {
  display: flex;
  height: 100%;
  width: 100%;
}

.sidebar {
  width: 100%;
  height: 100%;
  border-right: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  z-index: 10;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

@media (min-width: 768px) {
  .sidebar {
    width: 450px;
  }
}

.map-container {
  display: none;
  flex: 1;
  position: relative;
  background-color: var(--color-gray-100);
}

@media (min-width: 768px) {
  .map-container {
    display: block;
  }
}
</style>
