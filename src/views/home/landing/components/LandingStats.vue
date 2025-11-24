<script setup lang="ts">
defineProps<{
  stats: any[]
}>()
</script>

<template>
  <section class="stats-section">
    <div class="stats-container">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <component :is="stat.icon" class="stat-card-icon" :size="32" />
        <div class="stat-card-value">
          {{ stat.decimal ? stat.value.toFixed(1) : stat.value.toLocaleString() }}{{ stat.suffix }}
        </div>
        <div class="stat-card-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: 6rem 2rem;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-gray-100);
  border-bottom: 1px solid var(--color-gray-100);
}

.stats-container {
  max-width: 80rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

@media (min-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.stat-card-icon {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-card-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.stat-card-label {
  font-size: 1rem;
  color: var(--color-text-light);
  font-weight: 600;
}
</style>
