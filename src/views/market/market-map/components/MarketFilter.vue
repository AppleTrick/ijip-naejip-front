<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { Search, RotateCcw } from 'lucide-vue-next'
import BaseFilterDropdown from '@/components/common/BaseFilterDropdown.vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'filter', filters: any): void
}>()

const searchQuery = ref<string>('')

// 필터 상태 관리
const filters = reactive({
  priceRange: { min: 0, max: 100 }, // 단위: 억 원
  areaRange: { min: 0, max: 100 }  // 단위: 평
})

// 평형 옵션 정의 제거 (범위 방식으로 변경됨)

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const applyFilters = () => {
  emit('filter', { ...filters })
}

// 필터 변경 감지: 변경 시 즉시 필터 적용 (UX 향상)
// 체크박스나 슬라이더 변경 시 실시간으로 반영
watch(filters, () => {
  applyFilters()
}, { deep: true })



const isFilterActive = computed(() => {
  return filters.priceRange.min > 0 || filters.priceRange.max < 100 || 
         filters.areaRange.min > 0 || filters.areaRange.max < 100
})

const resetFilters = () => {
  filters.priceRange.min = 0
  filters.priceRange.max = 100
  filters.areaRange.min = 0
  filters.areaRange.max = 100
  searchQuery.value = ''
  emit('search', '')
}

// 퀵 필터 옵션 정의
const priceQuickOptions = [
  { label: '전체', min: 0, max: 100 },
  { label: '~2억', min: 0, max: 2 },
  { label: '~3억', min: 0, max: 3 },
  { label: '~4억', min: 0, max: 4 },
  { label: '~5억', min: 0, max: 5 },
  { label: '~6억', min: 0, max: 6 },
  { label: '~10억', min: 0, max: 10 },
  { label: '~12억', min: 0, max: 12 },
  { label: '15억~', min: 15, max: 100 },
  { label: '20억~', min: 20, max: 100 },
  { label: '30억~', min: 30, max: 100 },
  { label: '40억~', min: 40, max: 100 }
]

const areaQuickOptions = [
  { label: '전체', min: 0, max: 100 },
  { label: '10평대', min: 10, max: 19 },
  { label: '20평대', min: 20, max: 29 },
  { label: '30평대', min: 30, max: 39 },
  { label: '40평대', min: 40, max: 49 },
  { label: '50평대', min: 50, max: 59 },
  { label: '60평대', min: 60, max: 69 },
  { label: '70평~', min: 70, max: 100 },
  { label: '80평~', min: 80, max: 100 }
]

const setPriceRange = (min: number, max: number) => {
  filters.priceRange.min = min
  filters.priceRange.max = max
}

const setAreaRange = (min: number, max: number) => {
  filters.areaRange.min = min
  filters.areaRange.max = max
}
</script>

<template>
  <div class="filter-container">
    <!-- 검색바 -->
    <div class="search-wrapper">
      <input 
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text" 
        class="search-input"
        placeholder="지역, 지하철역, 아파트명 검색"
      >
      <Search class="search-icon" />
      <button 
        @click="handleSearch"
        class="search-btn"
      >
        검색
      </button>
    </div>

    <!-- 필터 버튼 목록 -->
    <div class="filter-buttons">
      <!-- 가격대 필터 -->
      <BaseFilterDropdown label="가격대" :is-active="filters.priceRange.min > 0 || filters.priceRange.max < 100">
        <div class="dropdown-content-pro">
          <!-- 슬라이더 영역 -->
          <div class="slider-section">
            <div class="slider-labels">
              <span>0</span>
              <span>5억</span>
              <span>10억</span>
              <span>20억</span>
              <span>30억</span>
              <span>40억</span>
            </div>
            <div class="range-slider-container">
              <div class="range-track"></div>
              <!-- 눈금 선 추가 -->
              <div class="range-ticks">
                <span v-for="i in 9" :key="i" class="tick" :style="{ left: (i - 1) * 12.5 + '%' }"></span>
              </div>
              <div class="range-progress" :style="{ 
                left: (Math.min(filters.priceRange.min, 40) / 40) * 100 + '%', 
                right: (100 - Math.min(filters.priceRange.max, 40) / 40 * 100) + '%' 
              }"></div>
              <input type="range" min="0" max="40" v-model.number="filters.priceRange.min" class="range-input-slider">
              <input type="range" min="0" max="40" v-model.number="filters.priceRange.max" class="range-input-slider">
            </div>
          </div>

          <!-- 직접 입력 필드 -->
          <div class="manual-inputs">
            <div class="input-group">
              <input type="number" v-model.number="filters.priceRange.min" class="direct-input" min="0">
              <span class="input-unit">억</span>
            </div>
            <span class="input-sep">~</span>
            <div class="input-group">
              <input type="number" v-model.number="filters.priceRange.max" class="direct-input" min="0">
              <span class="input-unit">억</span>
            </div>
          </div>

          <!-- 퀵 필터 칩 -->
          <div class="quick-chips">
            <button 
              v-for="opt in priceQuickOptions" 
              :key="opt.label"
              @click="setPriceRange(opt.min, opt.max)"
              :class="['chip', { active: filters.priceRange.min === opt.min && filters.priceRange.max === opt.max }]"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </BaseFilterDropdown>

      <!-- 평형 필터 -->
      <BaseFilterDropdown label="평형" :is-active="filters.areaRange.min > 0 || filters.areaRange.max < 100">
        <div class="dropdown-content-pro">
          <!-- 슬라이더 영역 -->
          <div class="slider-section">
            <div class="slider-labels">
              <span>0</span>
              <span>20평</span>
              <span>40평</span>
              <span>60평</span>
              <span>80평</span>
            </div>
            <div class="range-slider-container">
              <div class="range-track"></div>
              <!-- 눈금 선 추가 -->
              <div class="range-ticks">
                <span v-for="i in 5" :key="i" class="tick" :style="{ left: (i - 1) * 25 + '%' }"></span>
              </div>
              <div class="range-progress" :style="{ 
                left: (Math.min(filters.areaRange.min, 80) / 80) * 100 + '%', 
                right: (100 - Math.min(filters.areaRange.max, 80) / 80 * 100) + '%' 
              }"></div>
              <input type="range" min="0" max="80" v-model.number="filters.areaRange.min" class="range-input-slider">
              <input type="range" min="0" max="80" v-model.number="filters.areaRange.max" class="range-input-slider">
            </div>
          </div>

          <!-- 직접 입력 필드 -->
          <div class="manual-inputs">
            <div class="input-group">
              <input type="number" v-model.number="filters.areaRange.min" class="direct-input" min="0">
              <span class="input-unit">평</span>
            </div>
            <span class="input-sep">~</span>
            <div class="input-group">
              <input type="number" v-model.number="filters.areaRange.max" class="direct-input" min="0">
              <span class="input-unit">평</span>
            </div>
          </div>

          <!-- 퀵 필터 칩 -->
          <div class="quick-chips">
            <button 
              v-for="opt in areaQuickOptions" 
              :key="opt.label"
              @click="setAreaRange(opt.min, opt.max)"
              :class="['chip', { active: filters.areaRange.min === opt.min && filters.areaRange.max === opt.max }]"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </BaseFilterDropdown>

      <!-- 초기화 버튼 -->
      <button 
        @click="resetFilters" 
        class="reset-btn"
        v-if="isFilterActive"
      >
        <RotateCcw class="reset-icon" />
        초기화
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 56rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .filter-container {
    flex-direction: row;
    align-items: flex-start;
  }
  .search-wrapper {
    flex: 0 0 32rem; /* 고정 너비 부여하여 버튼 추가 시 크기 유지 */
  }
}

.search-wrapper {
  flex: 1;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0.75rem;
  background-color: var(--color-white);
}

.search-input {
  width: 100%;
  height: 3rem;
  padding: 0 6rem 0 3rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200);
  font-size: 1.125rem;
  font-family: "Pretendard", sans-serif;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  box-shadow: 0 0 0 2px var(--color-secondary);
  border-color: transparent;
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  width: 1.5rem;
  height: 1.5rem;
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  bottom: 0.5rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.search-btn:hover {
  background-color: var(--color-primary-hover);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .filter-buttons {
    padding-bottom: 0;
  }
}

.filter-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

/* 드롭다운 컨텐츠 스타일 (Pro) */
.dropdown-content-pro {
  width: 22rem;
  padding: 1.5rem;
  background-color: var(--color-white);
  border-radius: 1rem;
}

.slider-section {
  margin-bottom: 2rem;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

/* 더블 레인지 슬라이더 */
.range-slider-container {
  position: relative;
  height: 0.5rem;
  margin: 0 0.5rem;
}

.range-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray-200);
  border-radius: 0.25rem;
}

.range-progress {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 0.25rem;
  z-index: 1;
}

/* 눈금 선 스타일 */
.range-ticks {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 0.75rem;
  transform: translateY(-50%);
  display: flex;
  pointer-events: none;
}

.tick {
  position: absolute;
  width: 1.5px;
  height: 100%;
  background-color: var(--color-gray-300);
}

.range-input-slider {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  z-index: 2;
}

.range-input-slider::-webkit-slider-thumb {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-white);
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  pointer-events: auto;
  -webkit-appearance: none;
}

.range-input-slider::-moz-range-thumb {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-white);
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  pointer-events: auto;
}

/* 직접 입력 필드 스타일 */
.manual-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.input-group {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.direct-input {
  width: 100%;
  height: 2.75rem;
  padding: 0 1.75rem 0 0.75rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  outline: none;
  text-align: right;
  font-family: 'Pretendard', sans-serif;
  background-color: var(--color-gray-50);
}

.direct-input:focus {
  border-color: var(--color-primary);
  background-color: var(--color-white);
  box-shadow: 0 0 0 3px var(--color-primary-transparent-10);
}

.input-unit {
  position: absolute;
  right: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-400);
  pointer-events: none;
}

.input-sep {
  color: var(--color-gray-300);
  font-weight: 500;
}

/* 퀵 필터 칩 */
.quick-chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.chip {
  padding: 0.625rem 0.5rem;
  background-color: var(--color-gray-100);
  border: 1px solid transparent;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  white-space: nowrap;
}

.chip:hover {
  background-color: var(--color-gray-200);
}

.chip.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px var(--color-primary-transparent-20);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.reset-btn:hover {
  background-color: var(--color-gray-50);
  color: var(--color-primary);
  border-color: var(--color-primary-transparent-20);
}

.reset-icon {
  width: 1rem;
  height: 1rem;
}
</style>
