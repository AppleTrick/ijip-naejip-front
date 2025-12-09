<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'
import SocialLoginButtons from '@/components/features/OAuth/SocialLoginButtons.vue'
</script>

<template>
  <div class="login-page">
    <div class="split-layout">
      <!-- Left Side: Form -->
      <div class="form-section">
        <div class="form-container">
          <div class="login-header">
            <h2 class="login-title">
              환영합니다!
            </h2>
            <p class="login-subtitle">
              안전한 보금자리 찾기, 이집내집과 함께하세요.
            </p>
          </div>
          <LoginForm />
          
          <div class="social-login-section">
            <SocialLoginButtons show-divider />
          </div>

          <div class="signup-link-section">
            <span class="signup-text">아직 계정이 없으신가요?</span>
            <router-link to="/signup" class="signup-link">
              회원가입하기
            </router-link>
          </div>
        </div>
      </div>

      <!-- Right Side: Image -->
      <div class="image-section">
        <div class="image-overlay">
          <div class="overlay-content">
            <h3 class="overlay-title">Smart & Safe</h3>
            <p class="overlay-desc">
              투명한 실거래가 정보와 AI 전세사기 위험성 검증으로<br>
              안심할 수 있는 내 집 마련을 도와드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  background-color: var(--color-white);
  overflow: hidden;
}

.split-layout {
  display: flex;
  height: 100%;
}

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-white);
}

.form-container {
  width: 100%;
  max-width: 28rem;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.brand-logo {
  width: 32px;
  height: 32px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
}

.login-header {
  margin-bottom: 2.5rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--color-text-light);
  line-height: 1.5;
}

.image-section {
  display: none;
  flex: 1.2;
  background-image: url('@/assets/auth-bg.png');
  background-size: cover;
  background-position: center;
  position: relative;
}

@media (min-width: 1024px) {
  .image-section {
    display: block;
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 4rem;
}

.overlay-content {
  color: white;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.overlay-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.overlay-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  opacity: 0.9;
}
.social-login-section {
  margin-top: 2rem;
}

.signup-link-section {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.signup-text {
  color: var(--color-text-light);
}

.signup-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.signup-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
