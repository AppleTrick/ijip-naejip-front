<script setup lang="ts">
import { ref } from 'vue'
import { useMarketStatsStore } from '@/stores/marketStats'
import { storeToRefs } from 'pinia'
import TrendGraph from './TrendGraph.vue'
import { ChevronDown, ChevronUp, MapPin, ArrowLeft, X } from 'lucide-vue-next'

const store = useMarketStatsStore()
const { statsList, isLoading, currentRegion } = storeToRefs(store)
const { selectNeighborhood, goBack } = store

const expandedId = ref<string | null>(null)

const toggleAccordion = (id: string) => {
  if (expandedId.value === id) {
    expandedId.value = null
  } else {
    expandedId.value = id
  }
}

const formatPrice = (price: number) => {
  const eok = price / 10000
  return `${eok.toFixed(1)}억`
}
</script>

<template>
  <div class="level-view">
    <!-- Main Region Header & Graph -->
    <div class="view-header" v-if="currentRegion">
      <div class="header-nav">
        <button class="back-btn" @click="goBack">
          <ArrowLeft class="icon-sm" />
        </button>
        <div class="header-info-top">
          <h2 class="view-title">{{ currentRegion.name }}</h2>
          <span class="avg-badge">평균 {{ formatPrice(currentRegion.avgPrice) }}</span>
        </div>
        <button class="close-btn" @click="store.closeSidebar">
          <X class="icon-sm" />
        </button>
      </div>
      
      <p class="view-subtitle">최근 6개월 가격 추이</p>
      
      <div class="main-graph-wrapper">
        <TrendGraph :data="currentRegion.trend" :height="180" color="#E84545" />
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      로딩중...
    </div>

    <!-- Accordion List -->
    <div v-else class="stats-list">
      <div 
        v-for="stat in statsList" 
        :key="stat.id" 
        class="accordion-item"
        :class="{ 'is-expanded': expandedId === stat.id }"
      >
        <!-- Accordion Header -->
        <div class="accordion-header">
          <div class="header-content" @click="toggleAccordion(stat.id)">
            <span class="region-name">{{ stat.name }}</span>
            <span class="avg-price">{{ formatPrice(stat.avgPrice) }}</span>
          </div>
          
          <div class="header-controls">
            <button class="control-btn go-to-btn" @click.stop="selectNeighborhood(stat)" title="지도로 이동">
              <MapPin class="icon-xs" />
            </button>
            <button class="control-btn toggle-btn" @click.stop="toggleAccordion(stat.id)" title="그래프 보기">
              <component :is="expandedId === stat.id ? ChevronUp : ChevronDown" class="icon-xs" />
            </button>
          </div>
        </div>

        <!-- Accordion Content -->
        <div class="accordion-content" v-if="expandedId === stat.id">
          <div class="content-inner">
            <p class="trend-label">가격 추이</p>
            <div class="sub-graph-wrapper">
              <TrendGraph :data="stat.trend" :height="100" color="#2B2E4A" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.level-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.view-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  flex-shrink: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-600);
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-800);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  margin-left: auto;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.header-info-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.avg-badge {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.view-subtitle {
  color: var(--color-gray-500);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding-left: 3rem;
}

.main-graph-wrapper {
  background-color: var(--color-gray-50);
  border-radius: 0.75rem;
  padding: 1rem;
}

.stats-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
}

.accordion-item {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
}

.accordion-item.is-expanded {
  border-color: var(--color-primary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.accordion-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-white);
  min-height: 3.5rem;
}

.accordion-header:hover {
  background-color: var(--color-gray-50);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  cursor: pointer;
  overflow: hidden;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.control-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-gray-500);
  flex-shrink: 0;
}

.control-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  border-color: var(--color-gray-300);
}

.go-to-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: var(--color-red-50);
}

.region-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avg-price {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.accordion-content {
  border-top: 1px solid var(--color-gray-100);
  background-color: var(--color-gray-50);
}

.content-inner {
  padding: 1rem;
}

.trend-label {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin-bottom: 0.5rem;
}

.sub-graph-wrapper {
  background-color: var(--color-white);
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-200);
  height: 120px;
}

.icon-xs {
  width: 1rem;
  height: 1rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: var(--color-gray-500);
}
</style>
