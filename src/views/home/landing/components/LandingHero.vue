<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { Shield, Map, CheckCircle, TrendingUp, BarChart3 } from 'lucide-vue-next'

defineProps<{
  stats: any[]
}>()

const router = useRouter()

const navigateToMap = () => {
  router.push('/map')
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <div class="brand-header">
        <img src="@/assets/logo.png" alt="이집내집" class="brand-logo-img" />
        <span class="brand-name">이집내집</span>
      </div>
      <div class="badge">
        <CheckCircle :size="16" />
        <span>전세사기 ZERO 프로젝트</span>
      </div>
      <h1 class="hero-title">
        당신의 안전한 보금자리 <span class="highlight">이집내집</span><span class="gradient-text">에서 찾으세요</span>
      </h1>
      <p class="hero-subtitle">
        빅데이터 기반 전세사기 예방 분석과 실거래가 정보를 한눈에.<br>
        <span class="emphasize">AI가 분석</span>한 안전도로 안심하고 살 수 있는 집을 찾으세요.
      </p>
      <div class="hero-actions">
        <BaseButton 
          variant="primary" 
          size="lg" 
          class="cta-button primary-glow"
          @click="navigateToMap"
        >
          <Map :size="20" />
          지도에서 매물 찾기
        </BaseButton>
        <BaseButton 
          variant="outline" 
          size="lg" 
          class="cta-button glass-button"
          @click="router.push('/analysis')"
        >
          <Shield :size="20" />
          전세사기 위험도 확인
        </BaseButton>
      </div>
      
      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-item" v-for="(stat, index) in stats.slice(0, 3)" :key="index">
          <component :is="stat.icon" class="stat-icon" :size="20" />
          <div class="stat-value">{{ stat.decimal ? stat.value.toFixed(1) : stat.value.toLocaleString() }}{{ stat.suffix }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
    
    <div class="hero-visual">
      <!-- Glassmorphism Cards -->
      <div class="glass-orb orb-1"></div>
      <div class="glass-orb orb-2"></div>
      
      <div class="floating-card card-1">
        <div class="card-glow"></div>
        <Shield class="card-icon" :size="28" />
        <div class="card-content">
          <div class="card-title">안전 등급 A</div>
          <div class="card-subtitle">위험도 분석 완료</div>
        </div>
        <div class="card-badge success">✓</div>
      </div>
      
      <div class="floating-card card-2">
        <div class="card-glow"></div>
        <TrendingUp class="card-icon" :size="28" />
        <div class="card-content">
          <div class="card-title">실거래가 조회</div>
          <div class="card-subtitle">최신 시세 정보</div>
        </div>
        <div class="card-badge info">NEW</div>
      </div>
      
      <div class="floating-card card-3">
        <div class="card-glow"></div>
        <BarChart3 class="card-icon" :size="28" />
        <div class="card-content">
          <div class="card-title">비교 분석</div>
          <div class="card-subtitle">스마트 비교</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 2rem 4rem;
  max-width: 80rem;
  margin: 0 auto;
  gap: 4rem;
  z-index: 1;
}

.hero-content {
  flex: 1;
  max-width: 42rem;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.brand-logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--color-primary-transparent-10), var(--color-primary-transparent-10));
  border: 1px solid var(--color-primary-transparent-20);
  border-radius: 2rem;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  word-break: keep-all; /* Prevent awkward word breaks */
}

.highlight {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.gradient-text {
  background: linear-gradient(135deg, #2B2E4A 0%, #53354A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.375rem;
  color: var(--color-text-light);
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.emphasize {
  color: var(--color-primary);
  font-weight: 700;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.cta-button {
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  transition: all 0.3s ease;
}

.primary-glow {
  position: relative;
  overflow: hidden;
}

.primary-glow::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.glass-button {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-primary-transparent-20);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px var(--color-primary-transparent-20);
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid var(--color-primary-transparent-10);
}

.stat-item {
  text-align: center;
}

.stat-icon {
  color: var(--color-primary);
  margin: 0 auto 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  font-weight: 500;
}

/* Hero Visual */
.hero-visual {
  flex: 1;
  position: relative;
  height: 600px;
  display: none;
}

@media (min-width: 1024px) {
  .hero-visual {
    display: block;
  }
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: orb-float 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  top: 10%;
  right: 10%;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #53354A, #2B2E4A);
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: card-float 6s ease-in-out infinite;
  transition: all 0.3s ease;
  overflow: hidden;
}

.floating-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 30px 60px -12px var(--color-primary-transparent-30);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--color-primary-transparent-10), transparent 70%);
  animation: glow-rotate 4s linear infinite;
}

@keyframes glow-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-1 {
  top: 15%;
  right: 15%;
  animation-delay: 0s;
}

.card-2 {
  top: 50%;
  right: 5%;
  animation-delay: 2s;
}

.card-3 {
  bottom: 15%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes card-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(2deg); }
}

.card-icon {
  color: var(--color-primary);
  flex-shrink: 0;
  z-index: 1;
}

.card-content {
  z-index: 1;
}

.card-title {
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  font-size: 1.125rem;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.card-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 1;
}

.card-badge.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.card-badge.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}
</style>
