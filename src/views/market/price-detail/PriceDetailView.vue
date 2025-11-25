<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import PriceChart from './components/PriceChart.vue'
import { ArrowLeft, MapPin, TrendingUp, Calendar } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const propertyId = route.params.id

// Mock Data
const property = ref({
  id: propertyId,
  name: '반포 자이',
  address: '서울시 서초구 반포동 20-45',
  price: '35억',
  area: '34평',
  floor: '15층',
  type: '아파트',
  description: '한강뷰가 보이는 로얄층 매물입니다. 최근 올수리 완료되어 즉시 입주 가능합니다.',
  transactions: [
    { date: '2023.10', price: '34억 5000' },
    { date: '2023.08', price: '33억 8000' },
    { date: '2023.05', price: '33억' },
    { date: '2023.01', price: '31억 5000' },
    { date: '2022.11', price: '32억' }
  ]
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="price-detail-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          <ArrowLeft class="icon" />
        </button>
        <h1 class="page-title">매물 상세 정보</h1>
        <div class="placeholder"></div>
      </div>

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Image & Basic Info -->
        <div class="info-section">
          <div class="image-wrapper">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Property" class="property-image" />
            <span class="type-badge">{{ property.type }}</span>
          </div>
          
          <div class="basic-info">
            <h2 class="property-name">{{ property.name }}</h2>
            <p class="property-address">
              <MapPin class="icon-sm" /> {{ property.address }}
            </p>
            <p class="property-price">{{ property.price }}</p>
            
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-label">면적</span>
                <span class="spec-value">{{ property.area }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">층수</span>
                <span class="spec-value">{{ property.floor }}</span>
              </div>
            </div>

            <p class="description">{{ property.description }}</p>

            <div class="actions">
              <BaseButton full-width variant="primary">상담 신청하기</BaseButton>
              <BaseButton full-width variant="outline">관심 매물 등록</BaseButton>
            </div>
          </div>
        </div>

        <!-- Transaction History -->
        <div class="history-section">
          <h3 class="section-title">
            <TrendingUp class="icon-md" /> 실거래가 추이
          </h3>
          
          <!-- Graph Placeholder -->
          <div class="graph-container">
            <PriceChart :data="property.transactions" />
          </div>

          <!-- Transaction List -->
          <div class="transaction-list">
            <h4 class="list-title">최근 거래 내역</h4>
            <div class="list-header">
              <span>계약일</span>
              <span>거래금액</span>
            </div>
            <div v-for="(t, i) in property.transactions" :key="i" class="list-item">
              <span class="date"><Calendar class="icon-xs" /> {{ t.date }}</span>
              <span class="price">{{ t.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.price-detail-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 2rem 1rem;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: var(--color-gray-100);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.placeholder {
  width: 2.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Info Section */
.info-section {
  background-color: var(--color-white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  height: 20rem;
  position: relative;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.basic-info {
  padding: 2rem;
}

.property-name {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.property-address {
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.property-price {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 2rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-gray-50);
  border-radius: 1rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spec-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.spec-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.description {
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

/* History Section */
.history-section {
  background-color: var(--color-white);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary);
}

.graph-container {
  height: 15rem;
  background-color: var(--color-gray-50);
  border-radius: 1rem;
  margin-bottom: 2rem;
  position: relative;
  padding: 1rem;
}

.mock-graph {
  width: 100%;
  height: 100%;
  position: relative;
}

.graph-line {
  position: absolute;
  bottom: 20%;
  left: 0;
  width: 100%;
  height: 60%;
  border-bottom: 2px dashed var(--color-primary);
}

.point {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--color-primary);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.point-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-text);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
}

.transaction-list {
  border-top: 1px solid var(--color-gray-200);
  padding-top: 2rem;
}

.list-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: var(--color-gray-100);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--color-gray-100);
}

.date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-light);
}

.icon-xs {
  width: 0.875rem;
  height: 0.875rem;
}

.price {
  font-weight: 700;
  color: var(--color-text);
}
</style>
