<script setup lang="ts">
import { ref, onMounted, watch, createVNode, render, markRaw, toRaw } from 'vue'
import type { Property } from '@/api/types'
import MapMarkerOverlay from '@/components/features/map/MapMarkerOverlay.vue'
import { DEFAULT_MAP_CENTER } from '@/constants/map'

declare global {
  interface Window {
    kakao: any
  }
}

const props = defineProps<{
  markers?: Property[]
  center?: { lat: number, lng: number }
  level?: number
}>()

const emit = defineEmits<{
  (e: 'select-marker', property: Property): void
  (e: 'update-bounds', bounds: { 
    minLat: number, 
    maxLat: number, 
    minLng: number, 
    maxLng: number, 
    centerLat: number,
    centerLng: number,
    level: number 
  }): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const mapMarkers = new Map<string, any>()
let idleDebounceTimer: ReturnType<typeof setTimeout> | null = null

// --- 마커 관리 ---
const clearMarkers = () => {
  mapMarkers.forEach((m) => {
    if (m.vueContainer) render(null, m.vueContainer)
    m.setMap(null)
  })
  mapMarkers.clear()
}

const createMarker = (item: Property) => {
  const lat = Number(item.latitude)
  const lng = Number(item.longitude)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const position = new window.kakao.maps.LatLng(lat, lng)
  const content = document.createElement('div')
  content.className = 'custom-overlay-marker'
  
  const vnode = createVNode(MapMarkerOverlay, {
    price: item.dealAmount,
    name: item.aptNm,
    pyung: item.excluUseAr,
    aptDong: item.aptDong,
    pricePerPyung: item.pricePerPyung
  })
  render(vnode, content)
  
  content.addEventListener('click', () => emit('select-marker', item))

  const customOverlay = new window.kakao.maps.CustomOverlay({
    position,
    content,
    yAnchor: 1.2,
    zIndex: 3,
    clickable: true
  })
  
  ;(customOverlay as any).vueContainer = content
  return markRaw(customOverlay)
}

const renderMarkers = (items: Property[] | undefined) => {
  if (!map.value) return
  const rawMap = toRaw(map.value)

  if (!items || items.length === 0) {
    clearMarkers()
    return
  }

  const getMarkerKey = (item: Property) => `${item.aptSeq}_${item.aptDong || ''}`
  const currentIds = new Set(items.map(getMarkerKey))

  // 불필요한 마커 제거
  mapMarkers.forEach((marker, key) => {
    if (!currentIds.has(key)) {
      if (marker.vueContainer) render(null, marker.vueContainer)
      marker.setMap(null)
      mapMarkers.delete(key)
    }
  })

  // 신규 마커 추가
  items.forEach(item => {
    const key = getMarkerKey(item)
    if (!mapMarkers.has(key)) {
      const marker = createMarker(item)
      if (marker) {
        marker.setMap(rawMap)
        mapMarkers.set(key, marker)
      }
    }
  })
}

// --- 지도 제어 ---
const emitBounds = () => {
  if (!map.value) return
  const rawMap = toRaw(map.value)
  const level = rawMap.getLevel()
  const center = rawMap.getCenter()
  const bounds = rawMap.getBounds()
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  emit('update-bounds', {
    minLat: sw.getLat(),
    maxLat: ne.getLat(),
    minLng: sw.getLng(),
    maxLng: ne.getLng(),
    centerLat: center.getLat(),
    centerLng: center.getLng(),
    level
  })
}

const initializeMap = (options: { center: { lat: number, lng: number }, level: number }) => {
  if (!mapContainer.value) return

  const mapOptions = {
    center: new window.kakao.maps.LatLng(options.center.lat, options.center.lng),
    level: options.level,
    draggable: true,
    scrollwheel: true
  }
  
  const mapInstance = new window.kakao.maps.Map(mapContainer.value, mapOptions)
  map.value = markRaw(mapInstance)
  
  window.kakao.maps.event.addListener(mapInstance, 'idle', () => {
    if (idleDebounceTimer) clearTimeout(idleDebounceTimer)
    idleDebounceTimer = setTimeout(emitBounds, 300)
  })
  
  // 초기 레이아웃 보정
  setTimeout(() => {
    mapInstance.relayout()
    emitBounds()
  }, 100)

  const resizeObserver = new ResizeObserver(() => mapInstance.relayout())
  resizeObserver.observe(mapContainer.value)
}

const loadKakaoMap = (apiKey: string, onLoad: () => void) => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(onLoad)
    return
  }

  const script = document.createElement('script')
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
  script.onload = () => window.kakao.maps.load(onLoad)
  document.head.appendChild(script)
}

// --- 라이프사이클 및 감시 ---
onMounted(() => {
  loadKakaoMap(import.meta.env.VITE_KAKAO_API_KEY, () => {
    const targetCenter = props.center || DEFAULT_MAP_CENTER
    console.log('KakaoMap 초기화 좌표:', targetCenter.lat, targetCenter.lng)
    initializeMap({
      center: targetCenter,
      level: props.level || 5
    })
    if (props.markers?.length) renderMarkers(props.markers)
  })
})

watch(() => props.markers, renderMarkers)

watch(() => props.center, (newCenter) => {
  if (!map.value || !newCenter) return
  const rawMap = toRaw(map.value)
  const currentCenter = rawMap.getCenter()
  
  // 미세한 차이(0.00001)는 무시하여 무한 루프 및 스냅백 방지
  const latDiff = Math.abs(currentCenter.getLat() - newCenter.lat)
  const lngDiff = Math.abs(currentCenter.getLng() - newCenter.lng)
  
  if (latDiff > 0.00001 || lngDiff > 0.00001) {
    rawMap.panTo(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng))
  }
}, { deep: true })

watch(() => props.level, (newLevel) => {
  if (!map.value || newLevel === undefined) return
  const rawMap = toRaw(map.value)
  if (rawMap.getLevel() !== newLevel) rawMap.setLevel(newLevel)
})
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  background-color: var(--color-gray-200);
}
</style>
