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
const { selectDistrict, selectNeighborhood, selectApartment, goBack, closeSidebar } = store

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
    selectDistrict(stat)
  } else if (stat.id.startsWith('dong-')) {
    selectNeighborhood(stat)
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
        :avg-price="formatPrice(currentRegion.avgPrice)"
        subtitle="최근 6개월 가격 추이"
        :show-back-btn="hasBackButton"
        @back="goBack"
        @close="closeSidebar"
      >
        <template #content>
          <div class="main-graph-wrapper">
            <TrendGraph :data="currentRegion.trend" :height="180" color="#E84545" />
          </div>
        </template>
      </SidebarHeader>
    </template>

    <div v-if="isLoading" class="loading">
      로딩중...
    </div>

    <template v-else>
      <div class="stats-list">
        <SidebarAccordionItem
          v-for="stat in statsList"
          :key="stat.id"
          :id="stat.id"
          :name="stat.name"
          :avg-price="formatPrice(stat.avgPrice)"
          :trend-data="stat.trend"
          :is-expanded="expandedId === stat.id"
          @toggle="toggleAccordion"
          @select="handleSelect(stat)"
        />
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
}
</style>
