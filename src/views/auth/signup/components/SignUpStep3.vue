<script setup lang="ts">
import { reactive } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps<{
  data: any
  isEditMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', data: any): void
  (e: 'submit'): void
  (e: 'prev'): void
}>()

const formData = reactive({
  budgetMin: props.data.budget?.min || 0,
  budgetMax: props.data.budget?.max || 10,
  interestAreas: props.data.interestAreas || [],
  commuteLocation: props.data.commuteLocation || ''
})

const interestOptions = [
  { label: '투자 가치', value: 'investment' },
  { label: '실거주', value: 'residence' },
  { label: '학군', value: 'education' },
  { label: '교통', value: 'transport' },
  { label: '환경/공원', value: 'environment' }
]

const toggleInterest = (value: string) => {
  const index = formData.interestAreas.indexOf(value)
  if (index === -1) {
    if (formData.interestAreas.length < 3) {
      formData.interestAreas.push(value)
    }
  } else {
    formData.interestAreas.splice(index, 1)
  }
}

const handleSubmit = () => {
  emit('update', {
    budget: { min: formData.budgetMin, max: formData.budgetMax },
    interestAreas: formData.interestAreas,
    commuteLocation: formData.commuteLocation
  })
  emit('submit')
}
</script>

<template>
  <div class="step-container">
    <h3 class="step-title">{{ isEditMode ? '성향 수정' : '성향 조사' }}</h3>
    <p class="step-desc">딱 맞는 집을 찾기 위해 선호하는 조건을 알려주세요.</p>

    <!-- Budget -->
    <div class="form-group">
      <label class="label">예산 범위 (단위: 억)</label>
      <div class="range-inputs">
        <div class="input-wrapper">
          <input 
            type="number" 
            v-model.number="formData.budgetMin"
            class="number-input"
            min="0"
          >
          <span class="unit">억</span>
        </div>
        <span class="separator">~</span>
        <div class="input-wrapper">
          <input 
            type="number" 
            v-model.number="formData.budgetMax"
            class="number-input"
            min="0"
          >
          <span class="unit">억</span>
        </div>
      </div>
    </div>

    <!-- Interest Areas -->
    <div class="form-group">
      <label class="label">관심 요소 (최대 3개)</label>
      <div class="tags-container">
        <button 
          v-for="opt in interestOptions" 
          :key="opt.value"
          class="tag-btn"
          :class="{ active: formData.interestAreas.includes(opt.value) }"
          @click="toggleInterest(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Commute -->
    <div class="form-group">
      <label class="label">주요 통근/통학 위치</label>
      <BaseInput 
        v-model="formData.commuteLocation" 
        placeholder="예: 강남역, 판교 등"
      />
    </div>

    <div class="button-group">
      <BaseButton 
        v-if="!isEditMode"
        variant="outline" 
        @click="emit('prev')"
      >
        이전
      </BaseButton>
      <BaseButton 
        variant="primary" 
        @click="handleSubmit"
      >
        {{ isEditMode ? '저장하기' : '가입 완료' }}
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

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

.number-input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
}

.number-input:focus {
  border-color: var(--color-primary);
}

.unit {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.separator {
  color: var(--color-text-light);
  font-weight: 700;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-btn {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  color: var(--color-text-light);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* If edit mode (single button), make it full width */
.button-group:has(button:only-child) {
  grid-template-columns: 1fr;
}
</style>
