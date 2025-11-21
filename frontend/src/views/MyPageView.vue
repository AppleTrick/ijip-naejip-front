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
  <div class="mypage-container">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="section-card header-card">
        <h1 class="page-title">내 정보</h1>
        <p class="page-subtitle">계정 정보를 확인하고 관리할 수 있습니다.</p>
      </div>

      <!-- Profile Card -->
      <div class="section-card profile-card">
        <div class="card-content">
          <div class="profile-header">
            <div class="avatar">
              {{ user.name[0] }}
            </div>
            <div>
              <h2 class="user-name">{{ user.name }}</h2>
              <p class="user-email">{{ user.email }}</p>
            </div>
          </div>

          <div class="profile-details">
            <dl class="details-grid">
              <div>
                <dt class="detail-label">이름</dt>
                <dd class="detail-value">{{ user.name }}</dd>
              </div>
              <div>
                <dt class="detail-label">이메일</dt>
                <dd class="detail-value">{{ user.email }}</dd>
              </div>
              <div>
                <dt class="detail-label">가입일</dt>
                <dd class="detail-value">{{ user.joinDate }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

        <!-- My House Section -->
        <div class="section-card house-card">
          <div class="card-content">
            <h2 class="section-title">내 집 관리</h2>
            
            <div v-if="myHouse" class="my-house-info">
              <div class="house-header">
                <div>
                  <h3 class="house-name">{{ myHouse.name }}</h3>
                  <p class="house-address">{{ myHouse.address }}</p>
                </div>
                <button @click="setMyHouse(null)" class="delete-btn">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              <div class="house-stats">
                <div class="stat-box">
                  <p class="stat-label">매매가</p>
                  <p class="stat-value">{{ myHouse.price }}</p>
                </div>
                <div class="stat-box">
                  <p class="stat-label">면적</p>
                  <p class="stat-value">{{ myHouse.area }}</p>
                </div>
                <div class="stat-box">
                  <p class="stat-label">층수</p>
                  <p class="stat-value">{{ myHouse.floor }}</p>
                </div>
              </div>
            </div>

            <div v-else class="house-form-container">
              <p class="form-desc">내 집을 등록하고 관심 매물과 비교해보세요.</p>
              <div class="form-grid">
                <BaseInput v-model="newHouse.name" label="별칭 (예: 우리집)" placeholder="우리집" />
                <BaseInput v-model="newHouse.address" label="주소" placeholder="서울시 강남구 역삼동" />
                <BaseInput v-model="newHouse.price" label="매매가 (예: 10억 5000만원)" placeholder="10억 5000만원" />
                <BaseInput v-model="newHouse.area" label="면적 (예: 34평)" placeholder="34평" />
                <BaseInput v-model="newHouse.floor" label="층수 (예: 15층)" placeholder="15층" />
              </div>
              <div class="form-actions">
                <BaseButton @click="handleRegisterHouse">
                  내 집 등록하기
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        
        <div class="logout-section">
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

<style scoped>
.mypage-container {
  min-height: 100%;
  background-color: var(--color-bg);
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .mypage-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .mypage-container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.content-wrapper {
  max-width: 48rem; /* max-w-3xl */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-card {
  background-color: var(--color-white);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 1rem;
  overflow: hidden;
}

.header-card {
  padding: 1.5rem;
  border: 2px solid rgba(232, 69, 69, 0.2); /* primary-transparent20 */
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.page-subtitle {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.profile-card {
  border: 2px solid rgba(144, 55, 73, 0.3); /* secondary-transparent30 */
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  height: 4rem;
  width: 4rem;
  border-radius: 9999px;
  background-color: rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.user-email {
  color: var(--color-text-light);
}

.profile-details {
  border-top: 1px solid rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
  padding-top: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1rem;
  }
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
}

.detail-value {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 600;
}

.house-card {
  border: 2px solid rgba(144, 55, 73, 0.3); /* secondary-transparent30 */
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.my-house-info {
  background-color: rgba(144, 55, 73, 0.1); /* secondary/10 */
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 2px solid rgba(144, 55, 73, 0.3); /* secondary-transparent30 */
}

.house-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.house-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
}

.house-address {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.delete-btn {
  color: var(--color-gray-400);
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  color: var(--color-primary);
}

.house-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-box {
  background-color: var(--color-white);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(144, 55, 73, 0.2); /* secondary-transparent20 */
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 700;
  color: var(--color-primary);
}

.house-form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-desc {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.logout-section {
  background-color: var(--color-white);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(232, 69, 69, 0.2); /* primary-transparent20 */
  margin-top: 1.5rem;
}
</style>
