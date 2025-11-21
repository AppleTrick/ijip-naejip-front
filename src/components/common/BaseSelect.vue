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
  <div class="select-group">
    <label v-if="label" :for="id" class="select-label">{{ label }}</label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="select-field"
      >
        <option value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="select-arrow">
        <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-group {
  margin-bottom: 0;
}

.select-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.select-wrapper {
  position: relative;
}

.select-field {
  width: 100%;
  padding: 0.625rem 1rem;
  padding-right: 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
  appearance: none;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
}

.select-field:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
  border-color: transparent;
}

.select-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  pointer-events: none;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-400);
}
</style>
