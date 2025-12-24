<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { X, Loader2, MapPin, ArrowRight, LayoutDashboard, Send } from 'lucide-vue-next'
import { marked } from 'marked'
import http from '@/api/http'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'move-location'])

const query = ref('')
const isProcessing = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

interface Message {
  role: 'user' | 'assistant'
  content: string
  results?: any[]
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '## 🏠 AI 부동산 통계 분석\n안녕하세요! 궁금하신 지역의 부동산 통계나 시장 동향에 대해 물어보세요.\n\n**예시 질문:**\n- 강남구와 서초구의 최근 거래가 비교해줘\n- 성수동의 10억 이하 아파트 추천해줘\n- 최근 서울 전체적인 거래 추세가 어때?'
  }
])

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const renderMarkdown = (content: string) => {
  // Remove markdown code block wrappers if the AI sends them
  let cleanContent = content;
  if (cleanContent.startsWith('```markdown')) {
    cleanContent = cleanContent.replace(/^```markdown\n/, '').replace(/\n```$/, '');
  } else if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  return marked.parse(cleanContent)
}

const handleSearch = async () => {
  if (!query.value.trim() || isProcessing.value) return
  
  const userMessage = query.value
  messages.value.push({
    role: 'user',
    content: userMessage
  })
  
  query.value = ''
  isProcessing.value = true
  await scrollToBottom()

  try {
    const response = await http.post('/api/v1/ai/chat', { message: userMessage })
    const { analysis, results } = response.data.data
    
    messages.value.push({
      role: 'assistant',
      content: analysis,
      results: results
    })
  } catch (error) {
    console.error('AI Chat Error:', error)
    messages.value.push({
      role: 'assistant',
      content: '❌ 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    })
  } finally {
    isProcessing.value = false
    await scrollToBottom()
  }
}

const handleMove = (item: any) => {
  const lat = Number(item.lat ?? item.latitude)
  const lng = Number(item.lng ?? item.longitude)
  
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    emit('move-location', {
      lat: lat,
      lng: lng,
      aptSeq: item.aptSeq
    })
    emit('close')
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <div class="icon-wrapper">
            <LayoutDashboard class="icon-stats" />
          </div>
          <h2>AI 부동산 통계 리포트</h2>
        </div>
        <button class="close-btn" @click="closeModal">
          <X />
        </button>
      </div>

      <div class="modal-body" ref="chatContainer">
        <div class="messages-list">
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['message-item', msg.role]"
          >
            <div class="message-bubble">
              <div 
                v-if="msg.role === 'assistant'" 
                class="markdown-content" 
                v-html="renderMarkdown(msg.content)"
              ></div>
              <div v-else class="user-content">
                {{ msg.content }}
              </div>

              <!-- Assistant 결과 (아파트 목록) -->
              <div v-if="msg.results && msg.results.length > 0" class="results-section">
                <div class="results-title">
                  <MapPin class="title-icon" />
                  <span>관련 아파트 목록</span>
                </div>
                <div class="results-grid">
                  <div 
                    v-for="apt in msg.results" 
                    :key="apt.aptSeq" 
                    class="apt-card"
                    @click="handleMove(apt)"
                  >
                    <div class="apt-info">
                      <span class="apt-name">{{ apt.aptName }}</span>
                      <span class="apt-addr">{{ apt.dongName }} {{ apt.aptDong ? apt.aptDong + '동' : '' }}</span>
                    </div>
                    <ArrowRight class="move-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isProcessing" class="message-item assistant">
            <div class="message-bubble loading">
              <Loader2 class="spin-icon" />
              <span>데이터를 분석하여 리포트를 작성하고 있습니다...</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="input-wrapper">
          <input 
            v-model="query" 
            type="text" 
            placeholder="예시: 송파구 30평대 전세가 추이 알려줘"
            @keyup.enter="handleSearch"
            :disabled="isProcessing"
          />
          <button 
            class="send-btn" 
            @click="handleSearch" 
            :disabled="!query.trim() || isProcessing"
          >
            <Send class="send-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-white);
  width: 90%;
  max-width: 800px;
  height: 80vh;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-white);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-stats {
  color: white;
  width: 1.25rem;
  height: 1.25rem;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-gray-900);
  margin: 0;
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
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-item {
  display: flex;
  flex-direction: column;
  max-width: 90%;
}

.message-item.user {
  align-self: flex-end;
}

.message-item.assistant {
  align-self: flex-start;
}

.message-bubble {
  padding: 1.25rem;
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.user .message-bubble {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border-bottom-right-radius: 0.25rem;
  font-weight: 500;
}

.assistant .message-bubble {
  background-color: var(--color-white);
  color: var(--color-gray-800);
  border: 1px solid var(--color-gray-100);
  border-bottom-left-radius: 0.25rem;
}

.message-bubble.loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-gray-500);
  font-size: 0.9rem;
}

.spin-icon {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Markdown Styles */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  color: var(--color-gray-900);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.markdown-content :deep(h2) {
  font-size: 1.125rem;
  border-bottom: 2px solid #e0e7ff;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.75rem;
  border: 1px solid var(--color-gray-100);
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: #f1f5f9;
  font-weight: 700;
}

.markdown-content :deep(strong) {
  color: #4f46e5;
  font-weight: 700;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #6366f1;
  background-color: #f8faff;
  padding: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--color-gray-600);
}

/* Results Section */
.results-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-100);
}

.results-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.title-icon {
  width: 1rem;
  height: 1rem;
  color: #ef4444;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.apt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background-color: #f1f5f9;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.apt-card:hover {
  background-color: #e2e8f0;
  transform: translateX(4px);
}

.apt-info {
  display: flex;
  flex-direction: column;
}

.apt-name {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-gray-900);
}

.apt-addr {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

.move-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-gray-400);
}

/* Footer Input Area */
.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-gray-100);
  background-color: var(--color-white);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f1f5f9;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  border-radius: 9999px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  background-color: var(--color-white);
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.input-wrapper input {
  flex: 1;
  background: none;
  border: none;
  font-size: 0.9375rem;
  color: var(--color-gray-900);
  padding: 0.5rem 0;
}

.input-wrapper input:focus {
  outline: none;
}

.send-btn {
  width: 2.75rem;
  height: 2.75rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.send-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: white;
}
</style>
