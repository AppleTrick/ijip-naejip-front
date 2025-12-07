<script setup lang="ts">
import { reactive } from 'vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps<{
  data: any
}>()

const emit = defineEmits<{
  (e: 'update', data: any): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

const formData = reactive({
  gender: props.data.gender || '',
  ageGroup: props.data.ageGroup || '',
  job: props.data.job || '',
  maritalStatus: props.data.maritalStatus || ''
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

const handleNext = () => {
  emit('update', {
    gender: formData.gender,
    ageGroup: formData.ageGroup,
    job: formData.job,
    maritalStatus: formData.maritalStatus
  })
  emit('next')
}
</script>

<template>
  <div class="step-container">
    <h3 class="step-title">개인 정보 입력</h3>
    <p class="step-desc">더 정확한 정보 추천을 위해 정보를 입력해주세요.</p>

    <div class="form-group">
      <label class="label">성별</label>
      <div class="radio-group">
        <label 
          v-for="opt in genderOptions" 
          :key="opt.value"
          class="radio-label"
          :class="{ active: formData.gender === opt.value }"
        >
          <input 
            type="radio" 
            v-model="formData.gender" 
            :value="opt.value" 
            class="hidden-radio"
          >
          {{ opt.label }}
        </label>
      </div>
    </div>

    <div class="form-group">
      <label class="label">연령대</label>
      <BaseSelect 
        v-model="formData.ageGroup" 
        :options="ageGroupOptions"
        placeholder="연령대를 선택해주세요"
      />
    </div>

    <div class="form-group">
      <label class="label">직업군</label>
      <BaseSelect 
        v-model="formData.job" 
        :options="jobOptions"
        placeholder="직업군을 선택해주세요"
      />
    </div>

    <div class="form-group">
      <label class="label">결혼 여부</label>
      <div class="radio-group">
        <label 
          v-for="opt in maritalStatusOptions" 
          :key="opt.value"
          class="radio-label"
          :class="{ active: formData.maritalStatus === opt.value }"
        >
          <input 
            type="radio" 
            v-model="formData.maritalStatus" 
            :value="opt.value" 
            class="hidden-radio"
          >
          {{ opt.label }}
        </label>
      </div>
    </div>

    <div class="button-group">
      <BaseButton 
        variant="outline" 
        @click="emit('prev')"
      >
        이전
      </BaseButton>
      <BaseButton 
        variant="primary" 
        :disabled="!formData.gender || !formData.ageGroup"
        @click="handleNext"
      >
        회원가입 완료
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.step-desc {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.radio-group {
  display: flex;
  gap: 0.5rem;
}

.radio-label {
  flex: 1;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  color: var(--color-text-light);
}

.radio-label.active {
  border-color: var(--color-primary);
  background-color: rgba(232, 69, 69, 0.05);
  color: var(--color-primary);
  font-weight: 600;
}

.hidden-radio {
  display: none;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
