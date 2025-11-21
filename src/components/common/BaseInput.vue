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
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input 
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="input-field"
        :class="{ 'has-unit': unit }"
        :placeholder="placeholder"
      >
      <span v-if="unit" class="input-unit">{{ unit }}</span>
    </div>
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 0;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box; /* Ensure padding doesn't affect width */
}

.input-field:focus {
  background-color: var(--color-white);
  box-shadow: 0 0 0 2px var(--color-primary);
  border-color: transparent;
}

.input-field.has-unit {
  padding-right: 3rem;
}

.input-unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  font-size: 0.875rem;
  font-weight: 700;
  pointer-events: none;
}

.input-wrapper:focus-within .input-unit {
  color: var(--color-primary);
}
</style>
