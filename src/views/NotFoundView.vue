<template>
  <div class="not-found-container">
    <div class="content">
      <h1 class="text-3d" data-text="404">404</h1>
      <p class="message">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <p class="sub-message">존재하지 않는 주소를 입력하셨거나,<br>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
      <button @click="goHome" class="home-button">
        홈으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
  font-family: 'Inter', sans-serif;
}

.content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.text-3d {
  font-size: 12rem;
  font-weight: 900;
  color: var(--color-primary);
  margin: 0;
  line-height: 1;
  position: relative;
  text-transform: uppercase;
  /* 3D Text Effect - Red Theme */
  text-shadow: 
    0 1px 0 var(--color-primary-hover),
    0 2px 0 var(--color-primary-hover),
    0 3px 0 var(--color-primary-hover),
    0 4px 0 var(--color-primary-hover),
    0 5px 0 var(--color-primary-hover),
    0 6px 0 var(--color-primary-hover),
    0 7px 0 var(--color-primary-hover),
    0 8px 0 var(--color-primary-hover),
    0 9px 0 var(--color-secondary), /* Depth */
    0 10px 10px rgba(0, 0, 0, 0.3);
  
  animation: float 3s ease-in-out infinite;
}

.message {
  font-size: 1.8rem;
  color: var(--color-text);
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.sub-message {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.home-button {
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-white);
  background: var(--color-primary);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px var(--color-primary-transparent-30), 0 2px 4px -1px var(--color-primary-transparent-30);
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px var(--color-primary-transparent-30), 0 4px 6px -2px var(--color-primary-transparent-30);
  background: var(--color-primary-hover);
}

.home-button:active {
  transform: translateY(0);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-3d {
    font-size: 8rem;
  }
  
  .message {
    font-size: 1.4rem;
  }
  
  .sub-message {
    font-size: 1rem;
    padding: 0 1rem;
  }
}
</style>
