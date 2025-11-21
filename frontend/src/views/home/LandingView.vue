<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { Shield, Map, Scale, TrendingUp, Users, CheckCircle, Home, BarChart3, Award } from 'lucide-vue-next'

const router = useRouter()

const navigateToMap = () => {
  router.push('/map')
}

// Event handlers with proper typing
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

// Animated statistics
const stats = ref([
  { value: 0, target: 15000, label: '분석된 매물', suffix: '+', icon: Home },
  { value: 0, target: 98, label: '사기 예방률', suffix: '%', icon: Shield },
  { value: 0, target: 25000, label: '안심 회원', suffix: '+', icon: Users },
  { value: 0, target: 4.9, label: '평점', suffix: '/5.0', icon: Award, decimal: true }
])

const animateValue = (index: number) => {
  const stat = stats.value[index]
  const duration = 2000
  const steps = 60
  const increment = stat.target / steps
  const stepDuration = duration / steps
  
  let currentValue = 0
  const timer = setInterval(() => {
    currentValue += increment
    if (currentValue >= stat.target) {
      stat.value = stat.target
      clearInterval(timer)
    } else {
      stat.value = stat.decimal ? Math.round(currentValue * 10) / 10 : Math.floor(currentValue)
    }
  }, stepDuration)
}

onMounted(() => {
  // Animate stats when component mounts with staggered delay
  stats.value.forEach((_, index) => {
    setTimeout(() => animateValue(index), index * 200)
  })
})
</script>

<template>
  <div class="landing-page">
    <!-- Animated Background -->
    <div class="background-gradient"></div>
    <div class="particles">
      <div class="particle" v-for="n in 30" :key="n" :style="{ 
        left: `${Math.random() * 100}%`, 
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      }"></div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="badge">
          <CheckCircle :size="16" />
          <span>전세사기 ZERO 프로젝트</span>
        </div>
        <h1 class="hero-title">
          당신의 안전한 보금자리,<br>
          <span class="highlight">SafeHome</span><span class="gradient-text">에서 찾으세요</span>
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

    <!-- Features Section -->
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

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card" v-for="(stat, index) in stats" :key="index">
          <component :is="stat.icon" class="stat-card-icon" :size="32" />
          <div class="stat-card-value">
            {{ stat.decimal ? stat.value.toFixed(1) : stat.value.toLocaleString() }}{{ stat.suffix }}
          </div>
          <div class="stat-card-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">지금 바로 시작하세요</h2>
        <p class="cta-subtitle">SafeHome과 함께 안전한 주거 생활을 경험해보세요</p>
        <div class="cta-actions">
          <BaseButton 
            variant="primary" 
            size="lg" 
            class="cta-main-button"
            @click="navigateToMap"
          >
            무료로 시작하기
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
  position: relative;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
}

/* Animated Background */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(232, 69, 69, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(144, 55, 73, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(83, 53, 74, 0.05) 0%, transparent 50%);
  animation: gradientShift 15s ease infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(232, 69, 69, 0.5), transparent);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

/* Hero Section */
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

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.1), rgba(144, 55, 73, 0.1));
  border: 1px solid rgba(232, 69, 69, 0.2);
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
}

.highlight {
  background: linear-gradient(135deg, #E84545 0%, #903749 100%);
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

.gradient-text-alt {
  background: linear-gradient(135deg, #E84545 0%, #903749 100%);
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
  border: 1px solid rgba(232, 69, 69, 0.2);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(232, 69, 69, 0.2);
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
  border: 1px solid rgba(232, 69, 69, 0.1);
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
  background: linear-gradient(135deg, #E84545, #903749);
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
  box-shadow: 0 30px 60px -12px rgba(232, 69, 69, 0.3);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(232, 69, 69, 0.1), transparent 70%);
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

/* Features Section */
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
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.1), rgba(144, 55, 73, 0.1));
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
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.05), rgba(144, 55, 73, 0.05));
  border-color: rgba(232, 69, 69, 0.2);
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, #E84545, #903749);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(232, 69, 69, 0.3);
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

.feature-card.hovered .feature-icon {
  transform: scale(1.2);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.875rem;
  background: rgba(232, 69, 69, 0.08);
  color: var(--color-primary);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(232, 69, 69, 0.15);
}

/* Stats Section */
.stats-section {
  position: relative;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #2B2E4A 0%, #53354A 100%);
  z-index: 1;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.stat-card-icon {
  color: #E84545;
  margin: 0 auto 1rem;
}

.stat-card-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-card-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  position: relative;
  padding: 8rem 2rem;
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.05), rgba(144, 55, 73, 0.05));
  z-index: 1;
}

.cta-content {
  text-align: center;
  max-width: 50rem;
  margin: 0 auto;
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.cta-subtitle {
  font-size: 1.375rem;
  color: var(--color-text-light);
  margin-bottom: 3rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
}

.cta-main-button {
  min-width: 240px;
  font-size: 1.125rem;
  padding: 1.25rem 2.5rem;
  box-shadow: 0 20px 40px rgba(232, 69, 69, 0.3);
  transition: all 0.3s ease;
}

.cta-main-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(232, 69, 69, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
</style>
