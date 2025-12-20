<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false
})
</script>

<template>
  <button 
    class="btn"
    :class="[
      `btn--${variant}`, 
      `btn--${size}`, 
      { 'btn--full': fullWidth, 'btn--disabled': disabled }
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 700;
  transition: all 0.2s;
  transform: scale(1);
  outline: none;
  border: none;
  cursor: pointer;
}

.btn:active {
  transform: scale(0.98);
}

.btn:focus {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

/* Variants */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 4px 6px -1px rgba(232, 69, 69, 0.3);
}

.btn--primary:hover {
  background-color: var(--color-primary-hover);
}

.btn--secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
  box-shadow: 0 4px 6px -1px rgba(144, 55, 73, 0.2);
}

.btn--secondary:hover {
  background-color: var(--color-secondary-hover);
}

.btn--outline {
  background-color: var(--color-white);
  border: 2px solid var(--color-gray-200);
  color: var(--color-text-light);
}

.btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--danger {
  background-color: var(--color-danger);
  color: var(--color-white);
  box-shadow: 0 4px 6px -1px rgba(232, 69, 69, 0.3);
}

.btn--danger:hover {
  background-color: var(--color-danger-hover);
}

/* Sizes */
.btn--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn--lg {
  padding: 0.875rem 1.5rem;
  font-size: 1.125rem;
}

/* Modifiers */
.btn--full {
  width: 100%;
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
