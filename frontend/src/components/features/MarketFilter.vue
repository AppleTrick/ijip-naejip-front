<script setup>
import { ref } from 'vue'
import { Search, Filter, ChevronDown } from 'lucide-vue-next'

const emit = defineEmits(['search', 'filter'])

const searchQuery = ref('')
const activeFilters = ref({
  type: 'all', // apt, villa, officetel
  priceRange: 'all'
})

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
    <!-- Search Bar -->
    <div class="flex-1 relative shadow-xl rounded-xl bg-white">
      <input 
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text" 
        class="w-full pl-12 pr-24 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg placeholder-gray-400"
        placeholder="지역, 지하철역, 아파트명 검색"
      >
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
      <button 
        @click="handleSearch"
        class="absolute right-2 top-2 bottom-2 bg-lime-500 hover:bg-lime-600 text-white px-6 rounded-lg font-bold transition-colors shadow-md"
      >
        검색
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      <button class="flex items-center px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-lime-500 text-gray-700 font-medium whitespace-nowrap transition-all">
        <Filter class="w-4 h-4 mr-2" />
        필터
      </button>
      <button class="flex items-center px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-lime-500 text-gray-700 font-medium whitespace-nowrap transition-all">
        아파트/오피스텔
        <ChevronDown class="w-4 h-4 ml-2 text-gray-400" />
      </button>
      <button class="flex items-center px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-lime-500 text-gray-700 font-medium whitespace-nowrap transition-all">
        가격대
        <ChevronDown class="w-4 h-4 ml-2 text-gray-400" />
      </button>
      <button class="flex items-center px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-lime-500 text-gray-700 font-medium whitespace-nowrap transition-all">
        평형
        <ChevronDown class="w-4 h-4 ml-2 text-gray-400" />
      </button>
    </div>
  </div>
</template>
