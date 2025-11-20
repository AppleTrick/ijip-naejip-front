<script setup>
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <div class="h-screen bg-gray-50 text-gray-900 font-sans flex flex-col overflow-hidden">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1 relative overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>
