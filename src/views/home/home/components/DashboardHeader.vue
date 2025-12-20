<script setup lang="ts">
import { Bell, MapPin, TrendingUp } from 'lucide-vue-next'

defineProps<{
  userName: string
}>()
</script>

<template>
  <div class="dashboard-header">
    <div class="header-content">
      <div class="user-welcome">
        <h1 class="welcome-title">
          안녕하세요, <span class="highlight">{{ userName }}</span>님
        </h1>
        <p class="welcome-subtitle">
          오늘도 안전한 하루 되세요.
        </p>
      </div>
      
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon-wrapper blue">
            <MapPin class="stat-icon" />
          </div>
          <div class="stat-info">
            <span class="stat-label">관심 지역</span>
            <span class="stat-value">강남구</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-wrapper red">
            <Bell class="stat-icon" />
          </div>
          <div class="stat-info">
            <span class="stat-label">새 알림</span>
            <span class="stat-value">3건</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper green">
            <TrendingUp class="stat-icon" />
          </div>
          <div class="stat-info">
            <span class="stat-label">시세 변동</span>
            <span class="stat-value text-up">▲ 0.5%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg, var(--color-white) 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-gray-100);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.highlight {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: var(--color-primary-transparent-10);
  z-index: -1;
}

.welcome-subtitle {
  color: var(--color-text-light);
  font-size: 1rem;
}

.quick-stats {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem; /* For scrollbar */
}

.stat-card {
  background-color: var(--color-white);
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 160px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid var(--color-gray-100);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.blue { background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.stat-icon-wrapper.red { background-color: rgba(239, 68, 68, 0.1); color: #ef4444; }
.stat-icon-wrapper.green { background-color: rgba(16, 185, 129, 0.1); color: #10b981; }

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 700;
  color: var(--color-text);
  font-size: 1rem;
}

.text-up {
  color: #ef4444;
}
</style>
