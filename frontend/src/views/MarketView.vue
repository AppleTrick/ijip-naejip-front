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
  <div class="flex-1 relative overflow-hidden flex h-full">
    <!-- Left Sidebar (Property Details) -->
    <div v-if="selectedProperty" class="absolute top-24 left-4 bottom-4 w-full md:w-[420px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl z-30 overflow-hidden flex flex-col animate-slide-in-left border border-white/50">
      <!-- Header Image Placeholder -->
      <div class="h-64 bg-gray-200 relative group">
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
             alt="Property" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button @click="closePropertyCard" class="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all">
          <X class="w-5 h-5" />
        </button>
        <div class="absolute bottom-4 left-4">
          <span class="px-3 py-1 rounded-lg bg-[#4A70A9] text-white text-xs font-bold shadow-sm">{{ selectedProperty.type }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 flex-1">
        <div class="mb-6">
          <div class="flex justify-between items-start mb-1">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedProperty.name }}</h2>
            <button 
              @click="isInComparison(selectedProperty.id) ? removeFromComparison(selectedProperty.id) : addToComparison(selectedProperty)"
              class="p-2 rounded-full transition-colors"
              :class="isInComparison(selectedProperty.id) ? 'bg-[#8FABD4]/30 text-[#4A70A9] hover:bg-[#8FABD4]/50' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
              :title="isInComparison(selectedProperty.id) ? '비교함에서 제거' : '비교함에 추가'"
            >
              <component :is="isInComparison(selectedProperty.id) ? Check : Plus" class="w-6 h-6" />
            </button>
          </div>
          <p class="text-gray-500 flex items-center text-sm">
            <span class="mr-2">📍</span> {{ selectedProperty.address }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-[#EFECE3] p-5 rounded-2xl border border-[#8FABD4]">
            <p class="text-sm text-[#4A70A9] font-bold mb-1">매매가</p>
            <p class="text-3xl font-[800] text-[#4A70A9] tracking-tight">{{ selectedProperty.price }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">관리비</p>
            <p class="text-lg font-bold text-gray-700">{{ selectedProperty.maintenanceFee }}</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">공급/전용면적</p>
            <p class="font-bold text-gray-900">{{ selectedProperty.area }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">해당층/총층</p>
            <p class="font-bold text-gray-900">{{ selectedProperty.floor }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 col-span-2">
            <p class="text-xs text-gray-500 mb-1">상세설명</p>
            <p class="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
              {{ selectedProperty.description }}
            </p>
          </div>
        </div>

        <!-- Safety Check CTA -->
        <div class="bg-[#EFECE3] rounded-2xl p-6 border border-[#8FABD4] mb-6">
          <h3 class="font-bold text-[#4A70A9] mb-2 flex items-center text-lg">
            <ShieldCheck class="w-6 h-6 mr-2 text-[#4A70A9]" />
            이 매물, 안전할까요?
          </h3>
          <p class="text-sm text-[#4A70A9]/80 mb-4 leading-relaxed">
            등기부등본 AI 분석을 통해<br>전세 사기 위험도를 무료로 확인하세요.
          </p>
          <BaseButton @click="goToAnalysis" full-width class="py-3">
            안전도 분석 시작하기
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Map Area -->
    <div class="flex-1 relative h-full">
      <KakaoMap 
        :markers="filteredProperties" 
        @select-marker="handleMarkerSelect" 
      />
      
      <!-- Floating Search Bar -->
      <div class="absolute top-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div class="w-full max-w-2xl pointer-events-auto">
          <MarketFilter @search="handleSearch" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>
