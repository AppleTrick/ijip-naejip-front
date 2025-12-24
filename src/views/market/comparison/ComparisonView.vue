<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainDataStore } from '@/stores/mainData'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { Trash2, AlertCircle, Loader2 } from 'lucide-vue-next'
import http from '@/api/http'
import { getFavorites, removeFavoriteByAptSeq } from '@/api/favoriteApi'
import AptRoadview from '@/components/features/apt/AptRoadview.vue'
import { useMapNavigation } from '@/composables/useMapNavigation'

const router = useRouter()
const store = useMainDataStore()
const authStore = useAuthStore()
const { myHouse, comparisonList } = storeToRefs(store)
const { isAuthenticated } = storeToRefs(authStore)
const { removeFromComparison } = store
const { moveToMap } = useMapNavigation()

// DB 기반 관심 아파트 목록
const favoritesFromDB = ref<any[]>([])

// 관심 목록 로드 함수
const loadFavorites = async () => {
  try {
    const favorites = await getFavorites()
    favoritesFromDB.value = favorites
    
    // 스토어의 comparisonList 동기화 (새로고침 시에도 AI 분석 데이터로 활용하기 위함)
    if (favorites && favorites.length > 0) {
      // 이미 스토어에 데이터가 있으면 중복 추가 방지
      favorites.forEach(fav => {
        const isInStore = store.isInComparison(fav.aptSeq)
        const currentProp = store.comparisonList.find(p => p.aptSeq === fav.aptSeq)
        
        // 스토어에 데이터가 없거나, 데이터는 있지만 면적이 목록 형태(쉼표 포함)인 경우 업데이트
        const needsUpdate = !isInStore || (currentProp && currentProp.excluUseAr.includes(','))
        
        if (needsUpdate) {
          store.addToComparison({
            aptSeq: fav.aptSeq,
            aptNm: fav.aptName,
            roadNm: fav.address,
            dealAmount: fav.dealAmount || '',
            excluUseAr: fav.pyung ? `${fav.pyung}평` : '',
            latitude: Number(fav.latitude) || 0,
            longitude: Number(fav.longitude) || 0,
            description: '',
            buildYear: fav.buildYear || 0,
            floor: ''
          })
        }
      })
    }
  } catch (error) {
    console.error('관심 목록 로드 실패:', error)
  }
}

// 페이지 로드 시 관심 목록 로드 (새로고침 대응)
onMounted(async () => {
  // 1. 인증 초기화 대기 (새로고침 시 토큰에서 사용자 정보 복원)
  const { checkAuth, isAuthInitialized } = authStore
  if (!isAuthInitialized) {
    await checkAuth()
  }
  
  // 2. 로그인 상태면 DB에서 관심 목록 로드
  if (isAuthenticated.value) {
    await loadFavorites()
  }
})

// DB에서 삭제
const handleRemoveFavorite = async (aptSeq: string) => {
  try {
    await removeFavoriteByAptSeq(aptSeq)
    favoritesFromDB.value = favoritesFromDB.value.filter(f => f.aptSeq !== aptSeq)
    removeFromComparison(aptSeq)
  } catch (error) {
    console.error('삭제 실패:', error)
  }
}


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
  const numOnly = priceStr.replace(/[^\d]/g, '')
  if (numOnly && !priceStr.includes('억')) {
    return parseInt(numOnly)
  }
  let total = 0
  const ukMatch = priceStr.match(/(\d+)억/)
  const manMatch = priceStr.match(/(\d+)만원/)
  if (ukMatch) total += parseInt(ukMatch[1]) * 10000
  if (manMatch) total += parseInt(manMatch[1])
  return total
}

const parseArea = (areaStr: string | number | undefined): number => {
  if (!areaStr) return 0
  if (typeof areaStr === 'number') return areaStr
  const match = areaStr.match(/(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : 0
}

// 평당가 계산 (만원 단위)
const calculatePricePerPyeong = (priceStr: string | undefined, areaStr: string | number | undefined): string => {
  const price = parsePrice(priceStr)
  const area = parseArea(areaStr)
  if (price <= 0 || area <= 0) return '0'
  return Math.floor(price / area).toLocaleString()
}

// 건축 연차 계산
const calculateBuildingAge = (buildYear: number | undefined): string => {
  if (!buildYear) return ''
  const currentYear = new Date().getFullYear()
  const age = currentYear - buildYear
  return age <= 0 ? '신축' : `${age}년차`
}


// 가격을 X.X억 형식으로 포맷
const formatPriceDisplay = (priceStr: string | undefined): string => {
  if (!priceStr) return '-'
  
  // 이미 억 형식이면 그대로 반환
  if (priceStr.includes('억')) return priceStr
  
  // 숫자만 있는 경우 (만원 단위)
  const price = parseInt(priceStr.replace(/[^\d]/g, ''))
  if (isNaN(price) || price === 0) return '-'
  
  const uk = Math.floor(price / 10000)
  const man = price % 10000
  
  if (uk > 0 && man > 0) {
    return `${uk}억 ${man}만원`
  } else if (uk > 0) {
    return `${uk}억`
  } else {
    return `${man}만원`
  }
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

const formatAreaDiff = (targetArea: string | number | undefined, baseArea: string | number | undefined): string => {
  const diff = parseArea(targetArea) - parseArea(baseArea)
  if (diff === 0) return '동일'
  return `${diff > 0 ? '+' : ''}${diff}평`
}

const sortedComparisonList = computed(() => {
  // 스토어의 comparisonList를 기준으로 정렬 (이미 loadFavorites에서 동기화됨)
  let list = [...comparisonList.value]
  
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

// 총 비교 개수 (backend 기반 favoritesFromDB가 있으면 우선 사용하거나 store와 합산 로직)
const totalComparisonCount = computed(() => {
  return comparisonList.value.length + (myHouse.value ? 1 : 0)
})

const aiSummary = ref<string | null>(null)
const isGeneratingSummary = ref(false)

const getAISummary = async () => {
  const dataToCompare = comparisonList.value
  
  if (dataToCompare.length === 0 && !myHouse.value) return
  
  isGeneratingSummary.value = true
  try {
    const response = await http.post('/api/v1/ai/comparison-summary', {
      myHouse: myHouse.value,
      comparisonList: dataToCompare
    })
    aiSummary.value = response.data.data
  } catch (error) {
    console.error('AI Summary Error:', error)
  } finally {
    isGeneratingSummary.value = false
  }
}
</script>

<template>
  <div class="comparison-page">
    <!-- 비로그인 시 로그인 안내 -->
    <div v-if="!isAuthenticated" class="login-required">
      <div class="login-required-card">
        <AlertCircle class="login-icon" />
        <h2>로그인이 필요합니다</h2>
        <p>관심 아파트 기능은 로그인 이후 이용 가능합니다.</p>
        <BaseButton variant="primary" @click="router.push('/login')">
          로그인하기
        </BaseButton>
      </div>
    </div>

    <!-- 로그인 시 메인 컨텐츠 -->
    <div v-else class="content-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button @click="goBack" class="back-btn">
            <ArrowLeft class="icon-md" />
          </button>
          <div>
            <h1 class="page-title">관심 아파트</h1>
            <p class="page-subtitle">내 집과 관심 아파트를 한눈에 비교해보세요.</p>
          </div>
        </div>
      </div>

      <div class="main-layout">

        <!-- Main Content -->
        <div class="comparison-content">
          <!-- AI Summary Section -->
          <div class="ai-summary-card mb-6">
            <div class="summary-header">
              <div class="summary-title">
                <span class="sparkle-icon">✨</span>
                <h3>AI 아파트 비교 요약</h3>
              </div>
              <BaseButton 
                variant="primary" 
                size="sm" 
                :disabled="isGeneratingSummary || totalComparisonCount === 0"
                @click="getAISummary"
              >
                <Loader2 v-if="isGeneratingSummary" class="spin-icon mr-1" />
                {{ aiSummary ? '다시 분석하기' : 'AI 분석 시작' }}
              </BaseButton>
            </div>
            
            <div v-if="aiSummary" class="summary-content">
              <p class="summary-text">{{ aiSummary }}</p>
            </div>
            <div v-else-if="!isGeneratingSummary" class="summary-placeholder">
              <p>선택하신 아파트들의 특징을 AI가 분석하여 최적의 선택을 도와드립니다.</p>
            </div>
            <div v-else class="summary-loading">
              <div class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
              <p>아파트 정보를 분석하고 있습니다...</p>
            </div>
          </div>

          <!-- Sort Header -->
          <div class="sort-header">
            <span class="count-text">총 <span class="count-number">{{ totalComparisonCount }}</span>개의 아파트 비교</span>
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
                  <AptRoadview 
                    :apt-seq="'my-house'"
                    :apt-nm="myHouse.aptNm"
                    :address="myHouse.roadNm"
                    height="100%"
                  />
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
                      <p class="stat-value text-primary">{{ myHouse.dealAmount }}</p>
                    </div>
                    <div class="stat-item">
                      <p class="stat-label">면적</p>
                      <p class="stat-value">{{ myHouse.excluUseAr }}</p>
                    </div>
                    <div class="stat-item">
                      <p class="stat-label">평당가</p>
                      <p class="stat-value">{{ calculatePricePerPyeong(myHouse.dealAmount, myHouse.excluUseAr) }}만</p>
                    </div>
                    <div class="stat-item" v-if="myHouse.buildYear">
                      <p class="stat-label">건축년도</p>
                      <p class="stat-value">{{ myHouse.buildYear }}년 <span class="age-text">({{ calculateBuildingAge(myHouse.buildYear) }})</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comparison List -->
            <div v-if="sortedComparisonList.length > 0" class="comparison-items">
              <div v-for="property in sortedComparisonList" :key="property.aptSeq" class="property-card-wrapper">
                <div class="property-card">
                  <button @click="handleRemoveFavorite(property.aptSeq)" 
                          class="remove-btn">
                    <Trash2 class="icon-sm" />
                  </button>
                  
                  <div class="card-image-wrapper">
                    <AptRoadview 
                      :apt-seq="property.aptSeq"
                      :apt-nm="property.aptNm"
                      :address="property.roadNm"
                      :latitude="property.latitude"
                      :longitude="property.longitude"
                      height="100%"
                    />
                  </div>

                  <div class="card-details">
                    <div class="details-header">
                      <div>
                        <h3 class="property-name">{{ property.aptNm }}</h3>
                        <p class="property-address">{{ property.roadNm }}</p>
                      </div>
                    </div>

                    <div class="stats-grid">
                      <!-- Price Comparison -->
                      <div class="stat-item premium-bg">
                        <p class="stat-label">매매가</p>
                        <p class="stat-value text-primary">{{ formatPriceDisplay(property.dealAmount) }}</p>
                        <div v-if="myHouse" class="comparison-badge" 
                             :class="parsePrice(property.dealAmount) > parsePrice(myHouse.dealAmount) ? 'badge-red' : parsePrice(property.dealAmount) < parsePrice(myHouse.dealAmount) ? 'badge-blue' : 'badge-gray'">
                          {{ formatPriceDiff(property.dealAmount, myHouse.dealAmount) }}
                        </div>
                      </div>

                      <!-- Area Comparison -->
                      <div class="stat-item premium-bg">
                        <p class="stat-label">면적</p>
                        <p class="stat-value">{{ property.excluUseAr || '-' }}</p>
                        <div v-if="myHouse" class="comparison-badge"
                             :class="parseArea(property.excluUseAr) > parseArea(myHouse.excluUseAr) ? 'badge-blue' : parseArea(property.excluUseAr) < parseArea(myHouse.excluUseAr) ? 'badge-red' : 'badge-gray'">
                          {{ formatAreaDiff(property.excluUseAr, myHouse.excluUseAr) }}
                        </div>
                      </div>

                      <!-- Pyeong Price -->
                      <div class="stat-item premium-bg">
                        <p class="stat-label">평당가</p>
                        <p class="stat-value">{{ calculatePricePerPyeong(property.dealAmount, property.excluUseAr) }}만</p>
                      </div>

                      <!-- Building Age -->
                      <div class="stat-item premium-bg" v-if="property.buildYear">
                        <p class="stat-label">건축년도</p>
                        <p class="stat-value">{{ property.buildYear }}년</p>
                        <div class="age-badge">{{ calculateBuildingAge(property.buildYear) }}</div>
                      </div>
                    </div>

                    
                    <div class="card-footer">
                      <BaseButton variant="outline" size="sm" @click="moveToMap(property)">
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

.login-required {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.login-required-card {
  text-align: center;
  padding: 3rem;
  background: var(--color-white);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 400px;
}

.login-required-card .login-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.login-required-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.75rem;
}

.login-required-card p {
  color: var(--color-gray-500);
  margin-bottom: 1.5rem;
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
  background-color: var(--color-primary-soft);
  border: 2px solid var(--color-primary);
}

.my-house-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-white);
  padding: 0.35rem 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  border-bottom-right-radius: 0.75rem;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
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
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  background-color: var(--color-white);
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-primary-transparent-20);
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
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 700;
  color: var(--color-text);
  font-size: 0.9375rem;
}

.text-primary {
  color: var(--color-primary);
}

/* Premium Styles */
.premium-bg {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.property-card:hover .premium-bg {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.comparison-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 800;
  margin-top: 0.375rem;
}

.badge-red {
  background-color: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
}

.badge-blue {
  background-color: #eff6ff;
  color: #3b82f6;
  border: 1px solid #dbeafe;
}

.badge-gray {
  background-color: #f9fafb;
  color: #6b7280;
  border: 1px solid #f3f4f6;
}

.age-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  margin-top: 0.25rem;
}

.age-text {
  font-size: 0.75rem;
  color: var(--color-gray-400);
  font-weight: normal;
}

.property-card {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.property-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  align-items: center;
}

.card-footer :deep(.base-button) {
  white-space: nowrap;
  min-width: 7rem;
  height: 2.75rem;
  justify-content: center;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-footer :deep(.base-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
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

/* AI Summary Styles */
.ai-summary-card {
  background-color: var(--color-white);
  border-radius: 1rem;
  border: 1px solid var(--color-primary-transparent-20);
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-title h3 {
  font-weight: 700;
  color: var(--color-text);
  font-size: 1.125rem;
}

.sparkle-icon {
  color: var(--color-primary);
  width: 1.25rem;
  height: 1.25rem;
}

.summary-content {
  background-color: var(--color-primary-soft);
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-primary-transparent-10);
}

.summary-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-800);
  white-space: pre-wrap;
}

.summary-placeholder {
  padding: 1rem;
  text-align: center;
  color: var(--color-gray-400);
  font-size: 0.875rem;
  background-color: var(--color-gray-50);
  border-radius: 0.75rem;
}

.summary-loading {
  padding: 1.5rem;
  text-align: center;
  color: var(--color-primary);
}

.loading-dots span {
  font-size: 2rem;
  animation: dots 1.5s infinite;
  display: inline-block;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

.ml-2 { margin-left: 0.5rem; }
.gap-2 { gap: 0.5rem; }

@keyframes dots {
  0%, 100% { transform: translateY(0); opacity: 0.2; }
  50% { transform: translateY(-5px); opacity: 1; }
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mb-6 { margin-bottom: 1.5rem; }
.mr-1 { margin-right: 0.25rem; }
</style>

