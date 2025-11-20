<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore } from '../stores/safehome'
import { useRouter } from 'vue-router'
import BaseButton from '../components/common/BaseButton.vue'
import BaseSelect from '../components/common/BaseSelect.vue'
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
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      break
    case 'price_desc':
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      break
    case 'area_desc':
      list.sort((a, b) => parseArea(b.area) - parseArea(a.area))
      break
  }
  
  return list
})
</script>

<template>
    
  <div class="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft class="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">집 비교하기</h1>
            <p class="text-gray-500 text-sm mt-1">내 집과 관심 매물을 한눈에 비교해보세요.</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Sidebar (Filters) -->
        <div class="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div class="flex items-center mb-4">
              <Filter class="w-5 h-5 text-primary mr-2" />
              <h3 class="font-bold text-gray-900">필터링 기준</h3>
            </div>
            
            <!-- Mock Filters -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">가격 범위</label>
                <div class="flex items-center space-x-2">
                  <input type="range" class="w-full accent-primary" min="0" max="20" step="1">
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>최소</span>
                  <span>최대</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">면적</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded text-primary focus:ring-primary border-gray-300">
                    <span class="ml-2 text-sm text-gray-600">20평대</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded text-primary focus:ring-primary border-gray-300">
                    <span class="ml-2 text-sm text-gray-600">30평대</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded text-primary focus:ring-primary border-gray-300">
                    <span class="ml-2 text-sm text-gray-600">40평대 이상</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">층수</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded text-primary focus:ring-primary border-gray-300">
                    <span class="ml-2 text-sm text-gray-600">1층</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded text-primary focus:ring-primary border-gray-300">
                    <span class="ml-2 text-sm text-gray-600">저층 (2~5층)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded text-primary focus:ring-primary border-gray-300">
                    <span class="ml-2 text-sm text-gray-600">고층 (6층 이상)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Sort Header -->
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-500">총 <span class="font-bold text-gray-900">{{ comparisonList.length + (myHouse ? 1 : 0) }}</span>개의 매물 비교</span>
            <div class="w-40">
              <BaseSelect v-model="sortOption" :options="sortOptions" placeholder="정렬 기준" />
            </div>
          </div>

          <div class="space-y-6">
            <!-- My House Card (Top) -->
            <div v-if="myHouse" class="w-full">
              <div class="bg-secondary/10 rounded-2xl shadow-md border-2 border-primary overflow-hidden flex flex-col sm:flex-row relative">
                <div class="absolute top-0 left-0 bg-secondary/100 text-white px-3 py-1 text-xs font-bold rounded-br-lg z-10">
                  내 집 (기준)
                </div>
                
                <div class="h-48 sm:h-auto sm:w-64 bg-gray-200 relative flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                       alt="My House" class="w-full h-full object-cover" />
                </div>

                <div class="p-5 flex-1 flex flex-col">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 mb-1">{{ myHouse.name }}</h3>
                      <p class="text-gray-500 text-sm">{{ myHouse.address }}</p>
                    </div>
                    <BaseButton @click="router.push('/mypage')" size="sm" variant="outline">
                      수정
                    </BaseButton>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-white p-3 rounded-lg border border-secondary/20">
                      <p class="text-xs text-gray-500">매매가</p>
                      <p class="font-bold text-gray-900">{{ myHouse.price }}</p>
                    </div>
                    <div class="bg-white p-3 rounded-lg border border-secondary/20">
                      <p class="text-xs text-gray-500">면적</p>
                      <p class="font-bold text-gray-900">{{ myHouse.area }}</p>
                    </div>
                    <div class="bg-white p-3 rounded-lg border border-secondary/20">
                      <p class="text-xs text-gray-500">층수</p>
                      <p class="font-bold text-gray-900">{{ myHouse.floor }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State for My House -->
            <div v-else class="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
              <Home class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 font-medium mb-4">내 집을 등록하면 비교가 더 쉬워집니다.</p>
              <BaseButton @click="router.push('/mypage')" size="sm">내 집 등록하기</BaseButton>
            </div>

            <!-- Comparison List -->
            <div v-if="sortedComparisonList.length > 0" class="space-y-6">
              <div v-for="property in sortedComparisonList" :key="property.id" class="w-full">
                <div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col sm:flex-row relative group hover:shadow-xl transition-shadow">
                  <button @click="removeFromComparison(property.id)" 
                          class="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-10">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  
                  <div class="h-48 sm:h-auto sm:w-64 bg-gray-200 relative flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                         alt="Property" class="w-full h-full object-cover" />
                    <div class="absolute bottom-2 left-2">
                      <span class="px-2 py-1 rounded bg-black/50 text-white text-xs font-bold">{{ property.type }}</span>
                    </div>
                  </div>

                  <div class="p-5 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ property.name }}</h3>
                        <p class="text-gray-500 text-sm">{{ property.address }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <!-- Price Comparison -->
                      <div class="bg-gray-50 p-3 rounded-lg relative overflow-hidden">
                        <p class="text-xs text-gray-500">매매가</p>
                        <p class="font-bold text-gray-900">{{ property.price }}</p>
                        <div v-if="myHouse" class="mt-1 text-xs font-bold" 
                             :class="parsePrice(property.price) > parsePrice(myHouse.price) ? 'text-red-500' : parsePrice(property.price) < parsePrice(myHouse.price) ? 'text-blue-500' : 'text-gray-400'">
                          {{ formatPriceDiff(property.price, myHouse.price) }}
                        </div>
                      </div>

                      <!-- Area Comparison -->
                      <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-xs text-gray-500">면적</p>
                        <p class="font-bold text-gray-900">{{ property.area }}</p>
                        <div v-if="myHouse" class="mt-1 text-xs font-bold"
                             :class="parseArea(property.area) > parseArea(myHouse.area) ? 'text-blue-500' : parseArea(property.area) < parseArea(myHouse.area) ? 'text-red-500' : 'text-gray-400'">
                          {{ formatAreaDiff(property.area, myHouse.area) }}
                        </div>
                      </div>

                      <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-xs text-gray-500">층수</p>
                        <p class="font-bold text-gray-900">{{ property.floor }}</p>
                      </div>
                    </div>
                    
                    <div class="mt-auto flex justify-end">
                      <BaseButton variant="outline" size="sm" @click="router.push('/')">
                        지도에서 보기
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State for Comparison List -->
            <div v-else class="flex items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-300 min-h-[200px]">
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle class="w-6 h-6 text-gray-400" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">비교할 매물이 없어요</h3>
                <p class="text-gray-500 text-sm mb-4">지도에서 관심있는 매물을 담아보세요.</p>
                <BaseButton @click="router.push('/')" size="sm">
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
