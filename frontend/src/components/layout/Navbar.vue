<script setup lang="ts">
import { ref } from 'vue'
import { Home, User, Menu, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const isMenuOpen = ref<boolean>(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-50 h-16 flex-none transition-all duration-300 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <!-- Logo -->
        <div class="flex items-center cursor-pointer group" @click="router.push('/')">
          <div class="bg-[#903749]/15 p-1.5 rounded-lg mr-2.5 group-hover:bg-[#903749]/25 transition-colors">
            <Home class="h-5 w-5 text-[#E84545]" />
          </div>
          <span class="text-xl font-bold tracking-tight text-[#2B2E4A] group-hover:text-[#E84545] transition-colors">SafeHome</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center">
          <!-- Main Navigation -->
          <div class="flex items-center space-x-1">
            <router-link 
              to="/" 
              class="px-4 py-2 rounded-full text-sm font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] transition-all" 
              active-class="bg-[#903749]/15 text-[#E84545] font-bold"
            >
              매물 지도
            </router-link>
            <router-link 
              to="/analysis" 
              class="px-4 py-2 rounded-full text-sm font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] transition-all" 
              active-class="bg-[#903749]/15 text-[#E84545] font-bold"
            >
              안전도 분석
            </router-link>
            <router-link 
              to="/comparison" 
              class="px-4 py-2 rounded-full text-sm font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] transition-all" 
              active-class="bg-[#903749]/15 text-[#E84545] font-bold"
            >
              집 비교하기
            </router-link>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-[#E5E7EB] mx-6"></div>

          <!-- Auth & User -->
          <div class="flex items-center space-x-4">
            <router-link to="/mypage" class="text-[#6B7280] hover:text-[#E84545] transition-colors p-2 hover:bg-[#F3F4F6] rounded-full" title="마이페이지">
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
          <button @click="toggleMenu" class="text-[#6B7280] hover:text-[#E84545] p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <Menu v-if="!isMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMenuOpen" class="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[#E5E7EB] shadow-lg animate-fade-in-down">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <router-link 
          to="/" 
          class="block px-4 py-3 rounded-xl text-base font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] transition-colors"
          active-class="bg-[#903749]/15 text-[#E84545] font-bold"
          @click="closeMenu"
        >
          매물 지도
        </router-link>
        <router-link 
          to="/analysis" 
          class="block px-4 py-3 rounded-xl text-base font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] transition-colors"
          active-class="bg-[#903749]/15 text-[#E84545] font-bold"
          @click="closeMenu"
        >
          안전도 분석
        </router-link>
        <router-link 
          to="/comparison" 
          class="block px-4 py-3 rounded-xl text-base font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] transition-colors"
          active-class="bg-[#903749]/15 text-[#E84545] font-bold"
          @click="closeMenu"
        >
          집 비교하기
        </router-link>
        
        <div class="border-t border-[#E5E7EB] my-3 pt-3">
          <router-link 
            to="/mypage"
            class="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-[#6B7280] hover:text-[#2B2E4A] hover:bg-[#F3F4F6] flex items-center transition-colors"
            @click="closeMenu"
          >
            <User class="h-5 w-5 mr-3 text-[#9CA3AF]" />
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
