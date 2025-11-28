<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  gender: '',
  ageGroup: '',
  job: '',
  maritalStatus: ''
})

onMounted(() => {
  if (authStore.user) {
    formData.value = {
      name: authStore.user.name,
      email: authStore.user.email,
      phone: authStore.user.phone || '',
      gender: authStore.user.gender || '',
      ageGroup: authStore.user.ageGroup || '',
      job: authStore.user.job || '',
      maritalStatus: authStore.user.maritalStatus || ''
    }
  }
})

const genderOptions = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' },
  { label: '기타', value: 'other' }
]

const ageGroupOptions = [
  { label: '20대', value: '20s' },
  { label: '30대', value: '30s' },
  { label: '40대', value: '40s' },
  { label: '50대 이상', value: '50+' }
]

const jobOptions = [
  { label: '학생', value: 'student' },
  { label: '직장인', value: 'employee' },
  { label: '사업자', value: 'business' },
  { label: '프리랜서', value: 'freelancer' },
  { label: '기타', value: 'other' }
]

const maritalStatusOptions = [
  { label: '미혼', value: 'single' },
  { label: '기혼', value: 'married' }
]

const handleSave = async () => {
  await authStore.updateUser({
    ...formData.value,
    gender: formData.value.gender as 'male' | 'female' | 'other',
    maritalStatus: formData.value.maritalStatus as 'single' | 'married'
  })
  alert('프로필이 저장되었습니다.')
  router.back()
}

const goToSurvey = () => {
  router.push('/survey')
}
</script>

<template>
  <form class="edit-form" @submit.prevent="handleSave">
    <div class="section-title">기본 정보</div>
    <div class="form-group">
      <BaseInput 
        v-model="formData.name" 
        label="이름" 
        placeholder="이름을 입력하세요" 
      />
      <BaseInput 
        v-model="formData.email" 
        label="이메일" 
        type="email" 
        disabled
      />
      <BaseInput 
        v-model="formData.phone" 
        label="전화번호" 
        placeholder="전화번호를 입력하세요" 
      />
    </div>

    <div class="divider"></div>

    <div class="section-title">개인 정보</div>
    <div class="form-group">
      <BaseSelect 
        v-model="formData.gender" 
        label="성별"
        :options="genderOptions"
      />
      <BaseSelect 
        v-model="formData.ageGroup" 
        label="연령대"
        :options="ageGroupOptions"
      />
      <BaseSelect 
        v-model="formData.job" 
        label="직업"
        :options="jobOptions"
      />
      <BaseSelect 
        v-model="formData.maritalStatus" 
        label="결혼 여부"
        :options="maritalStatusOptions"
      />
    </div>

    <div class="divider"></div>

    <div class="survey-link-section">
      <div class="survey-info">
        <span class="survey-title">내 성향 정보</span>
        <span class="survey-desc">예산, 관심 지역 등</span>
      </div>
      <BaseButton 
        type="button" 
        variant="outline" 
        size="sm"
        @click="goToSurvey"
      >
        수정하기
      </BaseButton>
    </div>

    <div class="actions">
      <BaseButton type="submit" full-width size="lg">
        저장하기
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.divider {
  height: 1px;
  background-color: var(--color-gray-100);
  margin: 0.5rem 0;
}

.survey-link-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-gray-50);
  border-radius: 0.5rem;
}

.survey-info {
  display: flex;
  flex-direction: column;
}

.survey-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.survey-desc {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.actions {
  margin-top: 1rem;
}
</style>
