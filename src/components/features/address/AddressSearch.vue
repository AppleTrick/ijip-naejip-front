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
  <div class="search-container">
    <input 
      :value="modelValue" 
      readonly 
      @click="openPostcode"
      type="text" 
      class="search-input" 
      placeholder="주소 검색 (클릭)"
    >
    <Search class="search-icon" />
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.2s;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.search-input:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
  border-color: transparent;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
}
</style>

