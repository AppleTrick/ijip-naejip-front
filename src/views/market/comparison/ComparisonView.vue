<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore } from '@/stores/safehome'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { ArrowLeft, Trash2, Home, AlertCircle, Filter } from 'lucide-vue-next'

const router = useRouter()
const store = useSafeHomeStore()
const { myHouse, comparisonList } = storeToRefs(store)
const { removeFromComparison } = store

const sortOption = ref<string>('default')
const sortOptions = [
  { label: '기본순', value: 'default' },
  { label: '가격 낮은순', value: 'price_asc' },
  { label: '가격 높은순', value: 'price_desc' },
  { label: '면적 넓은순', value: 'area_desc' }
]

const goBack = () => {
  router.back()
}

const parsePrice = (priceStr: string | undefined): number => {
  if (!priceStr) return 0
  let total = 0
  const ukMatch = priceStr.match(/(\d+)억/)
  const manMatch = priceStr.match(/(\d+)만원/)
  
  if (ukMatch) total += parseInt(ukMatch[1]) * 10000
  if (manMatch) total += parseInt(manMatch[1])
  return total
}

const formatPriceDiff = (targetPrice: string, basePrice: string): string => {
  const diff = parsePrice(targetPrice) - parsePrice(basePrice)
  if (diff === 0) return '동일'
  const absDiff = Math.abs(diff)
  const uk = Math.floor(absDiff / 10000)
  const man = absDiff % 10000
  
  let result = ''
  if (uk > 0) result += `${uk}억 `
  if (man > 0) result += `${man}만원 `
  
  return `${diff > 0 ? '+' : '-'}${result}`
}

const parseArea = (areaStr: string | undefined): number => {
  if (!areaStr) return 0
  return parseInt(areaStr.replace('평', ''))
}

const formatAreaDiff = (targetArea: string, baseArea: string): string => {
  const diff = parseArea(targetArea) - parseArea(baseArea)
  if (diff === 0) return '동일'
  return `${diff > 0 ? '+' : ''}${diff}평`
}

const sortedComparisonList = computed(() => {
  let list = [...comparisonList.value]
  
  // Filter logic would go here
  
  // Sort logic
  switch (sortOption.value) {
    case 'price_asc':
      list.sort((a, b) => parsePrice(a.dealAmount) - parsePrice(b.dealAmount))
      break
    case 'price_desc':
      list.sort((a, b) => parsePrice(b.dealAmount) - parsePrice(a.dealAmount))
      break
    case 'area_desc':
      list.sort((a, b) => parseArea(b.excluUseAr) - parseArea(a.excluUseAr))
      break
  }
  
  return list
})
</script>

<template>
  <div class="comparison-page">
    <div class="content-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button @click="goBack" class="back-btn">
            <ArrowLeft class="icon-md" />
          </button>
          <div>
            <h1 class="page-title">집 비교하기</h1>
            <p class="page-subtitle">내 집과 관심 매물을 한눈에 비교해보세요.</p>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <!-- Left Sidebar (Filters) -->
        <div class="filters-sidebar">
          <div class="filter-card">
            <div class="filter-header">
              <Filter class="filter-icon" />
              <h3 class="filter-title">필터링 기준</h3>
            </div>
            
            <!-- Mock Filters -->
            <div class="filter-content">
              <div class="filter-group">
                <label class="filter-label">가격 범위</label>
                <div class="range-wrapper">
                  <input type="range" class="range-input" min="0" max="20" step="1">
                </div>
                <div class="range-labels">
                  <span>최소</span>
                  <span>최대</span>
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">면적</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-text">20평대</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-text">30평대</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-text">40평대 이상</span>
                  </label>
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">층수</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-text">1층</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-text">저층 (2~5층)</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-text">고층 (6층 이상)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="comparison-content">
          <!-- Sort Header -->
          <div class="sort-header">
            <span class="count-text">총 <span class="count-number">{{ comparisonList.length + (myHouse ? 1 : 0) }}</span>개의 매물 비교</span>
            <div class="sort-select-wrapper">
              <BaseSelect v-model="sortOption" :options="sortOptions" placeholder="정렬 기준" />
            </div>
          </div>

          <div class="comparison-list">
            <!-- My House Card (Top) -->
            <div v-if="myHouse" class="property-card-wrapper">
              <div class="property-card my-house-card">
                <div class="my-house-badge">
                  내 집 (기준)
                </div>
                
                <div class="card-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                       alt="My House" class="card-image" />
                </div>

                <div class="card-details">
                  <div class="details-header">
                    <div>
                      <h3 class="property-name">{{ myHouse.aptNm }}</h3>
                      <p class="property-address">{{ myHouse.roadNm }}</p>
                    </div>
                    <BaseButton @click="router.push('/settings/house')" size="sm" variant="outline">
                      수정
                    </BaseButton>
                  </div>

                  <div class="stats-grid">
                    <div class="stat-item">
                      <p class="stat-label">매매가</p>
                      <p class="stat-value">{{ myHouse.dealAmount }}</p>
                    </div>
                    <div class="stat-item">
                      <p class="stat-label">면적</p>
                      <p class="stat-value">{{ myHouse.excluUseAr }}</p>
                    </div>
                    <div class="stat-item">
                      <p class="stat-label">층수</p>
                      <p class="stat-value">{{ myHouse.floor }}</p>
                    </div>
                    <div class="stat-item" v-if="myHouse.buildYear">
                      <p class="stat-label">건축년도</p>
                      <p class="stat-value">{{ myHouse.buildYear }}년</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State for My House -->
            <div v-else class="empty-my-house">
              <Home class="empty-icon" />
              <p class="empty-text">내 집을 등록하면 비교가 더 쉬워집니다.</p>
              <BaseButton @click="router.push('/settings/house')" size="sm">내 집 등록하기</BaseButton>
            </div>

            <!-- Comparison List -->
            <div v-if="sortedComparisonList.length > 0" class="comparison-items">
              <div v-for="property in sortedComparisonList" :key="property.aptSeq" class="property-card-wrapper">
                <div class="property-card">
                  <button @click="removeFromComparison(property.aptSeq)" 
                          class="remove-btn">
                    <Trash2 class="icon-sm" />
                  </button>
                  
                  <div class="card-image-wrapper">
                    <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                         alt="Property" class="card-image" />
                  </div>

                  <div class="card-details">
                    <div class="details-header">
                      <div>
                        <h3 class="property-name">{{ property.aptNm }}</h3>
                        <p class="property-address">{{ property.roadNm }}</p>
                      </div>
                    </div>

                    <div class="stats-grid mb-4">
                      <!-- Price Comparison -->
                      <div class="stat-item highlight-bg">
                        <p class="stat-label">매매가</p>
                        <p class="stat-value">{{ property.dealAmount }}</p>
                        <div v-if="myHouse" class="diff-text" 
                             :class="parsePrice(property.dealAmount) > parsePrice(myHouse.dealAmount) ? 'text-red' : parsePrice(property.dealAmount) < parsePrice(myHouse.dealAmount) ? 'text-blue' : 'text-gray'">
                          {{ formatPriceDiff(property.dealAmount, myHouse.dealAmount) }}
                        </div>
                      </div>

                      <!-- Area Comparison -->
                      <div class="stat-item highlight-bg">
                        <p class="stat-label">면적</p>
                        <p class="stat-value">{{ property.excluUseAr }}</p>
                        <div v-if="myHouse" class="diff-text"
                             :class="parseArea(property.excluUseAr) > parseArea(myHouse.excluUseAr) ? 'text-blue' : parseArea(property.excluUseAr) < parseArea(myHouse.excluUseAr) ? 'text-red' : 'text-gray'">
                          {{ formatAreaDiff(property.excluUseAr, myHouse.excluUseAr) }}
                        </div>
                      </div>

                      <div class="stat-item highlight-bg">
                        <p class="stat-label">층수</p>
                        <p class="stat-value">{{ property.floor }}</p>
                      </div>

                      <div class="stat-item highlight-bg" v-if="property.buildYear">
                        <p class="stat-label">건축년도</p>
                        <p class="stat-value">{{ property.buildYear }}년</p>
                        <div v-if="myHouse && myHouse.buildYear" class="diff-text"
                             :class="property.buildYear > myHouse.buildYear ? 'text-blue' : property.buildYear < myHouse.buildYear ? 'text-red' : 'text-gray'">
                          {{ property.buildYear - myHouse.buildYear === 0 ? '동일' : (property.buildYear - myHouse.buildYear > 0 ? '+' : '') + (property.buildYear - myHouse.buildYear) + '년' }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="card-footer">
                      <BaseButton variant="outline" size="sm" @click="router.push('/map')">
                        지도에서 보기
                      </BaseButton>
                      <BaseButton variant="primary" size="sm" @click="router.push(`/price/${property.aptSeq}`)">
                        상세 정보
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State for Comparison List -->
            <div v-else class="empty-comparison">
              <div class="empty-content">
                <div class="empty-icon-wrapper">
                  <AlertCircle class="empty-icon-lg" />
                </div>
                <h3 class="empty-title">비교할 매물이 없어요</h3>
                <p class="empty-subtitle">지도에서 관심있는 매물을 담아보세요.</p>
                <BaseButton @click="router.push('/map')" size="sm">
                  매물 보러가기
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comparison-page {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 2rem 1rem;
}

@media (min-width: 640px) {
  .comparison-page {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .comparison-page {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.content-container {
  max-width: 80rem; /* max-w-7xl */
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-btn {
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
  border: none;
  background: none;
  cursor: pointer;
}

.back-btn:hover {
  background-color: var(--color-gray-200);
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-gray-600);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.page-subtitle {
  color: var(--color-gray-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.main-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-layout {
    flex-direction: row;
  }
}

.filters-sidebar {
  width: 100%;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .filters-sidebar {
    width: 16rem; /* w-64 */
  }
}

.filter-card {
  background-color: var(--color-white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-gray-200);
}

.filter-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary);
  margin-right: 0.5rem;
}

.filter-title {
  font-weight: 700;
  color: var(--color-text);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

.range-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  width: 100%;
  accent-color: var(--color-primary);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin-top: 0.25rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  border-radius: 0.25rem;
  color: var(--color-primary);
  border-color: var(--color-gray-300);
}

.checkbox-input:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.checkbox-text {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

.comparison-content {
  flex: 1;
}

.sort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.count-text {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.count-number {
  font-weight: 700;
  color: var(--color-text);
}

.sort-select-wrapper {
  width: 10rem;
}

.comparison-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.property-card-wrapper {
  width: 100%;
}

.property-card {
  background-color: var(--color-white);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 0.2s;
}

.property-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .property-card {
    flex-direction: row;
  }
}

.my-house-card {
  background-color: rgba(144, 55, 73, 0.1); /* secondary/10 */
  border: 2px solid var(--color-primary);
}

.my-house-badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-secondary);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-bottom-right-radius: 0.5rem;
  z-index: 10;
}

.card-image-wrapper {
  height: 12rem;
  background-color: var(--color-gray-200);
  position: relative;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .card-image-wrapper {
    height: auto;
    width: 16rem;
  }
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge-wrapper {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
}

.type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: 700;
}

.card-details {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.property-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.property-address {
  color: var(--color-gray-500);
  font-size: 0.875rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-item {
  background-color: var(--color-white);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
}

.highlight-bg {
  background-color: var(--color-gray-50);
  border: none;
  position: relative;
  overflow: hidden;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

.stat-value {
  font-weight: 700;
  color: var(--color-text);
}

.diff-text {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.text-red { color: #ef4444; }
.text-blue { color: #3b82f6; }
.text-gray { color: var(--color-gray-400); }

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 9999px;
  transition: all 0.2s;
  z-index: 10;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: #fef2f2; /* red-50 */
  color: #ef4444; /* red-500 */
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.empty-my-house {
  background-color: var(--color-white);
  border-radius: 1rem;
  border: 2px dashed var(--color-gray-300);
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-gray-300);
  margin: 0 auto 0.75rem;
}

.empty-text {
  color: var(--color-gray-500);
  font-weight: 500;
  margin-bottom: 1rem;
}

.comparison-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white);
  border-radius: 1rem;
  border: 2px dashed var(--color-gray-300);
  min-height: 200px;
}

.empty-content {
  text-align: center;
}

.empty-icon-wrapper {
  width: 3rem;
  height: 3rem;
  background-color: var(--color-gray-100);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.empty-icon-lg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-gray-400);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.empty-subtitle {
  color: var(--color-gray-500);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>

