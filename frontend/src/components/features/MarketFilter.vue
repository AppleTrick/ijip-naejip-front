<script setup lang="ts">
import { ref } from 'vue'
import { Search, Filter, ChevronDown } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'filter', filters: any): void
}>()

const searchQuery = ref<string>('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="filter-container">
    <!-- Search Bar -->
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

    <!-- Filters -->
    <div class="filter-buttons">
      <button class="filter-btn">
        <Filter class="filter-icon" />
        필터
      </button>
      <button class="filter-btn">
        아파트/오피스텔
        <ChevronDown class="chevron-icon" />
      </button>
      <button class="filter-btn">
        가격대
        <ChevronDown class="chevron-icon" />
      </button>
      <button class="filter-btn">
        평형
        <ChevronDown class="chevron-icon" />
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
  padding: 1rem 6rem 1rem 3rem;
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
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .filter-buttons {
    padding-bottom: 0;
  }
}

.filter-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--color-white);
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-100);
  color: var(--color-gray-700);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
  cursor: pointer;
}

.filter-btn:hover {
  border-color: var(--color-primary);
}

.filter-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  color: var(--color-gray-400);
}
</style>
