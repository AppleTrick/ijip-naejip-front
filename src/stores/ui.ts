import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ModalType = 'info' | 'confirm' | 'error' | 'success'

interface ModalOptions {
  title?: string
  message: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const useUiStore = defineStore('ui', () => {
  const isModalOpen = ref(false)
  const modalConfig = ref<ModalOptions>({
    title: '',
    message: '',
    type: 'info',
    confirmText: '확인',
    cancelText: '취소'
  })

  const showAlert = (message: string, title: string = '알림', type: ModalType = 'info') => {
    isModalOpen.value = true
    modalConfig.value = {
      title,
      message,
      type,
      confirmText: '확인',
      onConfirm: () => { isModalOpen.value = false }
    }
  }

  const showConfirm = (options: ModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      isModalOpen.value = true
      modalConfig.value = {
        title: options.title || '확인',
        message: options.message,
        type: options.type || 'confirm',
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        onConfirm: () => {
          isModalOpen.value = false
          if (options.onConfirm) options.onConfirm()
          resolve(true)
        },
        onCancel: () => {
          isModalOpen.value = false
          if (options.onCancel) options.onCancel()
          resolve(false)
        }
      }
    })
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  return {
    isModalOpen,
    modalConfig,
    showAlert,
    showConfirm,
    closeModal
  }
})
