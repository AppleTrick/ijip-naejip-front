<script setup lang="ts">
import { Map, Shield, Scale } from 'lucide-vue-next'

const handleMouseEnter = (e: MouseEvent) => {
  if (e.currentTarget instanceof HTMLElement) {
    e.currentTarget.classList.add('hovered')
  }
}

const handleMouseLeave = (e: MouseEvent) => {
  if (e.currentTarget instanceof HTMLElement) {
    e.currentTarget.classList.remove('hovered')
  }
}
</script>

<template>
  <section class="features-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="gradient-text-alt">SafeHome</span>만의 특별한 서비스
      </h2>
      <p class="section-subtitle">빅데이터와 AI 기술로 당신의 안전한 주거를 책임집니다</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card" @mouseenter="handleMouseEnter" 
           @mouseleave="handleMouseLeave">
        <div class="feature-bg"></div>
        <div class="icon-wrapper map-gradient">
          <Map class="feature-icon" />  
        </div>
        <h3 class="feature-title">인터랙티브 매물 지도</h3>
        <p class="feature-description">
          지도 위에서 실시간 매물 정보와 주변 환경을 직관적으로 확인하세요.
          원하는 지역의 모든 정보를 한눈에 파악할 수 있습니다.
        </p>
        <div class="feature-tags">
          <span class="tag">실시간 업데이트</span>
          <span class="tag">상세 필터</span>
        </div>
      </div>

      <div class="feature-card featured" @mouseenter="handleMouseEnter" 
           @mouseleave="handleMouseLeave">
        <div class="featured-badge">BEST</div>
        <div class="feature-bg"></div>
        <div class="icon-wrapper shield-gradient">
          <Shield class="feature-icon" />
        </div>
        <h3 class="feature-title">AI 전세사기 예방 시스템</h3>
        <p class="feature-description">
          빅데이터 분석과 AI 알고리즘으로 전세사기 위험도를 정확하게 진단합니다.
          안전한 거래를 위한 필수 체크리스트를 제공합니다.
        </p>
        <div class="feature-tags">
          <span class="tag">AI 분석</span>
          <span class="tag">위험도 진단</span>
          <span class="tag">실시간 모니터링</span>
        </div>
      </div>

      <div class="feature-card" @mouseenter="handleMouseEnter" 
           @mouseleave="handleMouseLeave">
        <div class="feature-bg"></div>
        <div class="icon-wrapper scale-gradient">
          <Scale class="feature-icon" />
        </div>
        <h3 class="feature-title">스마트 집 비교</h3>
        <p class="feature-description">
          관심 있는 매물들을 다양한 기준으로 비교하고 분석하세요.
          데이터 기반의 현명한 선택을 도와드립니다.
        </p>
        <div class="feature-tags">
          <span class="tag">무제한 비교</span>
          <span class="tag">맞춤 추천</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  position: relative;
  padding: 8rem 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(232, 69, 69, 0.02) 100%);
  z-index: 1;
}

.section-header {
  text-align: center;
  max-width: 80rem;
  margin: 0 auto 5rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
}

.gradient-text-alt {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2.5rem;
  max-width: 80rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  position: relative;
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2rem;
  padding: 2px;
  background: linear-gradient(135deg, var(--color-primary-transparent-10), var(--color-primary-transparent-10));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card.hovered::before {
  opacity: 1;
}

.feature-card.featured {
  background: linear-gradient(135deg, var(--color-primary-transparent-10), var(--color-primary-transparent-10));
  border-color: var(--color-primary-transparent-20);
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 12px var(--color-primary-transparent-30);
}

.feature-bg {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(232, 69, 69, 0.03), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card.hovered .feature-bg {
  opacity: 1;
  animation: rotate-bg 10s linear infinite;
}

@keyframes rotate-bg {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.feature-card.hovered {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(232, 69, 69, 0.25);
}

.icon-wrapper {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  transition: all 0.4s ease;
}

.feature-card.hovered .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.map-gradient {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
}

.shield-gradient {
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.15), rgba(144, 55, 73, 0.15));
}

.scale-gradient {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
}

.feature-icon {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 1rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-gray-100);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-light);
}
</style>
