<script setup>
import { ref } from 'vue'
import { Home, User, Menu, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const navigateToLogin = () => {
  router.push('/login')
  closeMenu()
}
</script>

<template>
  <nav class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 h-16 flex-none transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <!-- Logo -->
        <div class="flex items-center cursor-pointer group" @click="router.push('/')">
          <div class="bg-lime-100 p-1.5 rounded-lg mr-2.5 group-hover:bg-lime-200 transition-colors">
            <Home class="h-5 w-5 text-lime-600" />
          </div>
          <span class="text-xl font-bold tracking-tight text-gray-900 group-hover:text-lime-700 transition-colors">SafeHome</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center">
          <!-- Main Navigation -->
          <div class="flex items-center space-x-1">
            <router-link 
              to="/" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all" 
              active-class="bg-lime-50 text-lime-700 font-bold"
            >
              매물 지도
            </router-link>
            <router-link 
              to="/analysis" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all" 
              active-class="bg-lime-50 text-lime-700 font-bold"
            >
              안전도 분석
            </router-link>
            <router-link 
              to="/comparison" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all" 
              active-class="bg-lime-50 text-lime-700 font-bold"
            >
              집 비교하기
            </router-link>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-gray-200 mx-6"></div>

          <!-- Auth & User -->
          <div class="flex items-center space-x-4">
            <router-link to="/mypage" class="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full" title="마이페이지">
              <User class="h-5 w-5" />
            </router-link>
            <div class="flex items-center space-x-2">
              <BaseButton 
                variant="outline" 
                size="sm" 
                class="!rounded-lg !px-4 !py-2 !text-xs"
                @click="router.push('/login')"
              >
                로그인
              </BaseButton>
              <BaseButton 
                variant="primary" 
                size="sm" 
                class="!rounded-lg !px-4 !py-2 !text-xs shadow-sm hover:shadow-md"
                @click="router.push('/signup')"
              >
                회원가입
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMenu" class="text-gray-500 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu v-if="!isMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMenuOpen" class="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-fade-in-down">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <router-link 
          to="/" 
          class="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          active-class="bg-lime-50 text-lime-700 font-bold"
          @click="closeMenu"
        >
          매물 지도
        </router-link>
        <router-link 
          to="/analysis" 
          class="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          active-class="bg-lime-50 text-lime-700 font-bold"
          @click="closeMenu"
        >
          안전도 분석
        </router-link>
        <router-link 
          to="/comparison" 
          class="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          active-class="bg-lime-50 text-lime-700 font-bold"
          @click="closeMenu"
        >
          집 비교하기
        </router-link>
        
        <div class="border-t border-gray-100 my-3 pt-3">
          <router-link 
            to="/mypage"
            class="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center transition-colors"
            @click="closeMenu"
          >
            <User class="h-5 w-5 mr-3 text-gray-400" />
            마이페이지
          </router-link>
          <div class="mt-4 grid grid-cols-2 gap-3 px-1">
            <BaseButton 
              variant="outline" 
              :full-width="true" 
              class="justify-center"
              @click="router.push('/login'); closeMenu()"
            >
              로그인
            </BaseButton>
            <BaseButton 
              variant="primary" 
              :full-width="true" 
              class="justify-center"
              @click="router.push('/signup'); closeMenu()"
            >
              회원가입
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
