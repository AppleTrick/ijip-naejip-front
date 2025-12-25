<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { X, Loader2, MapPin, ArrowRight, LayoutDashboard, Send, FileText, Trash2, Clock, Download } from 'lucide-vue-next'
import { marked } from 'marked'
import html2pdf from 'html2pdf.js'
import http from '@/api/http'
import * as reportApi from '@/api/aiReportApi'
import type { AIReportResponse } from '@/api/types'
import { useMapNavigation } from '@/composables/useMapNavigation'
import { useMarketStatsStore } from '@/stores/marketStats'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'move-location'])

const { moveToLocation } = useMapNavigation()
const statsStore = useMarketStatsStore()
const uiStore = useUiStore()

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
    content: '## 🏠 AI 부동산 리포트 생성\n안녕하세요! 궁금하신 지역의 부동산 통계나 시장 동향에 대해 물어보세요.\n\n**예시 질문:**\n- 강남구와 서초구의 최근 거래가 비교해줘\n- 성수동의 10억 이하 아파트 추천해줘\n- 최근 서울 전체적인 거래 추세가 어때?'
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
  
  // 새로운 질문 시 이전 대화 초기화 (싱글 턴)
  messages.value = [{
    role: 'user',
    content: userMessage
  }]
  
  
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
    
    // AI 응답이 완료되면 보고서 목록 갱신
    await fetchReports()
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
    // 1. 지도 이동 및 줌 레벨 조정
    moveToLocation(lat, lng, 3, item.aptSeq)
    
    // 2. 아파트 상세 정보 조회 및 사이드바 오픈
    if (item.aptSeq) {
      statsStore.selectApartment(item.aptSeq, 'all')
    }
    
    // 3. 모달 닫기
    emit('close')
  }
}

const reports = ref<AIReportResponse[]>([])
const isReportsLoading = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const fetchReports = async () => {
  isReportsLoading.value = true
  try {
    reports.value = await reportApi.getReports()
  } catch (error) {
    console.error('Failed to fetch reports:', error)
  } finally {
    isReportsLoading.value = false
  }
}

const loadReport = (report: AIReportResponse) => {
  // 보고서 조회 시 이전 대화 초기화
  messages.value = [
    {
      role: 'user',
      content: report.query
    },
    {
      role: 'assistant',
      content: report.markdownContent
    }
  ]
  
  scrollToBottom()
}

// 간단한 마크다운 제거 및 미리보기 생성 유틸리티
const getPreviewContent = (markdown: string) => {
  if (!markdown) return ''
  // 1. 헤더 제거
  let text = markdown.replace(/^#+\s+/gm, '')
  // 2. 볼드/이탤릭 제거
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2')
  text = text.replace(/(\*|_)(.*?)\1/g, '$2')
  // 3. 코드블록 제거
  text = text.replace(/```[\s\S]*?```/g, '')
  // 4. 불필요한 공백 제거
  text = text.replace(/\n+/g, ' ').trim()
  
  return text.length > 50 ? text.slice(0, 50) + '...' : text
}

const removeReport = async (id: number) => {
  const confirmed = await uiStore.showConfirm({
    title: '보고서 삭제',
    message: '정말 이 보고서를 삭제하시겠습니까?',
    type: 'confirm'
  })

  if (!confirmed) return
  
  try {
    await reportApi.deleteReport(id)
    reports.value = reports.value.filter(r => r.id !== id)
  } catch (error) {
    console.error('Failed to delete report:', error)
    uiStore.showAlert('보고서 삭제에 실패했습니다.', '오류', 'error')
  }
}

const isDownloading = ref(false)

const downloadPDF = async (content: string, title: string = 'AI_부동산_리포트') => {
  if (isDownloading.value) return
  isDownloading.value = true
  
  try {
    const element = document.createElement('div')
    element.className = 'pdf-export-container markdown-content'
    element.innerHTML = `
      <div style="padding: 40px;">
        <h1 style="color: #111827; margin-bottom: 24px; border-bottom: 2px solid #6366f1; padding-bottom: 12px;">${title}</h1>
        ${renderMarkdown(content)}
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
          본 리포트는 AI 분석을 통해 생성되었으며, 실제 데이터와 차이가 있을 수 있습니다.
          <br/>생성일자: ${new Date().toLocaleString('ko-KR')}
        </div>
      </div>
    `
    
    // PDF 생성을 위한 임시 스타일 적용 (전달된 마크다운 스타일과 일치시키기 위해 스타일 태그 삽입)
    const style = document.createElement('style')
    style.innerHTML = `
      .pdf-export-container { font-family: 'Pretendard', sans-serif; color: #374151; line-height: 1.6; }
      .pdf-export-container h2 { font-size: 1.5rem; color: #111827; margin-top: 24px; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
      .pdf-export-container h3 { font-size: 1.25rem; color: #111827; margin-top: 20px; margin-bottom: 12px; }
      .pdf-export-container p { margin-bottom: 12px; }
      .pdf-export-container ul, .pdf-export-container ol { margin-bottom: 16px; padding-left: 24px; }
      .pdf-export-container li { margin-bottom: 6px; }
      .pdf-export-container table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      .pdf-export-container th, .pdf-export-container td { padding: 10px; border: 1px solid #e5e7eb; text-align: left; }
      .pdf-export-container th { background-color: #f9fafb; font-weight: 600; }
      .pdf-export-container strong { color: #4f46e5; font-weight: 700; }
      .pdf-export-container blockquote { border-left: 4px solid #6366f1; background-color: #f8faff; padding: 12px; margin: 20px 0; font-style: italic; }
    `
    element.appendChild(style)

    const opt = {
      margin: 10,
      filename: `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    }

    await html2pdf().from(element).set(opt).save()
  } catch (error) {
    console.error('PDF Download Error:', error)
    uiStore.showAlert('PDF 다운로드 중 오류가 발생했습니다.', '오류', 'error')
  } finally {
    isDownloading.value = false
  }
}

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  fetchReports()
})
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <div class="icon-wrapper">
            <LayoutDashboard class="icon-stats" />
          </div>
          <h2>AI 부동산 분석 리포트</h2>
        </div>
        <button class="close-btn" @click="closeModal">
          <X />
        </button>
      </div>

      <div class="modal-body-container">
        <!-- Main Chat Area -->
        <div class="chat-area" ref="chatContainer">
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
                >
                  <div class="bubble-header" v-if="index > 0">
                    <button class="download-mini-btn" @click="downloadPDF(msg.content)" :disabled="isDownloading" title="PDF로 다운로드">
                      <Download v-if="!isDownloading" />
                      <Loader2 v-else class="spin-icon" />
                    </button>
                  </div>
                  <div v-html="renderMarkdown(msg.content)"></div>
                </div>
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

        <!-- Right Sidebar: Report List -->
        <div class="report-sidebar">
          <div class="sidebar-header">
            <h3>저장된 보고서</h3>
            <span class="badge">{{ reports.length }}</span>
          </div>
          
          <div v-if="isReportsLoading" class="loading-state">
            <Loader2 class="spin-icon" />
          </div>
          
          <div v-else-if="reports.length === 0" class="empty-state">
            <FileText class="empty-icon" />
            <p>저장된 보고서가 없습니다</p>
          </div>
          
          <div v-else class="report-list">
            <div v-for="report in reports" :key="report.id" class="report-item" @click="loadReport(report)">
              <div class="report-content">
                <h4 class="report-title">{{ report.title }}</h4>
                <p class="report-preview">{{ getPreviewContent(report.markdownContent) }}</p>
                <div class="report-meta">
                  <Clock class="meta-icon" />
                  <span>{{ formatDate(report.createdAt) }}</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="action-btn download" @click.stop="downloadPDF(report.markdownContent, report.title)" :disabled="isDownloading" title="다운로드">
                  <Download v-if="!isDownloading" class="action-icon" />
                  <Loader2 v-else class="spin-icon action-icon" />
                </button>
                <button class="action-btn delete" @click.stop="removeReport(report.id)" title="삭제">
                  <Trash2 class="action-icon" />
                </button>
              </div>
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
  width: 95%;
  max-width: 1200px; /* 확장 */
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

.modal-body-container {
  flex: 1;
  display: flex;
  overflow: hidden; /* 자식 스크롤 제어 */
  background-color: #f8fafc;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Sidebar Styles */
.report-sidebar {
  width: 320px;
  background-color: var(--color-white);
  border-left: 1px solid var(--color-gray-100);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.badge {
  background-color: #f1f5f9;
  color: var(--color-gray-600);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.report-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-item {
  padding: 1rem;
  border: 1px solid var(--color-gray-100);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.report-item:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.05);
  transform: translateY(-2px);
}

.report-content {
  flex: 1;
  min-width: 0; /* 텍스트 말줄임 필수 */
}

.report-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.report-preview {
  font-size: 0.8rem;
  color: var(--color-gray-600);
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.report-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.report-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: all 0.2s;
}

.report-item:hover .report-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.375rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: var(--color-gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.download:hover {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.action-btn.delete:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.bubble-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.download-mini-btn {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: var(--color-gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.download-mini-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.download-mini-btn:hover {
  background-color: #e2e8f0;
  color: #4f46e5;
  border-color: #6366f1;
}

.loading-state, .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-gray-400);
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  opacity: 0.5;
}

/* Response Design */
@media (max-width: 1024px) {
  .report-sidebar {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .modal-body-container {
    flex-direction: column;
  }
  
  .report-sidebar {
    width: 100%;
    height: 200px;
    border-left: none;
    border-top: 1px solid var(--color-gray-100);
  }
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
