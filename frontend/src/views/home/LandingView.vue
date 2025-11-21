<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { Shield, Map, Scale } from 'lucide-vue-next'

const router = useRouter()

const navigateToMap = () => {
  router.push('/map')
}
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          당신의 안전한 보금자리,<br>
          <span class="highlight">SafeHome</span>에서 찾으세요
        </h1>
        <p class="hero-subtitle">
          빅데이터 기반 전세사기 예방 분석과 실거래가 정보를 한눈에.<br>
          안심하고 살 수 있는 집, SafeHome이 함께합니다.
        </p>
        <div class="hero-actions">
          <BaseButton 
            variant="primary" 
            size="lg" 
            class="cta-button"
            @click="navigateToMap"
          >
            지도에서 매물 찾기
          </BaseButton>
          <BaseButton 
            variant="outline" 
            size="lg" 
            class="cta-button"
            @click="router.push('/analysis')"
          >
            전세사기 위험도 확인
          </BaseButton>
        </div>
      </div>
      <div class="hero-image">
        <!-- Abstract geometric shapes or illustration could go here -->
        <div class="circle-bg"></div>
        <div class="floating-card card-1">
          <Shield class="icon" />
          <span>안전 등급 A</span>
        </div>
        <div class="floating-card card-2">
          <Map class="icon" />
          <span>실거래가 조회</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">주요 기능</h2>
        <p class="section-subtitle">SafeHome만의 특별한 서비스를 경험해보세요</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="icon-wrapper">
            <Map class="feature-icon" />
          </div>
          <h3 class="feature-title">매물 지도</h3>
          <p class="feature-description">
            지도 위에서 실시간 매물 정보와 주변 환경을 직관적으로 확인하세요.
          </p>
        </div>

        <div class="feature-card">
          <div class="icon-wrapper">
            <Shield class="feature-icon" />
          </div>
          <h3 class="feature-title">전세사기 예방</h3>
          <p class="feature-description">
            빅데이터 분석을 통해 전세사기 위험도를 진단하고 안전한 거래를 돕습니다.
          </p>
        </div>

        <div class="feature-card">
          <div class="icon-wrapper">
            <Scale class="feature-icon" />
          </div>
          <h3 class="feature-title">집 비교하기</h3>
          <p class="feature-description">
            관심 있는 매물들을 한눈에 비교하고 최적의 선택을 하세요.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 40rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 12px;
  background-color: rgba(232, 69, 69, 0.1);
  z-index: -1;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.cta-button {
  min-width: 160px;
}

/* Hero Image Area (Abstract) */
.hero-image {
  flex: 1;
  position: relative;
  height: 500px;
  display: none;
}

@media (min-width: 1024px) {
  .hero-image {
    display: block;
  }
}

.circle-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 69, 69, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
}

.floating-card {
  position: absolute;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  animation: float 6s ease-in-out infinite;
}

.card-1 {
  top: 20%;
  right: 20%;
  animation-delay: 0s;
}

.card-2 {
  bottom: 30%;
  left: 10%;
  animation-delay: 2s;
}

.icon {
  color: var(--color-primary);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

/* Features Section */
.features-section {
  padding: 6rem 2rem;
  background-color: var(--color-gray-50);
}

.section-header {
  text-align: center;
  max-width: 80rem;
  margin: 0 auto 4rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--color-gray-200);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  background-color: rgba(232, 69, 69, 0.1);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-primary);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.feature-description {
  color: var(--color-text-light);
  line-height: 1.6;
}
</style>
