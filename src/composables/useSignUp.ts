import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { SignUpData } from '@/api/types'

export function useSignUp() {
  const router = useRouter()
  const authStore = useAuthStore()

  const currentStep = ref(1)
  const totalSteps = 2

  const signupData = reactive<SignUpData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    personalInfo: {
      gender: '',
      ageGroup: '',
      job: '',
      maritalStatus: ''
    },
    preferences: {
      budget: { min: 0, max: 10 },
      interestAreas: [],
      commuteLocation: ''
    }
  })

  const updateData = (step: number, data: any) => {
    if (step === 1) {
      Object.assign(signupData, data)
    } else if (step === 2) {
      signupData.personalInfo = data
    } else if (step === 3) {
      signupData.preferences = data
    }
  }

  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    } else {
      // Last step reached, submit
      submitSignup()
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const submitSignup = async () => {
    const success = await authStore.signup(signupData)
    if (success) {
      alert('회원가입이 완료되었습니다!')
      router.push('/login')
    } else {
      alert('회원가입에 실패했습니다: ' + authStore.error)
    }
  }

  return {
    currentStep,
    totalSteps,
    signupData,
    updateData,
    nextStep,
    prevStep,
    submitSignup
  }
}
