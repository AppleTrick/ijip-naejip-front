<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next'
import BaseCard from '@/components/common/BaseCard.vue'
</script>

<template>
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">
        <TrendingUp class="icon" /> 관심 지역 시세 트렌드
      </h2>
    </div>
    <BaseCard class="trend-card">
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
    </BaseCard>
  </section>
</template>

<style scoped>
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

.trend-card {
  padding: 1.5rem;
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
  background: linear-gradient(180deg, var(--color-primary-transparent-10) 0%, rgba(255, 255, 255, 0) 100%);
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
</style>
