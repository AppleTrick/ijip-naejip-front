<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { TrendingUp, Clock, Star, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const userName = ref('김싸피')

// Mock Data
const recommendations = ref([
  { id: 1, name: '반포 자이', price: '35억', type: '아파트', location: '서초구 반포동', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: '한남 더힐', price: '80억', type: '빌라', location: '용산구 한남동', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: '아크로 리버파크', price: '45억', type: '아파트', location: '서초구 반포동', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
])

const recentViews = ref([
  { id: 4, name: '은마 아파트', price: '25억', location: '강남구 대치동' },
  { id: 5, name: '잠실 주공 5단지', price: '28억', location: '송파구 잠실동' },
])

const navigateToDetail = (id: number) => {
  router.push(`/price/${id}`)
}
</script>

<template>
  <div class="home-view">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="container">
        <h1 class="greeting">
          안녕하세요, <span class="highlight">{{ userName }}</span>님!<br>
          오늘의 추천 매물을 확인해보세요.
        </h1>
      </div>
    </section>

    <div class="container content-grid">
      <!-- Main Content -->
      <div class="main-column">
        <!-- Recommendations Carousel/Grid -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">
              <Star class="icon" /> 회원님을 위한 추천 매물
            </h2>
            <button class="more-btn" @click="router.push('/map')">더보기 <ChevronRight class="icon-sm" /></button>
          </div>
          <div class="card-grid">
            <div v-for="item in recommendations" :key="item.id" class="property-card" @click="navigateToDetail(item.id)">
              <div class="image-wrapper">
                <img :src="item.image" :alt="item.name" class="card-image" />
                <span class="badge">{{ item.type }}</span>
              </div>
              <div class="card-info">
                <h3 class="card-title">{{ item.name }}</h3>
                <p class="card-location">{{ item.location }}</p>
                <p class="card-price">{{ item.price }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Market Trends (Placeholder Graph) -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">
              <TrendingUp class="icon" /> 관심 지역 시세 트렌드
            </h2>
          </div>
          <div class="trend-card">
            <div class="trend-header">
              <span class="trend-location">서울시 강남구</span>
              <span class="trend-change up">+1.8% <TrendingUp class="icon-xs" /></span>
            </div>
            <div class="graph-placeholder">
              <!-- Placeholder for Chart.js or similar -->
              <div class="mock-graph-line"></div>
              <div class="mock-graph-labels">
                <span>1월</span><span>2월</span><span>3월</span><span>4월</span><span>5월</span><span>6월</span>
              </div>
            </div>
            <p class="trend-desc">최근 3개월 동안 매매가가 상승세를 보이고 있습니다.</p>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Recently Viewed -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">
            <Clock class="icon-sm" /> 최근 본 매물
          </h3>
          <ul class="recent-list">
            <li v-for="item in recentViews" :key="item.id" class="recent-item" @click="navigateToDetail(item.id)">
              <div class="recent-info">
                <span class="recent-name">{{ item.name }}</span>
                <span class="recent-price">{{ item.price }}</span>
              </div>
              <span class="recent-location">{{ item.location }}</span>
            </li>
          </ul>
        </div>

        <!-- Quick Actions -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">바로가기</h3>
          <div class="action-buttons">
            <BaseButton variant="outline" full-width @click="router.push('/map')">지도에서 찾기</BaseButton>
            <BaseButton variant="outline" full-width @click="router.push('/comparison')">매물 비교하기</BaseButton>
            <BaseButton variant="outline" full-width @click="router.push('/analysis')">안전도 분석</BaseButton>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100%;
  background-color: var(--color-bg);
  padding-bottom: 4rem;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

/* Welcome Section */
.welcome-section {
  background-color: var(--color-white);
  padding: 3rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.greeting {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.4;
}

.highlight {
  color: var(--color-primary);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 20rem;
  }
}

/* Sections */
.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: var(--color-primary);
  width: 1.75rem;
  height: 1.75rem;
}

.more-btn {
  display: flex;
  align-items: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.more-btn:hover {
  color: var(--color-primary);
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.property-card {
  background: var(--color-white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid var(--color-gray-200);
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  height: 12rem;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-info {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.card-location {
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.card-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
}

/* Trend Card */
.trend-card {
  background: var(--color-white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-200);
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.trend-location {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.trend-change {
  color: #ef4444;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-change.up { color: #ef4444; }
.trend-change.down { color: #3b82f6; }

.icon-xs {
  width: 0.875rem;
  height: 0.875rem;
}

.graph-placeholder {
  height: 200px;
  background: linear-gradient(180deg, rgba(232, 69, 69, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  border-bottom: 1px solid var(--color-gray-200);
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2rem;
}

.mock-graph-line {
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,150 Q100,100 200,120 T400,80 T600,40 T800,20' fill='none' stroke='%23E84545' stroke-width='3'/%3E%3C/svg%3E");
  background-size: cover;
  background-repeat: no-repeat;
}

.mock-graph-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.trend-desc {
  font-size: 0.875rem;
  color: var(--color-text-light);
  text-align: center;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: var(--color-white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-200);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-gray-100);
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background-color: var(--color-gray-50);
}

.recent-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.recent-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text);
}

.recent-price {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-primary);
}

.recent-location {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
