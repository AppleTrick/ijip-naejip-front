<template>
  <div class="background-wrapper">
    <div class="particles">
      <div class="particle" v-for="n in 30" :key="n" :style="{ 
        left: `${Math.random() * 100}%`, 
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      }"></div>
    </div>
  </div>
</template>

<style scoped>
.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-primary-transparent-10) 0%, var(--color-primary-transparent-10) 100%);
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.5), transparent);
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
</style>
