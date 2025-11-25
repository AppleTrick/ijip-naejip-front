<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Star, ChevronRight } from 'lucide-vue-next'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()

defineProps<{
  items: Array<{
    id: number
    name: string
    price: string
    type: string
    location: string
    image: string
  }>
}>()

const navigateToDetail = (id: number) => {
  router.push(`/price/${id}`)
}
</script>

<template>
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Star class="icon" /> 회원님을 위한 추천 매물
      </h2>
      <button class="more-btn" @click="router.push('/map')">더보기 <ChevronRight class="icon-sm" /></button>
    </div>
    <div class="card-grid">
      <BaseCard 
        v-for="item in items" 
        :key="item.id" 
        :hoverable="true"
        class="property-card" 
        @click="navigateToDetail(item.id)"
      >
        <div class="image-wrapper">
          <img :src="item.image" :alt="item.name" class="card-image" />
          <span class="badge">{{ item.type }}</span>
        </div>
        <div class="card-info">
          <h3 class="card-title">{{ item.name }}</h3>
          <p class="card-location">{{ item.location }}</p>
          <p class="card-price">{{ item.price }}</p>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: var(--color-primary);
  width: 1.75rem;
  height: 1.75rem;
}

.more-btn {
  display: flex;
  align-items: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.more-btn:hover {
  color: var(--color-primary);
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.card-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem; /* Space for scrollbar */
  -webkit-overflow-scrolling: touch;
  margin: 0 -1rem; /* Negative margin to allow full-width scroll on mobile */
  padding: 0 1rem 1rem 1rem; /* Padding to compensate negative margin */
}

@media (min-width: 640px) {
  .card-grid {
    margin: 0;
    padding: 0 0 1rem 0;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.card-grid::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.card-grid {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.property-card {
  min-width: 280px;
  max-width: 320px;
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.image-wrapper {
  height: 14rem; /* Taller images for carousel */
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-info {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.card-location {
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.card-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
}
</style>
