<script setup lang="ts">
import { ref, computed } from 'vue'
import { Home, Menu, X, LogOut, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref<boolean>(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isAuthInitialized = computed(() => authStore.isAuthInitialized)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  closeMenu()
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-content">
        <!-- Logo -->
        <div class="logo-group" @click="router.push('/')">
          <div class="logo-icon-wrapper">
            <Home class="logo-icon" />
          </div>
          <span class="logo-text">SafeHome</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="desktop-menu">
          <!-- Main Navigation -->
          <div class="nav-links">
            <!-- 홈 링크 비활성화
            <router-link 
              to="/home" 
              class="nav-link" 
              active-class="nav-link--active"
            >
              홈
            </router-link>
            -->
            <router-link 
              to="/map" 
              class="nav-link" 
              active-class="nav-link--active"
            >
              매물 지도
            </router-link>
            <!-- <router-link 
              to="/analysis" 
              class="nav-link" 
              active-class="nav-link--active"
            >
              안전도 분석
            </router-link> -->
            <router-link 
              to="/comparison" 
              class="nav-link" 
              active-class="nav-link--active"
            >
              집 비교하기
            </router-link>
            <!-- <router-link 
              v-if="isAuthenticated"
              to="/survey" 
              class="nav-link" 
              active-class="nav-link--active"
            >
              성향 조사
            </router-link> -->
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <!-- Auth & User -->
          <div class="auth-group">
            <template v-if="isAuthInitialized">
              <template v-if="isAuthenticated">
                <div class="user-info">
                  <span class="user-name">{{ user?.name }}님</span>
                </div>
                <router-link to="/settings" class="icon-btn" title="설정">
                  <Settings class="icon-sm" />
                </router-link>
                <button @click="handleLogout" class="icon-btn" title="로그아웃">
                  <LogOut class="icon-sm" />
                </button>
              </template>
              <template v-else>
                <div class="auth-buttons">
                  <BaseButton 
                    variant="outline" 
                    size="sm" 
                    class="auth-btn"
                    @click="router.push('/login')"
                  >
                    로그인
                  </BaseButton>
                  <BaseButton 
                    variant="primary" 
                    size="sm" 
                    class="auth-btn shadow-btn"
                    @click="router.push('/signup')"
                  >
                    회원가입
                  </BaseButton>
                </div>
              </template>
            </template>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="mobile-menu-btn-wrapper">
          <button @click="toggleMenu" class="mobile-menu-btn">
            <Menu v-if="!isMenuOpen" class="menu-icon" />
            <X v-else class="menu-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMenuOpen" class="mobile-menu">
      <div class="mobile-menu-content">
        <!-- 홈 링크 비활성화
        <router-link 
          to="/home" 
          class="mobile-nav-link"
          active-class="mobile-nav-link--active"
          @click="closeMenu"
        >
          홈
        </router-link>
        -->
        <router-link 
          to="/map" 
          class="mobile-nav-link"
          active-class="mobile-nav-link--active"
          @click="closeMenu"
        >
          매물 지도
        </router-link>
        <!-- <router-link 
          to="/analysis" 
          class="mobile-nav-link"
          active-class="mobile-nav-link--active"
          @click="closeMenu"
        >
          안전도 분석
        </router-link> -->
        <router-link 
          to="/comparison" 
          class="mobile-nav-link"
          active-class="mobile-nav-link--active"
          @click="closeMenu"
        >
          집 비교하기
        </router-link>
        <!-- <router-link 
          v-if="isAuthenticated"
          to="/survey" 
          class="mobile-nav-link"
          active-class="mobile-nav-link--active"
          @click="closeMenu"
        >
          성향 조사
        </router-link> -->
        
        <div class="mobile-divider">
          <template v-if="isAuthInitialized">
            <template v-if="isAuthenticated">
              <div class="mobile-user-info">
                <span class="mobile-user-name">{{ user?.name }}님 안녕하세요</span>
              </div>
              <router-link 
                to="/settings"
                class="mobile-user-link"
                @click="closeMenu"
              >
                <Settings class="mobile-user-icon" />
                설정
              </router-link>
              <button 
                class="mobile-user-link"
                @click="handleLogout"
              >
                <LogOut class="mobile-user-icon" />
                로그아웃
              </button>
            </template>
            <template v-else>
              <div class="mobile-auth-buttons">
                <BaseButton 
                  variant="outline" 
                  :full-width="true" 
                  class="mobile-auth-btn"
                  @click="router.push('/login'); closeMenu()"
                >
                  로그인
                </BaseButton>
                <BaseButton 
                  variant="primary" 
                  :full-width="true" 
                  class="mobile-auth-btn"
                  @click="router.push('/signup'); closeMenu()"
                >
                  회원가입
                </BaseButton>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 50;
  height: 4rem;
  flex: none;
  transition: all 0.3s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
}

@media (min-width: 640px) {
  .navbar-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .navbar-container {
    padding: 0 2rem;
  }
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* Logo */
.logo-group {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-icon-wrapper {
  background-color: var(--color-primary-transparent-10); /* primary/10 */
  padding: 0.375rem;
  border-radius: 0.5rem;
  margin-right: 0.625rem;
  transition: background-color 0.2s;
}

.logo-group:hover .logo-icon-wrapper {
  background-color: var(--color-primary-transparent-20);
}

.logo-icon {
  height: 1.25rem;
  width: 1.25rem;
  color: var(--color-primary);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--color-text);
  transition: color 0.2s;
}

.logo-group:hover .logo-text {
  color: var(--color-primary);
}

/* Desktop Menu */
.desktop-menu {
  display: none;
  align-items: center;
}

@media (min-width: 768px) {
  .desktop-menu {
    display: flex;
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
  transition: all 0.2s;
  text-decoration: none;
}

.nav-link:hover {
  color: var(--color-text);
  background-color: var(--color-gray-100);
}

.nav-link--active {
  background-color: var(--color-primary-transparent-10);
  color: var(--color-primary);
  font-weight: 700;
}

.divider {
  height: 1.5rem;
  width: 1px;
  background-color: var(--color-gray-200);
  margin: 0 1.5rem;
}

.auth-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-icon-link {
  color: var(--color-text-light);
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
}

.user-icon-link:hover {
  color: var(--color-primary);
  background-color: var(--color-gray-100);
}

.user-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Deep selector to override BaseButton styles if needed, though props should handle it */
.auth-btn {
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.75rem !important;
}

.shadow-btn {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-btn:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Mobile Menu Button */
.mobile-menu-btn-wrapper {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .mobile-menu-btn-wrapper {
    display: none;
  }
}

.mobile-menu-btn {
  color: var(--color-text-light);
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-menu-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-gray-100);
}

.menu-icon {
  height: 1.5rem;
  width: 1.5rem;
}

/* Mobile Menu Dropdown */
.mobile-menu {
  position: absolute;
  top: 4rem;
  left: 0;
  width: 100%;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 0.2s ease-out;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-menu-content {
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-light);
  transition: all 0.2s;
  text-decoration: none;
}

.mobile-nav-link:hover {
  color: var(--color-text);
  background-color: var(--color-gray-100);
}

.mobile-nav-link--active {
  background-color: var(--color-primary-transparent-10);
  color: var(--color-primary);
  font-weight: 700;
}

.mobile-divider {
  border-top: 1px solid var(--color-gray-200);
  margin-top: 0.75rem;
  padding-top: 0.75rem;
}

.mobile-user-link {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  transition: all 0.2s;
  text-decoration: none;
}

.mobile-user-link:hover {
  color: var(--color-text);
  background-color: var(--color-gray-100);
}

.mobile-user-icon {
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.75rem;
  color: var(--color-gray-400);
}

.mobile-auth-buttons {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 0 0.25rem;
}

.mobile-auth-btn {
  justify-content: center;
}

.user-info {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-right: 0.5rem;
}

.icon-btn {
  color: var(--color-text-light);
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-gray-100);
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.mobile-user-info {
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: var(--color-text);
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
