<script setup lang="ts">
import { ref } from 'vue'
import HomeWelcome from './components/HomeWelcome.vue'
import HomeRecommendations from './components/HomeRecommendations.vue'
import HomeTrends from './components/HomeTrends.vue'
import HomeSidebar from './components/HomeSidebar.vue'

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
</script>

<template>
  <div class="home-view">
    <!-- Welcome Section -->
    <HomeWelcome :user-name="userName" />

    <div class="container content-grid">
      <!-- Main Content -->
      <div class="main-column">
        <!-- Recommendations Carousel/Grid -->
        <HomeRecommendations :items="recommendations" />

        <!-- Market Trends -->
        <HomeTrends />
      </div>

      <!-- Sidebar -->
      <HomeSidebar :recent-items="recentViews" />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  height: 100%; /* Fill parent height */
  overflow-y: auto; /* Enable vertical scrolling */
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
</style>
