<script setup lang="ts">
import { useMarketStatsStore } from '@/stores/marketStats'
import { storeToRefs } from 'pinia'
import RegionStatsView from '@/components/features/sidebar/RegionStatsView.vue'
import ApartmentLevelView from '@/components/features/sidebar/ApartmentLevelView.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const store = useMarketStatsStore()
const { currentLevel, isSidebarOpen } = storeToRefs(store)
const { toggleSidebar } = store
</script>

<template>
  <div class="sidebar-container" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <div class="market-sidebar">
      <transition name="fade" mode="out-in">
        <RegionStatsView v-if="currentLevel === 'city'" />
        <RegionStatsView v-else-if="currentLevel === 'district'" has-back-button />
        <RegionStatsView v-else-if="currentLevel === 'neighborhood'" has-back-button />
        <RegionStatsView v-else-if="currentLevel === 'dong'" has-back-button />
        <ApartmentLevelView v-else-if="currentLevel === 'apartment'" />
      </transition>
    </div>

    <!-- Toggle Button -->
    <button class="sidebar-toggle" @click="toggleSidebar">
      <component :is="isSidebarOpen ? ChevronLeft : ChevronRight" class="toggle-icon" />
    </button>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: absolute;
  top: 6rem;
  left: 1rem;
  bottom: 1rem;
  z-index: 30;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease-in-out;
}

.sidebar-container.sidebar-closed {
  transform: translateX(-430px); /* Hide sidebar content */
}

.market-sidebar {
  width: 420px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden; /* Important: Clip content */
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
}

/* Ensure the transition wrapper takes full height so children can flex */
.market-sidebar > div { 
  height: 100%;
  width: 100%;
}

.sidebar-toggle {
  width: 2rem;
  height: 4rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-left: none;
  border-radius: 0 0.5rem 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  margin-left: -1px; /* Overlap border */
}

.toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-600);
}

@media (max-width: 768px) {
  .sidebar-container {
    top: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60vh;
    flex-direction: column;
    transform: translateY(0);
  }
  
  .sidebar-container.sidebar-closed {
    transform: translateY(calc(60vh - 3rem)); /* Show only handle */
  }

  .market-sidebar {
    width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
  }

  .sidebar-toggle {
    position: absolute;
    top: -3rem;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
    width: 2rem;
    height: 4rem;
    border-radius: 0 0.5rem 0.5rem 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
