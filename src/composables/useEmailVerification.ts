import { ref } from 'vue'
import { sendVerificationCode, checkVerificationCode } from '@/api/authApi'

export function useEmailVerification() {
  const isVerifying = ref(false)
  const isVerified = ref(false)
  const verificationCode = ref('')
  const sentCode = ref(false)
  const message = ref('')
  const isError = ref(false)

  const sendCode = async (email: string) => {
    if (!email) {
      message.value = '이메일을 입력해주세요.'
      isError.value = true
      return false
    }
    
    isVerifying.value = true
    message.value = ''
    isError.value = false
    
    // Optimistic UI
    sentCode.value = true

    try {
      await sendVerificationCode(email)
      message.value = '인증번호가 전송되었습니다. 이메일을 확인해주세요.'
      isError.value = false
      return true
    } catch (error: any) {
      sentCode.value = false
      message.value = error.message
      isError.value = true
      return false
    } finally {
      isVerifying.value = false
    }
  }

  const verifyCode = async (email: string) => {
    if (verificationCode.value.length === 0) return false

    try {
      const success = await checkVerificationCode(email, verificationCode.value)
      if (success) {
        isVerified.value = true
        message.value = '이메일 인증이 완료되었습니다.'
        isError.value = false
        return true
      }
      return false
    } catch (error: any) {
      message.value = error.message
      isError.value = true
      return false
    }
  }

  return {
    isVerifying,
    isVerified,
    verificationCode,
    sentCode,
    message,
    isError,
    sendCode,
    verifyCode
  }
}
