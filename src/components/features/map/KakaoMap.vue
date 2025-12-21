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
  (e: 'update-bounds', bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
// 마커 저장을 위한 Map (Key: aptSeq, Value: CustomOverlay 객체)
const mapMarkers = new Map<string, any>()

// --- 지도 로직 ---

// 마커 초기화: 지도에 표시된 모든 마커를 제거하고 Map을 비움
const clearMarkers = () => {
  mapMarkers.forEach((m) => {
    if (m.vueContainer) {
      render(null, m.vueContainer)
    }
    m.setMap(null)
  })
  mapMarkers.clear()
}

// 개별 마커 생성: 커스텀 오버레이를 사용하여 마커를 생성하고 클릭 이벤트를 연결
const createMarker = (item: Property) => {
  const lat = Number(item.latitude)
  const lng = Number(item.longitude)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn('Invalid coordinates for marker:', item.aptNm, item.latitude, item.longitude)
    return null
  }

  let position
  try {
    position = new window.kakao.maps.LatLng(lat, lng)
  } catch (e) {
    console.error('Error creating LatLng for marker:', item, e)
    return null
  }
  
  const content = document.createElement('div')
  content.className = 'custom-overlay-marker'
  
  if (!MapMarkerOverlay) {
    console.error('MapMarkerOverlay component is missing')
    return null
  }

  const vnode = createVNode(MapMarkerOverlay, {
    price: item.dealAmount,
    name: item.aptNm,
    pyung: item.excluUseAr,
    aptDong: item.aptDong
  })
  render(vnode, content)
  
  content.addEventListener('click', () => {
    emit('select-marker', item)
  })

  const customOverlay = new window.kakao.maps.CustomOverlay({
    position: position,
    content: content,
    yAnchor: 1.2,
    zIndex: 3,
    clickable: true // 클릭 가능하도록 설정
  })
  
  ;(customOverlay as any).vueContainer = content
  
  // markRaw를 사용하여 오버레이 객체의 반응성을 제거 (성능 최적화 및 오류 방지)
  return markRaw(customOverlay)
}

// 마커 목록 렌더링: 기존 마커를 지우는 대신, diffing을 통해 변경된 마커만 업데이트
const renderMarkers = (items: Property[] | undefined) => {
  if (!map.value) return
  const rawMap = toRaw(map.value)

  if (!items || items.length === 0) {
    clearMarkers()
    return
  }

  // 마커의 고유 키 생성: ID뿐만 아니라 데이터(동, 가격, 평형)가 바뀌면 키도 바뀌게 하여 리렌더링 유도
  const getMarkerKey = (item: Property) => `${item.aptSeq}_${item.aptDong || ''}_${item.dealAmount}_${item.excluUseAr}`

  // 1. 현재 표시 중인 마커 ID 셋 생성
  const currentIds = new Set(items.map(item => getMarkerKey(item)))

  // 2. 제거해야 할 마커 삭제
  mapMarkers.forEach((marker, key) => {
    if (!currentIds.has(key)) {
      if (marker.vueContainer) {
        render(null, marker.vueContainer)
      }
      marker.setMap(null)
      mapMarkers.delete(key)
    }
  })

  // 3. 새로 추가해야 할 마커 생성 및 표시
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

// 지도 영역 정보 방출: 현재 지도의 레벨과 남서/북동 좌표를 부모 컴포넌트로 전달
const emitBounds = () => {
  if (!map.value) return

  const rawMap = toRaw(map.value)
  const level = rawMap.getLevel()
  const bounds = rawMap.getBounds()
  const swLatlng = bounds.getSouthWest()
  const neLatlng = bounds.getNorthEast()

  const boundsData = {
    minLat: swLatlng.getLat(),
    maxLat: neLatlng.getLat(),
    minLng: swLatlng.getLng(),
    maxLng: neLatlng.getLng(),
    level: level
  }
  
  emit('update-bounds', boundsData)
}

// 지도 이벤트 초기화: 지도 이동/줌 종료(idle) 시 영역 정보를 갱신하도록 리스너 등록
const initMapEvents = () => {
  if (!map.value) return

  const rawMap = toRaw(map.value)
  emitBounds()

  window.kakao.maps.event.addListener(rawMap, 'idle', function() {
    emitBounds()
  })
}

// 지도 초기화: 카카오맵 인스턴스를 생성하고 초기 설정(중심좌표, 레벨 등)을 적용
const initializeMap = (options: { center: { lat: number, lng: number }, level: number }) => {
  if (!mapContainer.value) return

  let centerLat = options.center.lat
  let centerLng = options.center.lng

  if (!Number.isFinite(centerLat) || !Number.isFinite(centerLng)) {
    console.warn('Invalid center coordinates for initializeMap:', centerLat, centerLng)
    centerLat = DEFAULT_MAP_CENTER.lat
    centerLng = DEFAULT_MAP_CENTER.lng
  }

  const mapOptions = {
    center: new window.kakao.maps.LatLng(centerLat, centerLng),
    level: options.level,
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false
  }
  
  // markRaw를 사용하여 지도 인스턴스의 반응성을 제거 (Vue Proxy 간섭 방지)
  const mapInstance = new window.kakao.maps.Map(mapContainer.value, mapOptions)
  map.value = markRaw(mapInstance)
  
  window.requestAnimationFrame(() => {
    const rawMap = toRaw(map.value)
    rawMap.relayout()
    rawMap.setCenter(mapOptions.center)
    initMapEvents()
  })

  // 리사이즈 옵저버: 컨테이너 크기 변경 시 지도 레이아웃 재설정
  const resizeObserver = new ResizeObserver(() => {
    if (map.value) {
      const rawMap = toRaw(map.value)
      rawMap.relayout()
      const center = rawMap.getCenter()
      rawMap.setCenter(center)
    }
  })
  resizeObserver.observe(mapContainer.value)
}

// 카카오맵 SDK 로드: 스크립트가 없으면 동적으로 로드하고, 로드 완료 시 콜백 실행
const loadKakaoMap = (apiKey: string, onLoad: () => void) => {
  const scriptId = 'kakao-map-sdk'
  
  const load = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(onLoad)
    } else {
      console.warn('Kakao Map SDK not found. Retrying...')
      setTimeout(() => loadKakaoMap(apiKey, onLoad), 500)
    }
  }

  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
    script.onload = load
    document.head.appendChild(script)
  } else {
    load()
  }
}

// 지도 중심 이동 (부드럽게): 지정된 좌표로 지도의 중심을 부드럽게 이동
const panTo = (lat: number, lng: number) => {
  if (!map.value || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn('Invalid coordinates for panTo:', lat, lng)
    return
  }
  try {
    const rawMap = toRaw(map.value)
    const coords = new window.kakao.maps.LatLng(lat, lng)
    rawMap.panTo(coords)
  } catch (e) {
    console.error('Error in panTo:', e)
  }
}



// --- 라이프사이클 및 감시자 ---
onMounted(() => {
  loadKakaoMap(import.meta.env.VITE_KAKAO_API_KEY, () => {
    const options = {
      center: props.center || DEFAULT_MAP_CENTER, // 기본값: 서울시청
      level: props.level || 5
    }
    initializeMap(options)

    if (props.markers && props.markers.length > 0) {
      renderMarkers(props.markers)
    }
  })
})

watch(() => props.markers, (newMarkers) => {
  renderMarkers(newMarkers)
}, { deep: true })

watch(() => props.center, (newCenter, oldCenter) => {
  if (!map.value || !newCenter) return

  const isCenterChanged = !oldCenter || newCenter.lat !== oldCenter.lat || newCenter.lng !== oldCenter.lng

  if (isCenterChanged) {
    panTo(newCenter.lat, newCenter.lng)
  }
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
