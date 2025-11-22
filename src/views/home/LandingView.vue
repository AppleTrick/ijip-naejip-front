<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Shield, Users, Home, Award } from 'lucide-vue-next'
import LandingBackground from './components/LandingBackground.vue'
import LandingHero from './components/LandingHero.vue'
import LandingFeatures from './components/LandingFeatures.vue'
import LandingStats from './components/LandingStats.vue'
import LandingCTA from './components/LandingCTA.vue'

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
    <LandingBackground />
    <LandingHero :stats="stats" />
    <LandingFeatures />
    <LandingStats :stats="stats" />
    <LandingCTA />
  </div>
</template>

<style scoped>
.landing-page {
  width: 100%;
  height: 100%; /* Fill the fixed main-content */
  overflow-y: auto; /* Enable internal scrolling */
  position: relative;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
}
</style>
