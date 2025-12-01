<template>
  <div class="sidebar-layout">
    <slot name="header"></slot>
    
    <div class="sidebar-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.sidebar-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
}
</style>
