<script setup lang="ts">
import { watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import { useMarket } from '@/composables/useMarket'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { ShieldCheck, Check, Plus, ArrowLeft } from 'lucide-vue-next'
import { formatPrice } from '@/utils/formatters'
import TrendGraph from './common/TrendGraph.vue'

const router = useRouter()
const store = useMainDataStore()
const statsStore = useMarketStatsStore()
const { fetchPropertyDetail } = useMarket()
const { selectedProperty } = storeToRefs(store)
const { selectedPyung } = storeToRefs(statsStore)
const { addToComparison, removeFromComparison, isInComparison } = store
const { goBack } = statsStore

// 현재 선택된 평형 (statsStore의 selectedPyung과 동기화)
const currentPyung = computed(() => selectedPyung.value || 'all')

// 선택된 아파트가 변경되면 상세 정보 가져오기
// 선택된 아파트나 평형이 변경되면 상세 정보 가져오기
watch([() => selectedProperty.value?.aptSeq, selectedPyung], async ([newId, newPyung], [oldId, oldPyung]) => {
  // ID가 없으면 리턴
  if (!newId) return

  // ID가 바뀌었거나, 같은 ID인데 평형이 바뀌었을 때만 재요청
  // (이전 ID와 같고 평형도 같으면 요청 안 함 -> 초기 진입 등 방어)
  if (newId !== oldId || newPyung !== oldPyung) {
    await fetchPropertyDetail(newId)
  }
}, { immediate: true })

// 평형 선택 핸들러
const handlePyungSelect = (pyung: string) => {
  if (!selectedProperty.value) return
  statsStore.selectApartment(selectedProperty.value.aptSeq, pyung)
  // watcher가 변경을 감지하여 데이터를 가져오므로 여기서는 호출하지 않음
}

// 선택된 평형에 따른 표시 가격
const displayPrice = computed(() => {
  return selectedProperty.value?.dealAmount || '0억'
})

const goToAnalysis = () => {
  router.push('/analysis')
}

const goToDetail = () => {
  if (selectedProperty.value) {
    router.push(`/price/${selectedProperty.value.aptSeq}`)
  }
}

const formatDate = (dateNum: number) => {
  if (!dateNum) return '-'
  const str = String(dateNum)
  if (str.length !== 8) return str
  return `${str.substring(0, 4)}.${str.substring(4, 6)}.${str.substring(6, 8)}`
}

</script>

<template>
  <div v-if="selectedProperty" class="apartment-view">
    <div class="sidebar-header">
      <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
           alt="Property" class="header-image">
      <div class="header-overlay"></div>
      <button @click="goBack" class="back-btn">
        <ArrowLeft class="icon-sm" />
      </button>
    </div>

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
            아파트 실거래 상세 정보 보기
          </BaseButton>
        </div>
      </div>

      <!-- 평형 선택하는 카드 -->
      <div class="pyung-selector-container">
        <div class="pyung-selector-scroll">
          <button 
            class="pyung-tab"
            :class="{ 'pyung-tab--active': currentPyung === 'all' }"
            @click="handlePyungSelect('all')"
          >
            전체
          </button>
          <button 
            v-for="pyung in selectedProperty.pyungList" 
            :key="pyung" 
            class="pyung-tab"
            :class="{ 'pyung-tab--active': currentPyung === pyung }"
            @click="handlePyungSelect(pyung)"
          >
            {{ pyung }}평
          </button>
        </div>
      </div>

      <div class="price-grid">
        <div class="price-card">
          <p class="price-label">아파트 대표 가격</p>
          <p class="price-value">{{ displayPrice }}</p>
        </div>
      </div>

      <!-- Price Trend Graph -->
      <div v-if="selectedProperty.priceTrend && selectedProperty.priceTrend.length > 0" class="chart-section">
        <h3 class="section-title">가격 추이</h3>
        <div class="chart-wrapper">
          <TrendGraph :data="selectedProperty.priceTrend" :height="150" color="var(--color-primary)" />
        </div>
      </div>

      <!-- Info Grid -->
      <div class="info-grid">
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

      <!-- Recent Transactions -->
      <div v-if="selectedProperty.deals && selectedProperty.deals.length > 0" class="deals-section">
        <h3 class="section-title">최근 실거래 내역</h3>
        <div class="deals-list">
          <div v-for="(deal, index) in selectedProperty.deals" :key="index" class="deal-item">
            <div class="deal-date">{{ formatDate(deal.dealDate) }}</div>
            <div class="deal-info">
              <span class="deal-floor">{{ deal.floor }}층</span>
              <span class="deal-area">{{ deal.excluUseAr }}평</span>
            </div>
            <div class="deal-price">{{ formatPrice(deal.dealAmount) }}</div>
          </div>
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
</template>

<style scoped>
.apartment-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  height: 16rem;
  background-color: var(--color-gray-200);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
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

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
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

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.sidebar-content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* Crucial for nested flex scrolling */
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
  background-color: var(--color-primary-transparent-20);
  color: var(--color-primary);
}

.compare-btn--active:hover {
  background-color: rgba(144, 55, 73, 0.3);
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
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
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
  border-radius: 1.25rem;
  color: var(--color-white);
  text-align: center;
  box-shadow: var(--glass-shadow);
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

.deals-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.deals-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.deal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
}

.deal-date {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.deal-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-700);
}

.deal-price {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1rem;
}

.chart-section {
  margin-bottom: 2rem;
}

.chart-wrapper {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
  height: 180px;
}

.pyung-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pyung-tag {
  padding: 0.25rem 0.6rem;
  font-size: 0.85rem;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pyung-tag:hover {
  background-color: var(--color-primary-light, rgba(144, 55, 73, 0.1));
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.pyung-selector-container {
  margin-bottom: 1.5rem;
  overflow: hidden; /* Hide scrollbar for container */
}

.pyung-selector-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem; /* Space for scrollbar if visible */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.pyung-selector-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.pyung-tab {
  flex: 0 0 auto; /* Don't shrink */
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.2s;
}

.pyung-tab:hover {
  background-color: var(--color-gray-50);
  border-color: var(--color-gray-300);
}

.pyung-tab--active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  font-weight: 700;
}

.pyung-tab--active:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  opacity: 0.9;
}
</style>
