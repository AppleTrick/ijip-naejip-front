import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { SignUpData } from '@/api/types'

export function useSignUp() {
  const router = useRouter()
  const authStore = useAuthStore()

  const currentStep = ref(0)
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

  const startEmailSignup = () => {
    currentStep.value = 1
  }

  const isSocialSignup = ref(false)
  const socialId = ref('')
  const socialType = ref('')
  const needsEmail = ref(false)

  const submitSocialSignup = async () => {
    try {
      if (needsEmail.value) {
        // 이메일이 없어서 입력받은 경우 (신규 가입)
        const signupPayload = {
          ...signupData,
          socialId: socialId.value,
          socialType: socialType.value
        } as any // SignUpData 타입에 없는 필드 추가를 위해 any로 캐스팅
        
        await authStore.signup(signupPayload)
      } else {
        // 기존 가입자 추가 정보 입력
        await authStore.updateUser({
          // personalInfo 객체 평탄화하여 전달
          gender: signupData.personalInfo.gender,
          ageGroup: signupData.personalInfo.ageGroup,
          job: signupData.personalInfo.job,
          maritalStatus: signupData.personalInfo.maritalStatus
        } as any)
      }
      
      alert('회원가입이 완료되었습니다.')
      router.push('/')
    } catch (error: any) {
      alert(error.message)
    }
  }

  return {
    currentStep,
    totalSteps,
    signupData,
    updateData,
    nextStep,
    prevStep,
    submitSignup,
    startEmailSignup,
    isSocialSignup,
    submitSocialSignup,
    socialId,
    socialType,
    needsEmail
  }
}
