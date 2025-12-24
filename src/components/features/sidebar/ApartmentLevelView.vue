<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainDataStore } from '@/stores/mainData'
import { useMarketStatsStore } from '@/stores/marketStats'
import { useAuthStore } from '@/stores/auth'
import { useMarket } from '@/composables/useMarket'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { Check, Plus, MessageSquare as ChatIcon } from 'lucide-vue-next'
import { formatPrice } from '@/utils/formatters'
import { addFavorite, removeFavoriteByAptSeq } from '@/api/favoriteApi'
import TrendGraph from './common/TrendGraph.vue'
import AIChatModal from '@/components/features/ai/AIChatModal.vue'
import AptRoadview from '@/components/features/apt/AptRoadview.vue'

const router = useRouter()
const store = useMainDataStore()
const statsStore = useMarketStatsStore()
const authStore = useAuthStore()
const { fetchPropertyDetail } = useMarket()
const { selectedProperty } = storeToRefs(store)
const { selectedPyung } = storeToRefs(statsStore)
const { isAuthenticated } = storeToRefs(authStore)
const { addToComparison, removeFromComparison, isInComparison } = store

// 관심 아파트 클릭 핸들러 (로그인 확인 + API 호출)
const handleFavoriteClick = async () => {
  if (!selectedProperty.value) return
  
  // 로그인 확인
  if (!isAuthenticated.value) {
    if (confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
      router.push('/login')
    }
    return
  }
  
  const apt = selectedProperty.value
  // 선택된 평수 사용 (statsStore의 selectedPyung)
  const pyung = selectedPyung.value ? Number(selectedPyung.value) : null
  
  try {
    if (isInComparison(apt.aptSeq)) {
      // 삭제
      await removeFavoriteByAptSeq(apt.aptSeq)
      removeFromComparison(apt.aptSeq)
    } else {
      // 추가
      await addFavorite({
        aptSeq: apt.aptSeq,
        aptName: apt.aptNm,
        address: apt.roadNm || '',
        pyung: pyung || 0,
        dealAmount: apt.dealAmount || '',
        latitude: Number(apt.latitude),
        longitude: Number(apt.longitude)
      })
      
      // 스토어에는 선택된 평수 정보를 담아서 추가
      addToComparison({
        ...apt,
        excluUseAr: pyung ? `${pyung}평` : apt.excluUseAr
      })
    }
  } catch (error: any) {
    alert(error.message || '관심 등록 중 오류가 발생했습니다.')
  }
}

// 현재 선택된 평형 (statsStore의 selectedPyung과 동기화)
const currentPyung = computed(() => selectedPyung.value || 'all')

// AI 채팅 모달 상태
const isChatModalOpen = ref(false)

const openChatModal = () => {
  isChatModalOpen.value = true
}

// 기간 선택 (3y, 6m)
const selectedPeriod = ref<'3y' | '6m'>('3y')

// 필터링된 가격 추이 데이터
const filteredPriceTrend = computed(() => {
  if (!selectedProperty.value?.priceTrend) return []
  
  if (selectedPeriod.value === '3y') {
    return selectedProperty.value.priceTrend
  } else {
    // 최근 6개월 데이터만 추출
    return selectedProperty.value.priceTrend.slice(-6)
  }
})

// 선택된 아파트나 평형이 변경되면 상세 정보 가져오기
watch([() => statsStore.selectedApartmentId, selectedPyung], async ([newId, newPyung], [oldId, oldPyung]) => {
  // ID가 없으면 리턴
  if (!newId) return

  // 1. ID가 바뀌었거나 평형이 바뀌었으면 상세 정보(가격, 그래프 등) 재요청
  if (newId !== oldId || newPyung !== oldPyung) {
    console.log(`ApartmentLevelView: 데이터 요청 (ID: ${newId}, 평형: ${newPyung})`)
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
      <AptRoadview 
        v-if="selectedProperty"
        :apt-seq="selectedProperty.aptSeq"
        :apt-nm="selectedProperty.aptNm"
        :address="selectedProperty.roadNm"
        :latitude="selectedProperty.latitude"
        :longitude="selectedProperty.longitude"
        height="16rem"
      />
    </div>

    <div class="sidebar-content">
      <div class="property-header">
        <div class="title-row">
          <h2 class="property-title">{{ selectedProperty.aptNm }}</h2>
          <button 
            @click="handleFavoriteClick"
            class="compare-btn"
            :class="isInComparison(selectedProperty.aptSeq) ? 'compare-btn--active' : 'compare-btn--inactive'"
            :title="isInComparison(selectedProperty.aptSeq) ? '관심 목록에서 제거' : '관심 목록에 추가'"
          >
            <component :is="isInComparison(selectedProperty.aptSeq) ? Check : Plus" class="icon-md" />
          </button>
        </div>

        <p class="property-address">
          <span class="mr-2">📍</span> {{ selectedProperty.roadNm }}
        </p>
        <div class="action-row gap-2 flex">
          <BaseButton variant="primary" @click="goToDetail" class="flex-1">
            실거래 상세 정보
          </BaseButton>
          <BaseButton variant="outline" @click="openChatModal" class="flex-1 ai-agent-btn">
            <ChatIcon class="icon-xs mr-1" />
            AI 에이전트
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
        <div class="chart-header">
          <h3 class="section-title">주요 시세</h3>
          <div class="period-tabs">
            <button 
              class="period-tab" 
              :class="{ active: selectedPeriod === '3y' }"
              @click="selectedPeriod = '3y'"
            >
              최근 3년
            </button>
            <button 
              class="period-tab" 
              :class="{ active: selectedPeriod === '6m' }"
              @click="selectedPeriod = '6m'"
            >
              6개월
            </button>
          </div>
        </div>
        <div class="chart-wrapper">
          <TrendGraph :data="filteredPriceTrend" :height="220" color="var(--color-primary)" />
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
      <!-- <div class="safety-cta">
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
      </div> -->
    </div>

    <!-- AI 채팅 모달 -->
    <AIChatModal 
      :is-open="isChatModalOpen" 
      :apartment-name="selectedProperty.aptNm"
      :area-code="selectedProperty.aptSeq"
      @close="isChatModalOpen = false"
    />
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
  background-color: var(--color-primary-transparent-30);
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
  display: flex;
  gap: 0.5rem;
}

.ai-agent-btn {
  border-color: var(--color-primary-transparent-30);
  color: var(--color-primary);
}

.ai-agent-btn:hover {
  background-color: var(--color-primary-soft);
}

.flex-1 {
  flex: 1;
}

.mr-1 {
  margin-right: 0.25rem;
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

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.period-tabs {
  display: flex;
  background-color: var(--color-gray-100);
  padding: 0.2rem;
  border-radius: 0.5rem;
}

.period-tab {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.4rem;
  border: none;
  background: none;
  color: var(--color-gray-500);
  cursor: pointer;
  transition: all 0.2s;
}

.period-tab.active {
  background-color: var(--color-white);
  color: var(--color-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
  height: 250px;
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
  background-color: var(--color-primary-light);
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

/* Image Loader Styles */
.image-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-100);
  z-index: 1;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.header-image.is-loading {
  opacity: 0;
}

/* Roadview & Media Toggle Styles */
.roadview-container {
  width: 100%;
  height: 100%;
}

.media-toggle {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  z-index: 10;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: translateY(-2px);
}

.icon-xs {
  width: 0.9rem;
  height: 0.9rem;
}
</style>
