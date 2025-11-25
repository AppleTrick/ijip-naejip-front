<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { colors } from '@/constants/colors'

import type { Property } from '@/stores/safehome'

const props = defineProps<{
  address?: string
  markers?: Property[]
}>()

const emit = defineEmits<{
  (e: 'select-marker', property: Property): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null
let geocoder: any = null
let mainMarker: any = null
let mapMarkers: any[] = []

const clearMarkers = () => {
  mapMarkers.forEach(m => m.setMap(null))
  mapMarkers = []
}

const renderMarkers = (items: Property[] | undefined) => {
  clearMarkers()
  if (!map || !items) return

    items.forEach(item => {
    const position = new (window as any).kakao.maps.LatLng(item.lat, item.lng)
    
    // Create Custom Overlay Content using DOM API
    const content = document.createElement('div')
    content.className = 'custom-overlay-marker'
    // We use inline styles here because this HTML is injected outside of Vue's scope
    content.innerHTML = `
      <div style="
        padding: 0.5rem 1rem;
        background-color: white;
        border: 2px solid ${colors.primary};
        border-radius: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px ${colors.primaryTransparent30};
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <span style="
          color: ${colors.primary};
          font-weight: 800;
          font-size: 0.875rem;
          white-space: nowrap;
          font-family: 'Pretendard', sans-serif;
        ">${item.price}</span>
      </div>
    `
    
    // Handle Click
    content.addEventListener('click', () => {
      emit('select-marker', item)
    })

    const customOverlay = new (window as any).kakao.maps.CustomOverlay({
      position: position,
      content: content,
      yAnchor: 1.2,
      zIndex: 3
    })
    
    customOverlay.setMap(map)
    mapMarkers.push(customOverlay)
  })
}

onMounted(() => {
  const loadMap = () => {
    if ((window as any).kakao && (window as any).kakao.maps) {
      (window as any).kakao.maps.load(() => {
        console.log('Kakao Map SDK loaded. Initializing map...')
        const options = {
          center: new (window as any).kakao.maps.LatLng(37.566826, 126.9786567), // Seoul City Hall
          level: 5
        }
        map = new (window as any).kakao.maps.Map(mapContainer.value, options)
        geocoder = new (window as any).kakao.maps.services.Geocoder()
        
        // Initial Relayout
        setTimeout(() => {
          console.log('Relayout map...')
          map.relayout()
          map.setCenter(options.center)
          if (props.markers && props.markers.length > 0) {
            renderMarkers(props.markers)
          }
        }, 500) // Increased delay to 500ms

        // Resize Observer for Responsive Layout
        const resizeObserver = new ResizeObserver(() => {
          if (map) {
            map.relayout()
            const center = map.getCenter()
            map.setCenter(center)
          }
        })
        if (mapContainer.value) {
          resizeObserver.observe(mapContainer.value)
        }
      })
    } else {
      console.warn('Kakao Map SDK not found. Retrying...')
      setTimeout(loadMap, 500)
    }
  }

  // Dynamic Script Loading
  const scriptId = 'kakao-map-sdk'
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&libraries=services&autoload=false`
    script.onload = () => loadMap()
    document.head.appendChild(script)
  } else {
    loadMap()
  }
})


watch(() => props.markers, (newMarkers) => {
  renderMarkers(newMarkers)
}, { deep: true })

watch(() => props.address, (newAddr) => {
  if (!map || !geocoder || !newAddr) return

  geocoder.addressSearch(newAddr, function(result: any[], status: any) {
    if (status === (window as any).kakao.maps.services.Status.OK) {
      const coords = new (window as any).kakao.maps.LatLng(result[0].y, result[0].x)
      map.setCenter(coords)
      map.setLevel(3)
      
      if (mainMarker) mainMarker.setMap(null)
      mainMarker = new (window as any).kakao.maps.Marker({
        map: map,
        position: coords
      })
    }
  })
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
