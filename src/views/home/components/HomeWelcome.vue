<script setup lang="ts">
defineProps<{
  userName: string
}>()
</script>

<template>
  <section class="welcome-section">
    <div class="container">
      <h1 class="greeting">
        안녕하세요, <span class="highlight">{{ userName }}</span>님!<br>
        오늘의 추천 매물을 확인해보세요.
      </h1>
    </div>
  </section>
</template>

<style scoped>
.welcome-section {
  background-color: var(--color-white);
  padding: 3rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

.greeting {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.4;
}

.highlight {
  color: var(--color-primary);
}
</style>
