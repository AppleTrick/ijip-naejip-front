<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const navigateToMap = () => {
  router.push('/map')
}
</script>

<template>
  <section class="cta-section">
    <div class="cta-content">
      <h2 class="cta-title">지금 바로 시작하세요</h2>
      <p class="cta-subtitle">SafeHome과 함께 안전한 주거 생활을 경험해보세요</p>
      <div class="cta-actions">
        <BaseButton 
          variant="primary" 
          size="lg" 
          class="cta-main-button"
          @click="navigateToMap"
        >
          무료로 시작하기
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding: 8rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.05), rgba(144, 55, 73, 0.05));
}

.cta-content {
  max-width: 40rem;
  margin: 0 auto;
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: 3rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
}

.cta-main-button {
  min-width: 200px;
  font-size: 1.125rem;
  padding: 1rem 2rem;
}
</style>
