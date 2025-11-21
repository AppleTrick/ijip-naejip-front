<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore, type Property } from '../stores/safehome'
import KakaoMap from '../components/features/KakaoMap.vue'
import MarketFilter from '../components/features/MarketFilter.vue'
import BaseButton from '../components/common/BaseButton.vue'
import { ShieldCheck, X, Check, Plus } from 'lucide-vue-next'

const router = useRouter()
const store = useSafeHomeStore()
const { selectedProperty, filteredProperties } = storeToRefs(store)
const { selectProperty, setMarketProperties, setSearchQuery, addToComparison, removeFromComparison, isInComparison } = store

// Mock Data Generation (Moved from App.vue)
const generateMockData = () => {
  const districts = [
    { name: '강남구', lat: 37.5172, lng: 127.0473 },
    { name: '서초구', lat: 37.4837, lng: 127.0324 },
    { name: '송파구', lat: 37.5145, lng: 127.1066 },
    { name: '마포구', lat: 37.5665, lng: 126.9018 },
    { name: '용산구', lat: 37.5326, lng: 126.9900 },
    { name: '성동구', lat: 37.5633, lng: 127.0371 },
    { name: '영등포구', lat: 37.5264, lng: 126.8962 },
    { name: '종로구', lat: 37.5730, lng: 126.9794 }
  ]

  const types = ['APT', 'OPST', 'VILLA']
  const properties: Property[] = []

  districts.forEach(district => {
    for (let i = 0; i < 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const price = Math.floor(Math.random() * 150000) + 10000 // 1억 ~ 16억
      const deposit = Math.floor(price * (Math.random() * 0.4 + 0.5)) // 매매가의 50~90%

      properties.push({
        id: `${district.name}-${i}`,
        name: `${district.name} ${type} ${i + 1}호`,
        type: type === 'APT' ? '아파트' : type === 'OPST' ? '오피스텔' : '빌라',
        price: `${Math.floor(price / 10000)}억 ${price % 10000 > 0 ? (price % 10000) + '만원' : ''}`,
        deposit: `${Math.floor(deposit / 10000)}억 ${deposit % 10000 > 0 ? (deposit % 10000) + '만원' : ''}`,
        lat: district.lat + (Math.random() - 0.5) * 0.04,
        lng: district.lng + (Math.random() - 0.5) * 0.04,
        address: `서울시 ${district.name} 역삼동 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 100) + 1}`,
        area: `${Math.floor(Math.random() * 50) + 20}평`,
        floor: `${Math.floor(Math.random() * 20) + 1}층`,
        maintenanceFee: `${Math.floor(Math.random() * 20) + 5}만원`,
        description: '역세권, 채광 좋음, 풀옵션, 주차 가능, 즉시 입주 가능. 신혼부부 추천 매물입니다.',
        safetyScore: Math.floor(Math.random() * 100)
      })
    }
  })
  return properties
}

onMounted(() => {
  if (store.marketProperties.length === 0) {
    setMarketProperties(generateMockData())
  }
})

const handleSearch = (query: string) => {
  setSearchQuery(query)
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
        <div class="type-badge-wrapper">
          <span class="type-badge">{{ selectedProperty.type }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="sidebar-content">
        <div class="property-header">
          <div class="title-row">
            <h2 class="property-title">{{ selectedProperty.name }}</h2>
            <button 
              @click="isInComparison(selectedProperty.id) ? removeFromComparison(selectedProperty.id) : addToComparison(selectedProperty)"
              class="compare-btn"
              :class="isInComparison(selectedProperty.id) ? 'compare-btn--active' : 'compare-btn--inactive'"
              :title="isInComparison(selectedProperty.id) ? '비교함에서 제거' : '비교함에 추가'"
            >
              <component :is="isInComparison(selectedProperty.id) ? Check : Plus" class="icon-md" />
            </button>
          </div>
          <p class="property-address">
            <span class="mr-2">📍</span> {{ selectedProperty.address }}
          </p>
        </div>

        <div class="price-grid">
          <div class="price-card">
            <p class="price-label">매매가</p>
            <p class="price-value">{{ selectedProperty.price }}</p>
          </div>
          <div class="fee-card">
            <p class="fee-label">관리비</p>
            <p class="fee-value">{{ selectedProperty.maintenanceFee }}</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-card">
            <p class="info-label">공급/전용면적</p>
            <p class="info-value">{{ selectedProperty.area }}</p>
          </div>
          <div class="info-card">
            <p class="info-label">해당층/총층</p>
            <p class="info-value">{{ selectedProperty.floor }}</p>
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
          <MarketFilter @search="handleSearch" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-page {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  height: 100%;
}

.property-sidebar {
  position: absolute;
  top: 6rem;
  left: 1rem;
  bottom: 1rem;
  width: calc(100% - 2rem);
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

@media (min-width: 768px) {
  .property-sidebar {
    width: 420px;
  }
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
  color: var(--color-primary);
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
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.price-card {
  background: linear-gradient(to bottom right, rgba(232, 69, 69, 0.1), rgba(144, 55, 73, 0.1));
  padding: 1.25rem;
  border-radius: 1rem;
  border: 2px solid rgba(232, 69, 69, 0.3); /* primary-transparent30 */
}

.price-label {
  font-size: 0.875rem;
  color: var(--color-secondary);
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.price-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.025em;
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
  background-color: var(--color-gray-100);
  border-radius: 0.75rem;
  border: 1px solid rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
}

.full-width {
  grid-column: span 2;
}

.info-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 700;
  color: var(--color-primary);
}

.description-text {
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.625;
  background-color: var(--color-white);
  padding: 1rem;
  border-radius: 0.75rem;
}

.safety-cta {
  background: linear-gradient(to bottom right, rgba(232, 69, 69, 0.1), rgba(144, 55, 73, 0.1));
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid rgba(144, 55, 73, 0.3); /* secondary-transparent30 */
  margin-bottom: 1.5rem;
}

.cta-title {
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
}

.cta-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  color: var(--color-primary);
}

.cta-desc {
  font-size: 0.875rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.625;
}

.cta-btn {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.map-area {
  flex: 1;
  position: relative;
  height: 100%;
}

.floating-search {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 20;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.search-container {
  width: 100%;
  max-width: 42rem;
  pointer-events: auto;
}
</style>
