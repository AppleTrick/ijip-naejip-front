<script setup lang="ts">
import SignUpForm from './components/SignUpForm.vue'
</script>

<template>
  <div class="signup-page">
    <div class="split-layout">
      <!-- Left Side: Form -->
      <div class="form-section">
        <div class="form-container">
          <div class="brand-header">
            <img src="@/assets/logo.png" alt="이집내집" class="brand-logo" />
            <span class="brand-name">이집내집</span>
          </div>
          
          <div class="signup-header">
            <h2 class="signup-title">
              회원가입
            </h2>
            <p class="signup-subtitle">
              SafeHome과 함께 안전한 집을 찾아보세요
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>

      <!-- Right Side: Image -->
      <div class="image-section">
        <div class="image-overlay">
          <div class="overlay-content">
            <h3 class="overlay-title">Join Our Community</h3>
            <p class="overlay-desc">
              이미 10,000명 이상의 사용자가<br>
              이집내집을 통해 안전한 집을 찾았습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
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
  overflow-y: auto; /* Allow scrolling if form is long */
}

.form-container {
  width: 100%;
  max-width: 28rem;
  animation: slideInLeft 0.5s ease-out;
  padding-top: 2rem;
  padding-bottom: 2rem;
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

.signup-header {
  margin-bottom: 2.5rem;
}

.signup-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.signup-subtitle {
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
</style>
