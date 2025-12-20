<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import BaseFilterDropdown from '@/components/common/BaseFilterDropdown.vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'filter', filters: any): void
}>()

const searchQuery = ref<string>('')

// 필터 상태 관리
const filters = reactive({
  priceRange: { min: 0, max: 20 }, // 단위: 억 원
  area: [] as string[]
})

// 평형 옵션 정의
const areaOptions = [
  { label: '10평대', value: '10' },
  { label: '20평대', value: '20' },
  { label: '30평대', value: '30' },
  { label: '40평대 이상', value: '40+' }
]

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

const formatPrice = (val: number) => {
  if (val === 0) return '0원'
  return `${val}억`
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
      <BaseFilterDropdown label="가격대" :is-active="filters.priceRange.min > 0 || filters.priceRange.max < 20">
        <div class="dropdown-content w-64">
          <div class="price-range-inputs">
            <div class="range-group">
              <label class="range-label">최소</label>
              <div class="input-with-unit">
                <input 
                  type="number" 
                  v-model.number="filters.priceRange.min" 
                  class="range-input"
                  min="0"
                  max="50"
                >
                <span class="unit">억</span>
              </div>
            </div>
            <span class="separator">~</span>
            <div class="range-group">
              <label class="range-label">최대</label>
              <div class="input-with-unit">
                <input 
                  type="number" 
                  v-model.number="filters.priceRange.max" 
                  class="range-input"
                  min="0"
                  max="50"
                >
                <span class="unit">억</span>
              </div>
            </div>
          </div>
          <p class="price-preview">
            {{ formatPrice(filters.priceRange.min) }} ~ {{ formatPrice(filters.priceRange.max) }}
          </p>
        </div>
      </BaseFilterDropdown>

      <!-- 평형 필터 -->
      <BaseFilterDropdown label="평형" :is-active="filters.area.length > 0">
        <div class="dropdown-content">
          <div class="checkbox-group">
            <label v-for="option in areaOptions" :key="option.value" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="option.value" 
                v-model="filters.area"
                class="checkbox-input"
              >
              <span class="checkbox-text">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </BaseFilterDropdown>
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

/* 드롭다운 컨텐츠 스타일 */
.dropdown-content {
  min-width: 12rem;
}

.w-64 {
  width: 16rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.checkbox-text {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

/* 가격 범위 입력 스타일 */
.price-range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.range-group {
  flex: 1;
}

.range-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.range-input {
  width: 100%;
  padding: 0.5rem;
  padding-right: 1.5rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
}

.range-input:focus {
  border-color: var(--color-primary);
}

.unit {
  position: absolute;
  right: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.separator {
  color: var(--color-text-light);
  font-weight: 500;
}

.price-preview {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
  background-color: var(--color-primary-transparent-10);
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
