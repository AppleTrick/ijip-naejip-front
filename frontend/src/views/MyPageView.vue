<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSafeHomeStore, type House } from '../stores/safehome'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { Trash2 } from 'lucide-vue-next'

const store = useSafeHomeStore()
const { myHouse } = storeToRefs(store)
const { setMyHouse } = store

// Mock user data
const user = ref({
  name: '김싸피',
  email: 'ssafy@example.com',
  joinDate: '2023-11-20'
})

const newHouse = ref<House>({
  name: '',
  address: '',
  price: '',
  area: '',
  floor: ''
})

const handleRegisterHouse = () => {
  if (!newHouse.value.name || !newHouse.value.price) return
  setMyHouse({ ...newHouse.value })
  newHouse.value = { name: '', address: '', price: '', area: '', floor: '' }
}

const handleLogout = () => {
  console.log('Logout attempt')
  // TODO: Implement logout logic
}
</script>

<template>
  <div class="min-h-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white shadow rounded-2xl p-6">
        <h1 class="text-2xl font-bold text-gray-900">내 정보</h1>
        <p class="mt-1 text-sm text-gray-500">계정 정보를 확인하고 관리할 수 있습니다.</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white shadow rounded-2xl overflow-hidden">
        <div class="p-6 space-y-6">
          <div class="flex items-center space-x-4">
            <div class="h-16 w-16 rounded-full bg-lime-100 flex items-center justify-center text-2xl font-bold text-lime-600">
              {{ user.name[0] }}
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ user.name }}</h2>
              <p class="text-gray-500">{{ user.email }}</p>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">이름</dt>
                <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ user.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">이메일</dt>
                <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ user.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">가입일</dt>
                <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ user.joinDate }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

        <!-- My House Section -->
        <div class="bg-white shadow rounded-2xl overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">내 집 관리</h2>
            
            <div v-if="myHouse" class="bg-lime-50 rounded-xl p-6 border border-lime-100">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ myHouse.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ myHouse.address }}</p>
                </div>
                <button @click="setMyHouse(null)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-white p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">매매가</p>
                  <p class="font-bold text-gray-900">{{ myHouse.price }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">면적</p>
                  <p class="font-bold text-gray-900">{{ myHouse.area }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">층수</p>
                  <p class="font-bold text-gray-900">{{ myHouse.floor }}</p>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <p class="text-sm text-gray-500 mb-4">내 집을 등록하고 관심 매물과 비교해보세요.</p>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <BaseInput v-model="newHouse.name" label="별칭 (예: 우리집)" placeholder="우리집" />
                <BaseInput v-model="newHouse.address" label="주소" placeholder="서울시 강남구 역삼동" />
                <BaseInput v-model="newHouse.price" label="매매가 (예: 10억 5000만원)" placeholder="10억 5000만원" />
                <BaseInput v-model="newHouse.area" label="면적 (예: 34평)" placeholder="34평" />
                <BaseInput v-model="newHouse.floor" label="층수 (예: 15층)" placeholder="15층" />
              </div>
              <div class="flex justify-end mt-4">
                <BaseButton @click="handleRegisterHouse">
                  내 집 등록하기
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end rounded-2xl shadow mt-6">
          <BaseButton
            variant="danger"
            size="md"
            @click="handleLogout"
          >
            로그아웃
          </BaseButton>
        </div>
    </div>
  </div>
</template>
