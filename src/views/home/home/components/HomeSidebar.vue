<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { Clock } from 'lucide-vue-next'

const router = useRouter()

defineProps<{
  recentItems: Array<{
    id: number
    name: string
    price: string
    location: string
  }>
}>()

const navigateToDetail = (id: number) => {
  router.push(`/price/${id}`)
}
</script>

<template>
  <aside class="sidebar">
    <!-- Recently Viewed -->
    <BaseCard class="sidebar-card">
      <h3 class="sidebar-title">
        <Clock class="icon-sm" /> 최근 본 매물
      </h3>
      <ul class="recent-list">
        <li v-for="item in recentItems" :key="item.id" class="recent-item" @click="navigateToDetail(item.id)">
          <div class="recent-info">
            <span class="recent-name">{{ item.name }}</span>
            <span class="recent-price">{{ item.price }}</span>
          </div>
          <span class="recent-location">{{ item.location }}</span>
        </li>
      </ul>
    </BaseCard>

    <!-- Quick Actions -->
    <BaseCard class="sidebar-card">
      <h3 class="sidebar-title">바로가기</h3>
      <div class="action-buttons">
        <BaseButton variant="outline" full-width @click="router.push('/map')">지도에서 찾기</BaseButton>
        <BaseButton variant="outline" full-width @click="router.push('/comparison')">매물 비교하기</BaseButton>
        <BaseButton variant="outline" full-width @click="router.push('/analysis')">안전도 분석</BaseButton>
      </div>
    </BaseCard>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  padding: 1.5rem;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-gray-100);
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background-color: var(--color-gray-50);
}

.recent-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.recent-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text);
}

.recent-price {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-primary);
}

.recent-location {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
