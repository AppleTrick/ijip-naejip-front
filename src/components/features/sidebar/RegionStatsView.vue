<script setup lang="ts">
import { ref } from 'vue'
import { useMarketStatsStore } from '@/stores/marketStats'
import { storeToRefs } from 'pinia'
import SidebarLayout from './common/SidebarLayout.vue'
import SidebarHeader from './common/SidebarHeader.vue'
import SidebarAccordionItem from './common/SidebarAccordionItem.vue'
import TrendGraph from './common/TrendGraph.vue'

defineProps<{
  hasBackButton?: boolean
}>()

const store = useMarketStatsStore()
const { statsList, isLoading, currentRegion } = storeToRefs(store)
const { selectDistrict, selectNeighborhood, selectDong, selectApartment, goBack, closeSidebar } = store

const expandedId = ref<string | null>(null)

const toggleAccordion = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const formatPrice = (price: number) => {
  const eok = price / 10000
  return `${eok.toFixed(1)}억`
}

const handleSelect = (stat: any) => {
  if (stat.id.startsWith('city-')) {
    selectDistrict(stat)
  } else if (stat.id.startsWith('gu-')) {
    selectNeighborhood(stat)
  } else if (stat.id.startsWith('dong-')) {
    selectDong(stat)
  } else if (stat.id.startsWith('apt-')) {
    selectApartment(stat.id)
  }
}
</script>

<template>
  <SidebarLayout>
    <template #header>
      <SidebarHeader 
        v-if="currentRegion"
        :title="currentRegion.name"
        :avg-price="currentRegion.avgPrice > 0 ? formatPrice(currentRegion.avgPrice) : undefined"
        :subtitle="currentRegion.trend && currentRegion.trend.length > 0 ? '최근 6개월 가격 추이' : undefined"
        :show-back-btn="hasBackButton"
        @back="goBack"
        @close="closeSidebar"
      >
        <template #content>
          <div v-if="currentRegion.trend && currentRegion.trend.length > 0" class="main-graph-wrapper">
            <TrendGraph :data="currentRegion.trend" :height="180" color="var(--color-primary)" />
          </div>
        </template>
      </SidebarHeader>
    </template>

    <div v-if="isLoading" class="loading">
      로딩중...
    </div>

    <template v-else>
      <div class="stats-list">
        <!-- 데이터가 있을 때는 아코디언, 없을 때는 단순 리스트 -->
        <template v-for="stat in statsList" :key="stat.id">
          <SidebarAccordionItem
            v-if="stat.avgPrice > 0 || (stat.trend && stat.trend.length > 0)"
            :id="stat.id"
            :name="stat.name"
            :avg-price="formatPrice(stat.avgPrice)"
            :trend-data="stat.trend"
            :is-expanded="expandedId === stat.id"
            @toggle="toggleAccordion"
            @select="handleSelect(stat)"
          />
          
          <div 
            v-else 
            class="simple-item"
            @click="handleSelect(stat)"
          >
            <span class="region-name">{{ stat.name }}</span>
            <button class="go-btn">
              이동
            </button>
          </div>
        </template>
      </div>
    </template>
  </SidebarLayout>
</template>

<style scoped>
.main-graph-wrapper {
  background-color: var(--color-gray-50);
  border-radius: 0.75rem;
  padding: 1rem;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: var(--color-gray-500);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1rem 1rem 1rem; /* Add padding for better spacing */
}

.simple-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.simple-item:hover {
  background-color: var(--color-gray-50);
  border-color: var(--color-primary);
}

.region-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.go-btn {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
