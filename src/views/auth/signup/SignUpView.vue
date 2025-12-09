<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSignUp } from '@/composables/useSignUp'
import SignUpStep1 from './components/SignUpStep1.vue'
import SignUpStep2 from './components/SignUpStep2.vue'
// import SignUpStep3 from './components/SignUpStep3.vue'
import SocialLoginButtons from '@/components/features/OAuth/SocialLoginButtons.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const { 
  currentStep, 
  totalSteps, 
  signupData, 
  updateData, 
  nextStep, 
  prevStep, 
  startEmailSignup,
  isSocialSignup,
  submitSocialSignup,
  socialId,
  socialType,
  needsEmail
} = useSignUp()

// 소셜 회원가입 모드 체크
if (route.path === '/signup/social') {
  isSocialSignup.value = true
  
  if (route.query.needsEmail === 'true') {
    needsEmail.value = true
    socialId.value = route.query.socialId as string
    socialType.value = route.query.socialType as string
    currentStep.value = 1 // 이메일 입력부터 시작
  } else {
    currentStep.value = 2 // 바로 추가 정보 입력 단계로
  }
}

const handleStep2Submit = () => {
  if (isSocialSignup.value) {
    submitSocialSignup()
  } else {
    nextStep()
  }
}
</script>

<template>
  <div class="signup-page">
    <div class="split-layout">
      <!-- Left Side: Form -->
      <div class="form-section">
        <div class="form-container">
          
          <!-- Step 0: Selection -->
          <div v-if="currentStep === 0" class="selection-step">
            <div class="signup-header">
              <h2 class="signup-title">환영합니다!</h2>
              <p class="signup-subtitle">이집내집과 함께 안전한 집을 찾아보세요.</p>
            </div>

            <div class="selection-content">
              <SocialLoginButtons show-divider />
              
              <BaseButton 
                variant="outline" 
                full-width
                class="email-signup-btn"
                @click="startEmailSignup"
              >
                이메일로 회원가입
              </BaseButton>

              <div class="login-link-section">
                <span class="login-text">이미 계정이 있으신가요?</span>
                <router-link to="/login" class="login-link">
                  로그인하기
                </router-link>
              </div>
            </div>
          </div>

          <!-- Steps 1~2 -->
          <div v-else class="signup-header">
            <h2 class="signup-title">
              {{ isSocialSignup ? '추가 정보 입력' : '회원가입' }}
            </h2>
            
            <div v-if="!isSocialSignup" class="step-indicator">
              <div 
                v-for="step in totalSteps" 
                :key="step"
                class="step-dot"
                :class="{ active: step <= currentStep }"
              ></div>
            </div>
          </div>

          <!-- Steps -->
          <div v-if="currentStep > 0" class="signup-form">
            <SignUpStep1 
              v-if="currentStep === 1"
              :data="signupData"
              :is-social-signup="isSocialSignup"
              @update="(d) => updateData(1, d)"
              @next="nextStep"
            />
            <SignUpStep2 
              v-if="currentStep === 2"
              :data="signupData.personalInfo"
              @update="(d) => updateData(2, d)"
              @next="handleStep2Submit"
              @prev="prevStep"
            />
          </div>

        </div>
      </div>

      <!-- Right Side: Image -->
      <div class="image-section">
        <div class="image-overlay">
          <div class="overlay-content">
            <h3 class="overlay-title">Start Your Journey</h3>
            <p class="overlay-desc">
              빅데이터 기반 안전도 분석으로<br>
              당신에게 딱 맞는 안전한 집을 찾아드립니다.
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
  padding-top: 1rem; /* Reduced from 2rem */
  padding-bottom: 1rem; /* Reduced from 2rem */
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem; /* Reduced from 3rem */
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
  margin-bottom: 1.5rem; /* Reduced from 2rem */
}

.social-login-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-gray-400);
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-gray-200);
}

.divider span {
  padding: 0 1rem;
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

.selection-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.email-signup-btn {
  height: 3.5rem;
  font-size: 1rem;
}

.step-indicator {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.step-dot {
  width: 2rem;
  height: 0.25rem;
  background-color: var(--color-gray-200);
  border-radius: 9999px;
  transition: all 0.3s;
}

.step-dot.active {
  background-color: var(--color-primary);
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

.login-link-section {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.login-text {
  color: var(--color-text-light);
}

.login-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
