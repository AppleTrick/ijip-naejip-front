<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import AddressSearch from '@/components/features/address/AddressSearch.vue'
import { ArrowLeft, Home } from 'lucide-vue-next'
import { useSafeHomeStore } from '@/stores/safehome'

const router = useRouter()
const store = useSafeHomeStore()

const house = ref({
  name: '',
  address: '',
  detailAddress: '',
  area: '',
  floor: '',
  price: ''
})

const isSearching = ref(false)

const handleAddressSelect = (address: any) => {
  house.value.address = address.roadAddress
  house.value.name = address.bname // Default name to neighborhood
  isSearching.value = false
}

const handleSave = () => {
  // Save to store
  store.setMyHouse({
    name: house.value.name,
    address: `${house.value.address} ${house.value.detailAddress}`,
    price: house.value.price,
    area: house.value.area,
    floor: house.value.floor
  })
  
  alert('내 집 정보가 저장되었습니다.')
  router.back()
}
</script>

<template>
  <div class="house-management-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="router.back()">
          <ArrowLeft class="icon" />
        </button>
        <h1 class="page-title">내 집 관리</h1>
        <div class="placeholder"></div>
      </div>

      <div class="content-card">
        <div class="icon-header">
          <div class="icon-wrapper">
            <Home class="home-icon" />
          </div>
          <p class="header-desc">
            거주하고 계신 집의 정보를 등록하면<br>
            다른 매물과 쉽게 비교할 수 있습니다.
          </p>
        </div>

        <form class="house-form" @submit.prevent="handleSave">
          <!-- Address Search -->
          <div class="form-group">
            <label class="label">주소</label>
            <div class="address-search-box">
              <input 
                type="text" 
                :value="house.address" 
                readonly 
                placeholder="주소를 검색해주세요"
                class="address-input"
                @click="isSearching = !isSearching"
              />
              <BaseButton type="button" size="sm" @click="isSearching = !isSearching">
                검색
              </BaseButton>
            </div>
            <div v-if="isSearching" class="search-container">
              <AddressSearch @select="handleAddressSelect" />
            </div>
          </div>

          <BaseInput 
            id="detailAddress" 
            v-model="house.detailAddress" 
            label="상세 주소" 
            placeholder="동/호수 등을 입력하세요" 
          />

          <BaseInput 
            id="name" 
            v-model="house.name" 
            label="별칭" 
            placeholder="예: 우리집, 반포 자이" 
          />

          <div class="row">
            <BaseInput 
              id="area" 
              v-model="house.area" 
              label="면적 (평)" 
              placeholder="예: 34평" 
            />
            <BaseInput 
              id="floor" 
              v-model="house.floor" 
              label="층수" 
              placeholder="예: 15층" 
            />
          </div>

          <BaseInput 
            id="price" 
            v-model="house.price" 
            label="매매가 (예상)" 
            placeholder="예: 15억" 
          />

          <div class="actions">
            <BaseButton type="submit" full-width size="lg">
              저장하기
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.house-management-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 2rem 1rem;
}

.container {
  max-width: 32rem;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.placeholder {
  width: 2.5rem;
}

.content-card {
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.icon-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
}

.icon-wrapper {
  width: 4rem;
  height: 4rem;
  background-color: rgba(144, 55, 73, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.home-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
}

.header-desc {
  color: var(--color-text-light);
  line-height: 1.5;
  font-size: 0.875rem;
}

.house-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.address-search-box {
  display: flex;
  gap: 0.5rem;
}

.address-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: var(--color-gray-50);
  cursor: pointer;
}

.search-container {
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 0.5rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.actions {
  margin-top: 1rem;
}
</style>
