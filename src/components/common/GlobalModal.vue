<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { Info, HelpCircle, AlertCircle, CheckCircle2, X } from 'lucide-vue-next'
import BaseButton from '@/components/common/BaseButton.vue'

const store = useUiStore()
const { isModalOpen, modalConfig } = storeToRefs(store)
const { closeModal } = store

const getIcon = () => {
  switch (modalConfig.value.type) {
    case 'confirm': return HelpCircle
    case 'error': return AlertCircle
    case 'success': return CheckCircle2
    default: return Info
  }
}

const handleConfirm = () => {
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm()
  } else {
    closeModal()
  }
}

const handleCancel = () => {
  if (modalConfig.value.onCancel) {
    modalConfig.value.onCancel()
  } else {
    closeModal()
  }
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isModalOpen" class="modal-overlay" @click.self="handleCancel">
      <div class="modal-container" :class="modalConfig.type">
        <div class="modal-header">
          <div class="icon-wrapper">
            <component :is="getIcon()" class="modal-icon" />
          </div>
          <button class="close-btn" @click="handleCancel">
            <X />
          </button>
        </div>
        
        <div class="modal-body">
          <h3 v-if="modalConfig.title" class="modal-title">{{ modalConfig.title }}</h3>
          <p class="modal-message">{{ modalConfig.message }}</p>
        </div>

        <div class="modal-footer">
          <BaseButton 
            v-if="modalConfig.type === 'confirm'" 
            variant="outline" 
            @click="handleCancel"
          >
            {{ modalConfig.cancelText || '취소' }}
          </BaseButton>
          <BaseButton 
            variant="primary" 
            @click="handleConfirm"
          >
            {{ modalConfig.confirmText || '확인' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: rgba(255, 255, 255, 0.95);
  width: 90%;
  max-width: 400px;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.9) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container.info .icon-wrapper { background-color: var(--color-primary-soft); color: var(--color-primary); }
.modal-container.confirm .icon-wrapper { background-color: #f0f4ff; color: #3b82f6; }
.modal-container.error .icon-wrapper { background-color: #fef2f2; color: #ef4444; }
.modal-container.success .icon-wrapper { background-color: #f0fdf4; color: #22c55e; }

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.modal-body {
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.modal-message {
  font-size: 1rem;
  color: var(--color-gray-600);
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
