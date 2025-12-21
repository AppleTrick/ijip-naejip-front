<script setup lang="ts">
import { ref, watch } from 'vue'
import http from '@/api/http'
import AddressSearch from '@/components/features/address/AddressSearch.vue'
import FileUpload from './FileUpload.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ShieldCheck, AlertTriangle, Ban, Check, ChevronDown } from 'lucide-vue-next'

interface AnalysisResult {
  safetyGrade: 'SAFE' | 'WARNING' | 'DANGER'
  message: string
  debtRatio: number
}

interface FormState {
  address: string
  deposit: number
  marketValue: number
  priorDebt: number
  isViolation: boolean
  usage: string
}

defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'analyze'): void
}>()

const form = ref<FormState>({
  address: '',
  deposit: 0,
  marketValue: 0,
  priorDebt: 0,
  // Building Ledger Info
  isViolation: false,
  usage: 'residential' // residential, neighborhood, office, other
})

// Sync with parent
watch(() => form.value.address, (newVal) => {
  emit('update:modelValue', { ...form.value, address: newVal })
})

const result = ref<AnalysisResult | null>(null)
const loading = ref<boolean>(false)

const onFileAnalyzed = (data: any) => {
  form.value.deposit = data.deposit
  form.value.marketValue = data.marketValue
  form.value.priorDebt = data.priorDebt
}

const analyze = async () => {
  loading.value = true
  try {
    const response = await http.post('/api/v1/ai/fraud-check', form.value)
    result.value = response.data.data
  } catch (e) {
    alert('분석 중 오류가 발생했습니다.')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="analysis-page">
    <div class="content-area">
      <!-- Header -->
      <div class="section-card header-card">
        <h2 class="header-title">
          <ShieldCheck class="header-icon" />
          안전도 정밀 분석
        </h2>
        <p class="header-desc">
          등기부등본과 시세 정보를 입력하면<br>
          <span class="highlight">빅데이터 AI</span>가 전세 사기 위험을 진단합니다.
        </p>
      </div>

      <!-- File Upload -->
      <div class="section-card">
        <h3 class="section-title">1. 등기부등본 업로드 (선택)</h3>
        <FileUpload @file-analyzed="onFileAnalyzed" />
      </div>

      <!-- Form -->
      <div class="section-card form-section">
        <h3 class="section-title">2. 매물 정보 입력</h3>
        
        <div class="form-group">
          <label class="form-label">주소</label>
          <AddressSearch v-model="form.address" />
        </div>
        
        <div class="input-stack">
          <BaseInput 
            v-model="form.deposit" 
            label="보증금" 
            type="number" 
            placeholder="0" 
            unit="원" 
          />
          <BaseInput 
            v-model="form.marketValue" 
            label="매매 시세" 
            type="number" 
            placeholder="0" 
            unit="원" 
          />
          <BaseInput 
            v-model="form.priorDebt" 
            label="선순위 채권 (근저당)" 
            type="number" 
            placeholder="0" 
            unit="원" 
          />
        </div>
      </div>

      <!-- Building Ledger Info -->
      <div class="section-card ledger-section">
        <div class="section-header">
          <h3 class="section-title">3. 건축물대장 정보</h3>
          <span class="help-badge" title="정부24에서 무료로 열람 가능합니다.">발급 방법 ?</span>
        </div>

        <div class="ledger-content">
          <!-- Violation Building Check -->
          <div>
            <label class="form-label mb-3">위반건축물 표기 여부</label>
            <div class="radio-grid">
              <label class="radio-label">
                <input type="radio" v-model="form.isViolation" :value="false" class="sr-only" name="violation">
                <div class="radio-card radio-card--safe">
                  <div class="radio-icon-wrapper safe-icon">
                    <Check class="radio-icon" />
                  </div>
                  <span class="radio-text">없음 (깨끗함)</span>
                  <span class="radio-subtext">대장 상단이 깨끗해요</span>
                </div>
              </label>
              
              <label class="radio-label">
                <input type="radio" v-model="form.isViolation" :value="true" class="sr-only" name="violation">
                <div class="radio-card radio-card--danger">
                  <div class="radio-icon-wrapper danger-icon">
                    <AlertTriangle class="radio-icon" />
                  </div>
                  <span class="radio-text">위반건축물 표기</span>
                  <span class="radio-subtext">노란색 딱지가 있어요</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Usage Check -->
          <div>
            <label class="form-label">주용도 (용도지역)</label>
            <div class="select-wrapper">
              <select v-model="form.usage" class="usage-select">
                <option value="residential">🏡 단독/다가구/다세대/아파트 (주거용)</option>
                <option value="neighborhood">🏪 제1·2종 근린생활시설 (상가/사무실)</option>
                <option value="office">🏢 오피스텔 (주거용/업무용)</option>
                <option value="other">❓ 기타</option>
              </select>
              <div class="select-arrow">
                <ChevronDown class="w-5 h-5" />
              </div>
            </div>
            
            <!-- Warning Message for Usage -->
            <div v-if="form.usage === 'neighborhood'" class="warning-box">
              <AlertTriangle class="warning-icon" />
              <p class="warning-text">
                <span class="font-bold">주의:</span> 근린생활시설은 주거용으로 계약하더라도 <strong>전세자금대출</strong>과 <strong>보증보험 가입</strong>이 거절될 확률이 매우 높습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Card -->
      <div v-if="result" class="result-card"
        :class="{
          'result-card--safe': result.safetyGrade === 'SAFE',
          'result-card--warning': result.safetyGrade === 'WARNING',
          'result-card--danger': result.safetyGrade === 'DANGER'
        }"
      >
        <!-- Header -->
        <div class="result-header">
          <div class="grade-icon-wrapper"
            :class="{
              'grade-icon--safe': result.safetyGrade === 'SAFE',
              'grade-icon--warning': result.safetyGrade === 'WARNING',
              'grade-icon--danger': result.safetyGrade === 'DANGER'
            }"
          >
            <ShieldCheck v-if="result.safetyGrade === 'SAFE'" class="grade-icon" />
            <AlertTriangle v-else-if="result.safetyGrade === 'WARNING'" class="grade-icon" />
            <Ban v-else class="grade-icon" />
          </div>
          
          <div>
            <h4 class="result-subtitle">AI 안전 진단 결과</h4>
            <span class="result-grade-text"
              :class="{
                'text-safe': result.safetyGrade === 'SAFE',
                'text-warning': result.safetyGrade === 'WARNING',
                'text-danger': result.safetyGrade === 'DANGER'
              }"
            >
              {{ result.safetyGrade === 'SAFE' ? '안전 매물' : result.safetyGrade === 'WARNING' ? '주의 필요' : '위험 매물' }}
            </span>
          </div>
        </div>
        
        <!-- Message -->
        <div class="result-message-box">
          <p class="result-message">{{ result.message }}</p>
        </div>
        
        <!-- Debt Ratio Visualization -->
        <div class="debt-ratio-section">
          <div class="debt-ratio-header">
            <span class="debt-ratio-label">깡통전세 위험도 (부채비율)</span>
            <span class="debt-ratio-value" 
              :class="{
                'text-safe': result.debtRatio < 70,
                'text-warning': result.debtRatio >= 70 && result.debtRatio < 80,
                'text-danger': result.debtRatio >= 80
              }"
            >{{ result.debtRatio }}%</span>
          </div>
          
          <div class="debt-bar-container">
            <!-- Safe Zone -->
            <div class="zone zone-safe"></div>
            <!-- Warning Zone -->
            <div class="zone zone-warning"></div>
            <!-- Danger Zone -->
            <div class="zone zone-danger"></div>
            
            <!-- Indicator -->
            <div class="debt-indicator"
              :style="{ width: `${Math.min(result.debtRatio, 100)}%` }"
              :class="{
                'bg-safe': result.debtRatio < 70,
                'bg-warning': result.debtRatio >= 70 && result.debtRatio < 80,
                'bg-danger': result.debtRatio >= 80
              }"
            ></div>
          </div>
          <div class="debt-legend">
            <span>안전 (0~70%)</span>
            <span>주의 (70~80%)</span>
            <span>위험 (80%~)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="footer-action">
      <BaseButton @click="analyze" size="lg" full-width>
        <ShieldCheck class="btn-icon" />
        {{ loading ? 'AI가 분석 중입니다...' : '안전도 무료 진단하기' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.analysis-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-gray-50);
  overflow: hidden; /* Prevent double scrollbars */
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-card {
  background-color: var(--color-white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-gray-100);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
}

.header-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary);
  margin-right: 0.5rem;
}

.header-desc {
  color: var(--color-gray-500);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.highlight {
  font-weight: 600;
  color: var(--color-primary);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

.input-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ledger-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.help-badge {
  font-size: 0.75rem;
  color: #2563eb; /* blue-600 */
  background-color: #eff6ff; /* blue-50 */
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: help;
}

.ledger-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.radio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.radio-label {
  position: relative;
  cursor: pointer;
  display: flex;
  height: 100%;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.radio-card {
  padding: 1rem;
  text-align: center;
  border-radius: 0.75rem;
  border: 2px solid var(--color-gray-200);
  transition: all 0.2s;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.radio-card:hover {
  border-color: var(--color-primary-transparent-30); /* secondary/30 */
}

input[type="radio"]:checked + .radio-card--safe {
  border-color: var(--color-primary);
  background-color: var(--color-primary-transparent-10); /* secondary/10 */
}

input[type="radio"]:checked + .radio-card--danger {
  border-color: #ef4444; /* red-500 */
  background-color: #fef2f2; /* red-50 */
}

.radio-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.safe-icon {
  background-color: var(--color-primary-transparent-20); /* secondary/20 */
  color: var(--color-primary);
}

.danger-icon {
  background-color: #fee2e2; /* red-100 */
  color: #dc2626; /* red-600 */
}

.radio-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.radio-text {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
}

.radio-subtext {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin-top: 0.25rem;
}

.select-wrapper {
  position: relative;
}

.usage-select {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s;
  background-color: var(--color-white);
  appearance: none;
}

.usage-select:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
  border-color: var(--color-primary);
}

.select-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  pointer-events: none;
  color: var(--color-gray-500);
}

.warning-box {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #fef2f2; /* red-50 */
  border-radius: 0.5rem;
  border: 1px solid #fee2e2; /* red-100 */
  display: flex;
  align-items: flex-start;
  animation: fadeIn 0.3s ease-out;
}

.warning-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #ef4444; /* red-500 */
  margin-right: 0.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-text {
  font-size: 0.75rem;
  color: #b91c1c; /* red-700 */
  line-height: 1.5;
}

/* Result Card */
.result-card {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: var(--color-white);
  border: 2px solid transparent;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  animation: fadeIn 0.5s ease-out;
}

.result-card--safe {
  border-color: var(--color-primary);
  background-color: var(--color-primary-transparent-10); /* secondary/10/30 approx */
}

.result-card--warning {
  border-color: #facc15; /* yellow-400 */
  background-color: rgba(254, 252, 232, 0.5); /* yellow-50/30 */
}

.result-card--danger {
  border-color: #ef4444; /* red-500 */
  background-color: rgba(254, 242, 242, 0.5); /* red-50/30 */
}

.result-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.grade-icon-wrapper {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.grade-icon--safe {
  background-color: var(--color-primary-transparent-20);
  color: var(--color-primary);
}

.grade-icon--warning {
  background-color: #fef9c3; /* yellow-100 */
  color: #ca8a04; /* yellow-600 */
}

.grade-icon--danger {
  background-color: #fee2e2; /* red-100 */
  color: #dc2626; /* red-600 */
}

.grade-icon {
  width: 2rem;
  height: 2rem;
}

.result-subtitle {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gray-500);
  margin-bottom: 0.25rem;
}

.result-grade-text {
  font-size: 1.5rem;
  font-weight: 900;
}

.text-safe { color: var(--color-primary); }
.text-warning { color: #a16207; /* yellow-700 */ }
.text-danger { color: #b91c1c; /* red-700 */ }

.result-message-box {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.result-message {
  color: var(--color-gray-700); /* gray-800 in original */
  font-weight: 500;
  line-height: 1.6;
}

.debt-ratio-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.debt-ratio-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.debt-ratio-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-gray-500);
}

.debt-ratio-value {
  font-size: 1.125rem;
  font-weight: 700;
  font-family: monospace;
}

.debt-bar-container {
  height: 0.75rem;
  background-color: var(--color-gray-200);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.zone {
  position: absolute;
  top: 0;
  bottom: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
}

.zone-safe {
  left: 0;
  width: 70%;
  background-color: var(--color-primary-transparent-10); /* secondary/30/50 */
}

.zone-warning {
  left: 70%;
  width: 10%;
  background-color: rgba(254, 240, 138, 0.5); /* yellow-200/50 */
}

.zone-danger {
  left: 80%;
  width: 20%;
  background-color: rgba(254, 202, 202, 0.5); /* red-200/50 */
}

.debt-indicator {
  height: 100%;
  transition: all 1s ease-out;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.bg-safe { background-color: var(--color-secondary); }
.bg-warning { background-color: #eab308; /* yellow-500 */ }
.bg-danger { background-color: #ef4444; /* red-500 */ }

.debt-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.625rem;
  color: var(--color-gray-400);
  font-weight: 500;
  padding: 0 0.25rem;
}

.footer-action {
  padding: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

