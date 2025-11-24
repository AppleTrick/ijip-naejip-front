<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Activity, FileText, AlertTriangle, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-vue-next'

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const recentChecks = ref([
  { id: 1, location: '서울시 강남구 역삼동', status: 'SAFE', time: '방금 전' },
  { id: 2, location: '서울시 관악구 신림동', status: 'WARNING', time: '2분 전' },
  { id: 3, location: '서울시 마포구 서교동', status: 'SAFE', time: '5분 전' },
  { id: 4, location: '서울시 강서구 화곡동', status: 'DANGER', time: '12분 전' },
])

const stats = ref({
  todayCount: 124,
  safeRate: 82
})

// Simple counter animation simulation
onMounted(() => {
  setInterval(() => {
    if (Math.random() > 0.7) {
      stats.value.todayCount++
    }
  }, 5000)
})
</script>

<template>
  <div class="map-overlay" :class="{ 'is-collapsed': isCollapsed }">
    <!-- Toggle Button -->
    <button @click="toggleCollapse" class="toggle-btn" :title="isCollapsed ? '정보 펼치기' : '정보 접기'">
      <Eye v-if="isCollapsed" class="w-5 h-5" />
      <EyeOff v-else class="w-5 h-5" />
      <span v-if="isCollapsed" class="toggle-text">안전 분석 현황 보기</span>
      <span v-else class="toggle-text">정보 숨기기</span>
    </button>

    <div v-show="!isCollapsed" class="overlay-content">
      <!-- Stats Card -->
      <div class="overlay-card stats-card">
        <div class="card-header">
          <div class="icon-box">
            <Activity class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 class="card-title">실시간 분석 현황</h3>
            <p class="card-subtitle">오늘 {{ stats.todayCount }}건의 매물이 분석되었습니다</p>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">안전 매물 비율</span>
            <span class="stat-value text-safe">{{ stats.safeRate }}%</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">평균 소요 시간</span>
            <span class="stat-value">3초</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="overlay-card recent-card">
        <h3 class="section-title">최근 안전도 조회</h3>
        <div class="activity-list">
          <div v-for="check in recentChecks" :key="check.id" class="activity-item">
            <div class="activity-icon">
              <MapPin class="w-4 h-4" />
            </div>
            <div class="activity-info">
              <span class="location">{{ check.location }}</span>
              <span class="time">{{ check.time }}</span>
            </div>
            <div class="status-badge" :class="check.status.toLowerCase()">
              {{ check.status === 'SAFE' ? '안전' : check.status === 'WARNING' ? '주의' : '위험' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Guide Card -->
      <div class="overlay-card guide-card">
        <h3 class="section-title">무엇을 분석하나요?</h3>
        <div class="guide-steps">
          <div class="step-item">
            <div class="step-icon bg-blue-50 text-blue-600">
              <FileText class="w-5 h-5" />
            </div>
            <div class="step-content">
              <span class="step-title">등기부등본 권리분석</span>
              <span class="step-desc">근저당, 가압류 등 위험요소 확인</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-icon bg-green-50 text-green-600">
              <CheckCircle2 class="w-5 h-5" />
            </div>
            <div class="step-content">
              <span class="step-title">건축물대장 확인</span>
              <span class="step-desc">위반건축물, 불법용도 변경 여부</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-icon bg-red-50 text-red-600">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div class="step-content">
              <span class="step-title">전세가율(깡통전세) 진단</span>
              <span class="step-desc">매매가 대비 전세가 적정성 분석</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-overlay {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 300px;
  max-width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 20;
  pointer-events: none; /* Let clicks pass through to map where possible */
  transition: all 0.3s ease;
}

.map-overlay.is-collapsed {
  width: auto;
  align-items: flex-end;
}

.toggle-btn {
  pointer-events: auto;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 2rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.875rem;
  align-self: flex-end; /* Align button to right */
}

.toggle-btn:hover {
  background-color: var(--color-gray-100);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.1);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.overlay-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  pointer-events: auto; /* Re-enable clicks for cards */
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stats-card { animation-delay: 0.1s; }
.recent-card { animation-delay: 0.2s; }
.guide-card { animation-delay: 0.3s; }

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.icon-box {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  background-color: var(--color-primary-light, rgba(144, 55, 73, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.stats-grid {
  display: flex;
  align-items: center;
  background-color: var(--color-gray-100);
  padding: 1rem;
  border-radius: 1rem;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background-color: var(--color-gray-200);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  font-weight: 600;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-text);
}

.text-safe { color: var(--color-primary); }

/* Recent Activity */
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: 0.75rem;
  transition: transform 0.2s;
}

.activity-item:hover {
  transform: translateX(4px);
  border-color: var(--color-primary);
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.location {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.time {
  font-size: 0.75rem;
  color: var(--color-gray-400);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.status-badge.safe { background-color: rgba(144, 55, 73, 0.1); color: var(--color-primary); }
.status-badge.warning { background-color: #fef9c3; color: #ca8a04; }
.status-badge.danger { background-color: #fee2e2; color: #dc2626; }

/* Guide Steps */
.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
}

.step-desc {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  line-height: 1.4;
}
</style>
