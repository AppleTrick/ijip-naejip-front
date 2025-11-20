<script setup lang="ts">
import { ref, watch } from 'vue'
import AddressSearch from './AddressSearch.vue'
import FileUpload from './FileUpload.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
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
    // 1. Basic Safety Check (Client-side for Building Ledger)
    let localResult: AnalysisResult = {
      safetyGrade: 'SAFE',
      message: '안전한 매물로 보입니다.',
      debtRatio: 0
    }

    // Calculate Debt Ratio (Mock logic if backend is not reachable or for immediate feedback)
    if (form.value.marketValue > 0) {
      const totalDebt = Number(form.value.deposit) + Number(form.value.priorDebt)
      localResult.debtRatio = Math.round((totalDebt / Number(form.value.marketValue)) * 100)
    }

    // Check 1: Violation Building
    if (form.value.isViolation) {
      localResult.safetyGrade = 'DANGER'
      localResult.message = '위반건축물로 등록된 매물입니다. 전세자금대출 및 보증보험 가입이 불가능할 수 있으며, 이행강제금이 부과될 수 있습니다. 계약을 권장하지 않습니다.'
    } 
    // Check 2: Usage (Neighborhood Living Facility)
    else if (form.value.usage === 'neighborhood') {
      localResult.safetyGrade = 'DANGER'
      localResult.message = '근린생활시설(상가) 용도입니다. 주거용으로 사용하더라도 전세자금대출과 보증보험 가입이 거절될 수 있습니다. 불법 개조 여부를 반드시 확인하세요.'
    }
    // Check 3: Debt Ratio
    else if (localResult.debtRatio >= 80) {
      localResult.safetyGrade = 'DANGER'
      localResult.message = `깡통전세 위험이 높습니다. 부채비율이 ${localResult.debtRatio}%로, 집값보다 빚(보증금+대출)이 너무 많습니다.`
    } else if (localResult.debtRatio >= 70) {
      localResult.safetyGrade = 'WARNING'
      localResult.message = `부채비율이 ${localResult.debtRatio}%로 다소 높습니다. 보증보험 가입 가능 여부를 꼭 확인하세요.`
    }

    // Simulate API call or use local result
    // In a real scenario, we would send all data to the backend.
    // For now, we combine local checks with the flow.
    
    // const response = await axios.post('http://localhost:8080/api/v1/analysis/safety-check', form.value)
    // result.value = response.data
    
    // Using Local Result for Demo/Self-Check
    await new Promise(resolve => setTimeout(resolve, 1000)) // Fake delay
    result.value = localResult

  } catch (e) {
    alert('분석 중 오류가 발생했습니다.')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <div class="flex-1 overflow-y-auto p-8 space-y-8">
      <!-- Header -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <ShieldCheck class="w-6 h-6 text-primary mr-2" />
          안전도 정밀 분석
        </h2>
        <p class="text-gray-500 text-sm mt-2">
          등기부등본과 시세 정보를 입력하면<br>
          <span class="font-semibold text-primary">빅데이터 AI</span>가 전세 사기 위험을 진단합니다.
        </p>
      </div>

      <!-- File Upload -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-4">1. 등기부등본 업로드 (선택)</h3>
        <FileUpload @file-analyzed="onFileAnalyzed" />
      </div>

      <!-- Form -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">2. 매물 정보 입력</h3>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">주소</label>
          <AddressSearch v-model="form.address" />
        </div>
        
        <div class="space-y-5">
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
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">3. 건축물대장 정보</h3>
          <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium cursor-help" title="정부24에서 무료로 열람 가능합니다.">발급 방법 ?</span>
        </div>

        <div class="space-y-6">
          <!-- Violation Building Check -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">위반건축물 표기 여부</label>
            <div class="grid grid-cols-2 gap-4">
              <label class="relative cursor-pointer group">
                <input type="radio" v-model="form.isViolation" :value="false" class="peer sr-only" name="violation">
                <div class="p-4 text-center rounded-xl border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-secondary/10 transition-all h-full flex flex-col items-center justify-center hover:border-secondary/30">
                  <div class="w-10 h-10 rounded-full bg-secondary/20 text-primary flex items-center justify-center mb-2">
                    <Check class="w-6 h-6" />
                  </div>
                  <span class="text-sm font-bold text-gray-900">없음 (깨끗함)</span>
                  <span class="text-xs text-gray-500 mt-1">대장 상단이 깨끗해요</span>
                </div>
              </label>
              
              <label class="relative cursor-pointer group">
                <input type="radio" v-model="form.isViolation" :value="true" class="peer sr-only" name="violation">
                <div class="p-4 text-center rounded-xl border-2 border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 transition-all h-full flex flex-col items-center justify-center hover:border-red-200">
                  <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
                    <AlertTriangle class="w-6 h-6" />
                  </div>
                  <span class="text-sm font-bold text-gray-900">위반건축물 표기</span>
                  <span class="text-xs text-gray-500 mt-1">노란색 딱지가 있어요</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Usage Check -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">주용도 (용도지역)</label>
            <div class="relative">
              <select v-model="form.usage" class="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white appearance-none">
                <option value="residential">🏡 단독/다가구/다세대/아파트 (주거용)</option>
                <option value="neighborhood">🏪 제1·2종 근린생활시설 (상가/사무실)</option>
                <option value="office">🏢 오피스텔 (주거용/업무용)</option>
                <option value="other">❓ 기타</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <ChevronDown class="w-5 h-5" />
              </div>
            </div>
            
            <!-- Warning Message for Usage -->
            <div v-if="form.usage === 'neighborhood'" class="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start animate-fade-in">
              <AlertTriangle class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p class="text-xs text-red-700 leading-relaxed">
                <span class="font-bold">주의:</span> 근린생활시설은 주거용으로 계약하더라도 <strong>전세자금대출</strong>과 <strong>보증보험 가입</strong>이 거절될 확률이 매우 높습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Card -->
      <div v-if="result" class="animate-fade-in p-6 rounded-2xl bg-white border-2 shadow-lg transition-all duration-500"
        :class="{
          'border-primary bg-secondary/10/30': result.safetyGrade === 'SAFE',
          'border-yellow-400 bg-yellow-50/30': result.safetyGrade === 'WARNING',
          'border-red-500 bg-red-50/30': result.safetyGrade === 'DANGER'
        }"
      >
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-sm"
            :class="{
              'bg-secondary/20 text-primary': result.safetyGrade === 'SAFE',
              'bg-yellow-100 text-yellow-600': result.safetyGrade === 'WARNING',
              'bg-red-100 text-red-600': result.safetyGrade === 'DANGER'
            }"
          >
            <ShieldCheck v-if="result.safetyGrade === 'SAFE'" class="w-8 h-8" />
            <AlertTriangle v-else-if="result.safetyGrade === 'WARNING'" class="w-8 h-8" />
            <Ban v-else class="w-8 h-8" />
          </div>
          
          <div>
            <h4 class="text-sm font-bold text-gray-500 mb-1">AI 안전 진단 결과</h4>
            <span class="text-2xl font-black"
              :class="{
                'text-primary': result.safetyGrade === 'SAFE',
                'text-yellow-700': result.safetyGrade === 'WARNING',
                'text-red-700': result.safetyGrade === 'DANGER'
              }"
            >
              {{ result.safetyGrade === 'SAFE' ? '안전 매물' : result.safetyGrade === 'WARNING' ? '주의 필요' : '위험 매물' }}
            </span>
          </div>
        </div>
        
        <!-- Message -->
        <div class="mb-6 p-4 rounded-xl bg-white/80 border border-gray-200/50">
          <p class="text-gray-800 font-medium leading-relaxed">{{ result.message }}</p>
        </div>
        
        <!-- Debt Ratio Visualization -->
        <div class="space-y-2">
          <div class="flex justify-between items-end">
            <span class="text-xs font-bold text-gray-500">깡통전세 위험도 (부채비율)</span>
            <span class="text-lg font-bold font-mono" 
              :class="{
                'text-primary': result.debtRatio < 70,
                'text-yellow-600': result.debtRatio >= 70 && result.debtRatio < 80,
                'text-red-600': result.debtRatio >= 80
              }"
            >{{ result.debtRatio }}%</span>
          </div>
          
          <div class="h-3 bg-gray-200 rounded-full overflow-hidden relative">
            <!-- Safe Zone -->
            <div class="absolute top-0 bottom-0 left-0 w-[70%] border-r border-white/50 bg-secondary/30/50"></div>
            <!-- Warning Zone -->
            <div class="absolute top-0 bottom-0 left-[70%] w-[10%] border-r border-white/50 bg-yellow-200/50"></div>
            <!-- Danger Zone -->
            <div class="absolute top-0 bottom-0 left-[80%] w-[20%] bg-red-200/50"></div>
            
            <!-- Indicator -->
            <div class="h-full transition-all duration-1000 ease-out rounded-full shadow-sm"
              :style="{ width: `${Math.min(result.debtRatio, 100)}%` }"
              :class="{
                'bg-secondary/100': result.debtRatio < 70,
                'bg-yellow-500': result.debtRatio >= 70 && result.debtRatio < 80,
                'bg-red-500': result.debtRatio >= 80
              }"
            ></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-400 font-medium px-1">
            <span>안전 (0~70%)</span>
            <span>주의 (70~80%)</span>
            <span>위험 (80%~)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="p-6 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <BaseButton @click="analyze" size="lg" full-width>
        <ShieldCheck class="w-5 h-5 mr-2" />
        {{ loading ? 'AI가 분석 중입니다...' : '안전도 무료 진단하기' }}
      </BaseButton>
    </div>
  </div>
</template>

