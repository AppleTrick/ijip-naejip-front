<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const currentSection = ref(0)
const isScrolling = ref(false)

const sections = [
  { id: 0, title: 'Hero', bgClass: 'bg-hero' },
  { id: 1, title: 'Problem', bgClass: 'bg-problem' },
  { id: 2, title: 'Solution', bgClass: 'bg-solution' },
  { id: 3, title: 'CTA', bgClass: 'bg-cta' }
]

const handleScroll = (e: WheelEvent) => {
  if (isScrolling.value) return
  
  isScrolling.value = true
  if (e.deltaY > 0 && currentSection.value < sections.length - 1) {
    currentSection.value++
  } else if (e.deltaY < 0 && currentSection.value > 0) {
    currentSection.value--
  }
  
  setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

const scrollTo = (index: number) => {
  currentSection.value = index
}

const startJourney = () => {
  router.push('/home')
}

onMounted(() => {
  window.addEventListener('wheel', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleScroll)
})
</script>

<template>
  <div class="landing-v2">
    <!-- Navigation Dots -->
    <div class="nav-dots">
      <button 
        v-for="(section, index) in sections" 
        :key="section.id"
        class="dot"
        :class="{ active: currentSection === index }"
        @click="scrollTo(index)"
      >
        <span class="dot-label">{{ section.title }}</span>
      </button>
    </div>

    <!-- Sections -->
    <div class="sections-container" :style="{ transform: `translateY(-${currentSection * 100}vh)` }">
      
      <!-- 1. Hero Section -->
      <section class="section hero-section">
        <div class="bg-image hero-bg"></div>
        <div class="overlay"></div>
        <div class="content center-content">
          <div class="brand-badge">
            <span class="badge-text">PREMIUM REAL ESTATE</span>
          </div>
          <h1 class="main-title">
            <span class="reveal-text" :class="{ visible: currentSection === 0 }">이집내집</span>
          </h1>
          <p class="subtitle">
            <span class="reveal-text delay-1" :class="{ visible: currentSection === 0 }">
              당신의 품격에 맞는<br>단 하나의 선택
            </span>
          </p>
          <div class="scroll-indicator" @click="scrollTo(1)">
            <span class="scroll-text">SCROLL</span>
            <ChevronDown class="scroll-icon" />
          </div>
        </div>
      </section>

      <!-- 2. Problem Section -->
      <section class="section problem-section">
        <div class="bg-color"></div>
        <div class="content split-content">
          <div class="text-block">
            <h2 class="section-title">
              <span class="reveal-text" :class="{ visible: currentSection === 1 }">
                집을 구하는 것은<br>두려운 일입니다.
              </span>
            </h2>
            <p class="section-desc">
              <span class="reveal-text delay-1" :class="{ visible: currentSection === 1 }">
                허위 매물, 전세 사기, 불투명한 시세.<br>
                당신의 소중한 자산을 위협하는 요소들이 너무나 많습니다.
              </span>
            </p>
          </div>
          <div class="visual-block">
            <div class="card glass-card" :class="{ visible: currentSection === 1 }">
              <div class="card-icon">⚠️</div>
              <h3>Risk</h3>
              <p>불안한 거래</p>
            </div>
            <div class="card glass-card delay-1" :class="{ visible: currentSection === 1 }">
              <div class="card-icon">📉</div>
              <h3>Loss</h3>
              <p>금전적 손실</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Solution Section -->
      <section class="section solution-section">
        <div class="bg-image solution-bg"></div>
        <div class="overlay dark"></div>
        <div class="content center-content">
          <h2 class="section-title white">
            <span class="reveal-text" :class="{ visible: currentSection === 2 }">
              하지만, 이집내집이라면<br>다릅니다.
            </span>
          </h2>
          <div class="features-grid">
            <div class="feature-item" :class="{ visible: currentSection === 2 }">
              <span class="feature-num">01</span>
              <h3>AI 안전 분석</h3>
              <p>빅데이터 기반 등기부등본 분석으로<br>위험 요소를 사전에 차단합니다.</p>
            </div>
            <div class="feature-item delay-1" :class="{ visible: currentSection === 2 }">
              <span class="feature-num">02</span>
              <h3>실거래가 투명 공개</h3>
              <p>국토부 실거래가 데이터를 바탕으로<br>정확한 시세를 제공합니다.</p>
            </div>
            <div class="feature-item delay-2" :class="{ visible: currentSection === 2 }">
              <span class="feature-num">03</span>
              <h3>프리미엄 매물</h3>
              <p>엄선된 하이엔드 매물만을<br>큐레이션하여 제안합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CTA Section -->
      <section class="section cta-section">
        <div class="bg-color light"></div>
        <div class="content center-content">
          <h2 class="final-title">
            <span class="reveal-text" :class="{ visible: currentSection === 3 }">
              지금 바로,<br>안전한 여정을 시작하세요.
            </span>
          </h2>
          <button class="cta-button" @click="startJourney">
            <span class="btn-text">매물 보러가기</span>
            <ArrowRight class="btn-icon" />
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.landing-v2 {
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #000;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
}

.sections-container {
  height: 100vh;
  transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1.000); /* cubic-bezier for smooth scroll */
}

.section {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Backgrounds */
.bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transform: scale(1.1);
  transition: transform 10s ease;
}

.section:hover .bg-image {
  transform: scale(1);
}

.hero-bg {
  background-image: url('@/assets/landing-v2-bg-1.png');
}

.solution-bg {
  background-image: url('@/assets/landing-v2-bg-2.png');
}

.bg-color {
  position: absolute;
  inset: 0;
  background-color: #111;
  z-index: 0;
}

.bg-color.light {
  background-color: #fff;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  z-index: 1;
}

.overlay.dark {
  background: rgba(0,0,0,0.6);
}

/* Content Layout */
.content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
}

.center-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.split-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

/* Typography & Animations */
.brand-badge {
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: fadeInDown 1s ease forwards 0.5s;
}

.badge-text {
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  font-weight: 300;
}

.main-title {
  font-size: 6rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  opacity: 0.9;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.section-title.white {
  color: #fff;
}

.section-desc {
  font-size: 1.25rem;
  color: #888;
  line-height: 1.6;
}

.final-title {
  font-size: 4rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 3rem;
  line-height: 1.2;
}

/* Reveal Animation */
.reveal-text {
  display: block;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.reveal-text.visible {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 { transition-delay: 0.2s; }
.delay-2 { transition-delay: 0.4s; }

/* Visual Elements */
.visual-block {
  display: flex;
  gap: 2rem;
}

.glass-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  width: 200px;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.glass-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
}

.feature-item {
  text-align: left;
  padding: 2rem;
  border-top: 1px solid rgba(255,255,255,0.2);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.feature-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-num {
  display: block;
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-family: monospace;
}

/* CTA Button */
.cta-button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 1.5rem 4rem;
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: scale(1.05);
  background-color: var(--color-primary);
}

/* Navigation Dots */
.nav-dots {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.dot.active {
  background-color: #fff;
  transform: scale(1.2);
}

.dot-label {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.dot:hover .dot-label {
  opacity: 1;
}

.scroll-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  animation: bounce 2s infinite;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-text {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-title { font-size: 3rem; }
  .split-content { flex-direction: column; gap: 2rem; }
  .features-grid { grid-template-columns: 1fr; gap: 1rem; }
  .nav-dots { display: none; }
}
</style>
