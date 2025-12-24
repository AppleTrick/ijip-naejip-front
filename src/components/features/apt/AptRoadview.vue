ㅁ<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Map as MapIcon, Image as ImageIcon } from 'lucide-vue-next'
import { searchApartmentImage } from '@/api/imageApi'
import { getNearestPanoId } from '@/api/imageApi2'
import { loadKakaoSDK } from '@/utils/kakaoLoader'

interface Props {
  aptSeq: string
  aptNm: string
  address?: string
  latitude?: number | string
  longitude?: number | string
  height?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  address: '',
  height: '100%',
  clickable: true
})

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'

const propertyImage = ref<string | null>(null)
const isImageLoading = ref(false)
const showRoadview = ref(true)
const roadviewRef = ref<HTMLElement | null>(null)
const roadviewInstance = ref<any>(null)
const hasRoadview = ref(false)
const currentPanoId = ref<number | null>(null)

let latestMediaRequestId = 0

const fetchMedia = async () => {
  if (!props.aptNm) return
  
  const requestId = ++latestMediaRequestId
  
  isImageLoading.value = true
  hasRoadview.value = false
  currentPanoId.value = null
  propertyImage.value = null
  showRoadview.value = true
  
  try {
    // Ensuring Kakao SDK is loaded before proceeding with panoId search
    await loadKakaoSDK()
    const lat = typeof props.latitude === 'string' ? parseFloat(props.latitude) : props.latitude
    const lng = typeof props.longitude === 'string' ? parseFloat(props.longitude) : props.longitude

    const [panoId, url] = await Promise.all([
      lat && lng ? getNearestPanoId(lat, lng) : Promise.resolve(null),
      searchApartmentImage(props.aptNm, props.address)
    ])

    if (requestId !== latestMediaRequestId) return

    hasRoadview.value = !!panoId
    currentPanoId.value = panoId
    showRoadview.value = !!panoId
    propertyImage.value = url || FALLBACK_IMAGE
  } catch (error) {
    if (requestId === latestMediaRequestId) {
      console.error('Error fetching media:', error)
      propertyImage.value = FALLBACK_IMAGE
      hasRoadview.value = false
    }
  } finally {
    if (requestId === latestMediaRequestId) {
      isImageLoading.value = false
    }
  }
}

const updateRoadview = async () => {
  await loadKakaoSDK()
  if (!roadviewRef.value || !currentPanoId.value || !window.kakao) return
  
  try {
    const rv = new window.kakao.maps.Roadview(roadviewRef.value)
    roadviewInstance.value = rv
    
    const lat = typeof props.latitude === 'string' ? parseFloat(props.latitude) : props.latitude
    const lng = typeof props.longitude === 'string' ? parseFloat(props.longitude) : props.longitude

    rv.setPanoId(currentPanoId.value, new window.kakao.maps.LatLng(lat, lng))
  } catch (e) {
    console.error('[AptRoadview] Roadview initialization error:', e)
  }
}

watch([showRoadview, currentPanoId], ([newShow, newPano]) => {
  if (newShow && newPano) {
    nextTick(() => {
      updateRoadview()
    })
  }
})

watch([() => props.aptSeq, () => props.latitude, () => props.longitude], () => {
  fetchMedia()
}, { immediate: true })

const handleImageError = () => {
  propertyImage.value = FALLBACK_IMAGE
}
</script>

<template>
  <div class="apt-roadview" :style="{ height: height }">
    <div v-if="isImageLoading" class="image-loader">
      <div class="spinner"></div>
    </div>
    
    <div v-if="showRoadview && hasRoadview" ref="roadviewRef" class="roadview-container"></div>
    
    <img v-else :src="propertyImage || FALLBACK_IMAGE" 
         alt="Property" class="header-image"
         referrerpolicy="no-referrer"
         @error="handleImageError"
         :class="{ 'is-loading': isImageLoading }">
    
    <div class="header-overlay"></div>
    
    <div v-if="hasRoadview" class="media-toggle">
      <button 
        @click.stop="showRoadview = !showRoadview" 
        class="toggle-btn"
        type="button"
      >
        <component :is="showRoadview ? ImageIcon : MapIcon" class="icon-xs" />
        <span>{{ showRoadview ? '사진' : '로드뷰' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.apt-roadview {
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--color-gray-200);
}

.roadview-container, .header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  pointer-events: none;
}

.image-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  z-index: 10;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.media-toggle {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 5;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.icon-xs {
  width: 1rem;
  height: 1rem;
}

.is-loading {
  filter: blur(5px);
}
</style>
