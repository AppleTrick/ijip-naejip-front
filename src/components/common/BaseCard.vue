<script setup lang="ts">
defineProps<{
  hoverable?: boolean
}>()
</script>

<template>
  <div class="base-card" :class="{ 'is-hoverable': hoverable }">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-card {
  background-color: var(--color-white);
  border-radius: 1rem;
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.is-hoverable {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.is-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
