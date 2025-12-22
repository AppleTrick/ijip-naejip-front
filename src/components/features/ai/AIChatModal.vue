<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { X, Send, Bot, Loader2 } from 'lucide-vue-next'
import http from '@/api/http'

const props = defineProps<{
  isOpen: boolean
  apartmentName: string
  areaCode: string
}>()

const emit = defineEmits(['close'])

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([
  { id: 1, role: 'assistant', content: `안녕하세요! ${props.apartmentName}에 대해 궁금한 점이 있으신가요? 주변 상권, 교통, 학군 등 무엇이든 물어보세요!` }
])

const inputMessage = ref('')
const isSending = ref(false)
const chatBody = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

const handleSend = async () => {
  if (!inputMessage.value.trim() || isSending.value) return

  const userContent = inputMessage.value
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: userContent
  })
  
  inputMessage.value = ''
  isSending.value = true
  await scrollToBottom()

  try {
    const response = await http.get('/api/v1/ai/analysis', {
      params: {
        areaCode: props.areaCode,
        aptName: props.apartmentName
      }
    })
    
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: response.data.data || '죄송합니다. 정보를 가져오는 중 오류가 발생했습니다.'
    })
  } catch (error) {
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: '서버와 통신 중 오류가 발생했습니다.'
    })
  } finally {
    isSending.value = false
    await scrollToBottom()
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="chat-modal-overlay" @click.self="closeModal">
    <div class="chat-modal-content">
      <div class="chat-header">
        <div class="header-info">
          <div class="bot-avatar">
            <Bot class="icon-sm" />
          </div>
          <div>
            <h3>지능형 지역 에이전트</h3>
            <p>{{ apartmentName }} 전문가</p>
          </div>
        </div>
        <button class="close-btn" @click="closeModal">
          <X />
        </button>
      </div>

      <div class="chat-body" ref="chatBody">
        <div v-for="msg in messages" :key="msg.id" :class="['message-wrapper', msg.role]">
          <div class="message-bubble">
            {{ msg.content }}
          </div>
        </div>
        <div v-if="isSending" class="message-wrapper assistant">
          <div class="message-bubble loading">
            <Loader2 class="spin-icon" />
            생각 중...
          </div>
        </div>
      </div>

      <div class="chat-footer">
        <div class="input-wrapper">
          <input 
            v-model="inputMessage" 
            type="text" 
            placeholder="메시지를 입력하세요..." 
            @keyup.enter="handleSend"
          />
          <button 
            class="send-btn" 
            :disabled="!inputMessage.trim() || isSending"
            @click="handleSend"
          >
            <Send class="icon-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 2rem;
  z-index: 1100;
}

.chat-modal-content {
  background-color: var(--color-white);
  width: 400px;
  height: 600px;
  max-height: 80vh;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-in {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.chat-header {
  padding: 1.25rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-info h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.header-info p {
  font-size: 0.75rem;
  opacity: 0.8;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-white);
  opacity: 0.7;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.2s;
}

.close-btn:hover { opacity: 1; }

.chat-body {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--color-gray-50);
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.user { justify-content: flex-end; }
.message-wrapper.assistant { justify-content: flex-start; }

.message-bubble {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  white-space: pre-wrap; /* 줄바꿈 및 공백 유지 */
}

.user .message-bubble {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-bottom-right-radius: 0.25rem;
}

.assistant .message-bubble {
  background-color: var(--color-white);
  color: var(--color-gray-800);
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.message-bubble.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray-500);
}

.chat-footer {
  padding: 1.25rem;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-gray-100);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-gray-50);
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-200);
}

.input-wrapper input {
  flex: 1;
  background: none;
  border: none;
  font-size: 0.9375rem;
}

.input-wrapper input:focus { outline: none; }

.send-btn {
  width: 2.25rem;
  height: 2.25rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.send-btn:disabled {
  background-color: var(--color-gray-300);
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  transform: scale(1.05);
  background-color: var(--color-primary-dark);
}

.spin-icon {
  animation: spin 1s linear infinite;
  width: 1rem;
  height: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .chat-modal-overlay {
    padding: 0;
  }
  .chat-modal-content {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
