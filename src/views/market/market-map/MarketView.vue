
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore } from '@/stores/safehome'
import type { Property } from '@/api/types'
import KakaoMap from '@/components/features/map/KakaoMap.vue'
import MarketFilter from './components/MarketFilter.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ShieldCheck, X, Check, Plus } from 'lucide-vue-next'
import { useMarket } from '@/composables/useMarket'
import { formatPrice } from '@/utils/formatters'

const router = useRouter()
const store = useSafeHomeStore()
const { selectedProperty, filteredProperties } = storeToRefs(store)
const { selectProperty, setSearchQuery, addToComparison, removeFromComparison, isInComparison } = store
const { fetchProperties } = useMarket()

onMounted(async () => {
  if (store.marketProperties.length === 0) {
    await fetchProperties()
  }
})

const handleSearch = (query: string) => {
  setSearchQuery(query)
}

const handleFilter = (filters: any) => {
  store.setFilters(filters)
}

const handleMarkerSelect = (property: Property) => {
  selectProperty(property)
}

const closePropertyCard = () => {
  selectProperty(null)
}

const goToAnalysis = () => {
  router.push('/analysis')
}

const goToDetail = () => {
  if (selectedProperty.value) {
    router.push(`/price/${selectedProperty.value.aptSeq}`)
  }
}
</script>

<template>
  <div class="market-page">
    <!-- Left Sidebar (Property Details) -->
    <div v-if="selectedProperty" class="property-sidebar">
      <!-- Header Image Placeholder -->
      <div class="sidebar-header">
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
             alt="Property" class="header-image">
        <div class="header-overlay"></div>
        <button @click="closePropertyCard" class="close-btn">
          <X class="icon-sm" />
        </button>
      </div>

      <!-- Content -->
      <div class="sidebar-content">
        <div class="property-header">
          <div class="title-row">
            <h2 class="property-title">{{ selectedProperty.aptNm }}</h2>
            <button 
              @click="isInComparison(selectedProperty.aptSeq) ? removeFromComparison(selectedProperty.aptSeq) : addToComparison(selectedProperty)"
              class="compare-btn"
              :class="isInComparison(selectedProperty.aptSeq) ? 'compare-btn--active' : 'compare-btn--inactive'"
              :title="isInComparison(selectedProperty.aptSeq) ? '비교함에서 제거' : '비교함에 추가'"
            >
              <component :is="isInComparison(selectedProperty.aptSeq) ? Check : Plus" class="icon-md" />
            </button>
          </div>

          <p class="property-address">
            <span class="mr-2">📍</span> {{ selectedProperty.roadNm }}
          </p>
          <div class="action-row">
            <BaseButton full-width variant="primary" @click="goToDetail">
              매물 상세 정보 보기
            </BaseButton>
          </div>
        </div>

        <div class="price-grid">
          <div class="price-card">
            <p class="price-label">매매가</p>
            <p class="price-value">{{ selectedProperty.dealAmount }}</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-card">
            <p class="info-label">전용면적</p>
            <p class="info-value">{{ selectedProperty.excluUseAr }}</p>
          </div>
          <div class="info-card">
            <p class="info-label">층수</p>
            <p class="info-value">{{ selectedProperty.floor }}</p>
          </div>
          <div class="info-card" v-if="selectedProperty.buildYear">
            <p class="info-label">건축년도</p>
            <p class="info-value">{{ selectedProperty.buildYear }}년</p>
          </div>
          <div class="info-card full-width">
            <p class="info-label">상세설명</p>
            <p class="description-text">
              {{ selectedProperty.description }}
            </p>
          </div>
        </div>

        <!-- Safety Check CTA -->
        <div class="safety-cta">
          <h3 class="cta-title">
            <ShieldCheck class="cta-icon" />
            이 매물, 안전할까요?
          </h3>
          <p class="cta-desc">
            등기부등본 AI 분석을 통해<br>전세 사기 위험도를 무료로 확인하세요.
          </p>
          <BaseButton @click="goToAnalysis" full-width class="cta-btn">
            안전도 분석 시작하기
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Map Area -->
    <div class="map-area">
      <KakaoMap 
        :markers="filteredProperties" 
        @select-marker="handleMarkerSelect" 
      />
      
      <!-- Floating Search Bar -->
      <div class="floating-search">
        <div class="search-container">
          <MarketFilter @search="handleSearch" @filter="handleFilter" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-page {
  flex: 1;
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
}

.property-sidebar {
  position: absolute;
  top: 6rem;
  left: 1rem;
  bottom: 1rem;
  width: 420px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 30;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .property-sidebar {
    top: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60vh;
    border-radius: 1.5rem 1.5rem 0 0;
    animation: slideInUp 0.3s ease-out;
    border-left: none;
    border-right: none;
    border-bottom: none;
  }
}

@keyframes slideInUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.sidebar-header {
  height: 16rem;
  background-color: var(--color-gray-200);
  position: relative;
  overflow: hidden;
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s;
}

.sidebar-header:hover .header-image {
  transform: scale(1.05);
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  color: var(--color-white);
  padding: 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.type-badge-wrapper {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.sidebar-content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.property-header {
  margin-bottom: 1.5rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
}

.property-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.compare-btn {
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.compare-btn--active {
  background-color: rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
  color: var(--color-primary);
}

.compare-btn--active:hover {
  background-color: rgba(144, 55, 73, 0.3); /* secondary-transparent30 */
}

.compare-btn--inactive {
  background-color: var(--color-gray-100);
  color: var(--color-gray-400);
}

.compare-btn--inactive:hover {
  background-color: var(--color-gray-200);
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.property-address {
  color: var(--color-gray-500);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.action-row {
  margin-top: 1rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.price-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--color-gray-50);
  border-radius: 0.75rem;
}

.price-card {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 0.25rem;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.fee-card {
  background-color: var(--color-gray-100);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
}

.fee-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.fee-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  padding: 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
}

.full-width {
  grid-column: span 2;
}

.info-card.full-width {
  grid-column: span 2;
}

.info-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.description-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-gray-600);
}

.safety-cta {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  padding: 1.5rem;
  border-radius: 1rem;
  color: var(--color-white);
  text-align: center;
}

.cta-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cta-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.cta-desc {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.cta-btn {
  background-color: var(--color-white) !important;
  color: var(--color-primary) !important;
  font-weight: 700;
  border: none;
}

.cta-btn:hover {
  background-color: var(--color-gray-100) !important;
}

.map-area {
  flex: 1;
  position: relative;
}

.floating-search {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: 90%;
  max-width: 600px;
}

.search-container {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 0.75rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
