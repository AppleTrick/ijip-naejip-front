<script setup lang="ts">
import { ref, onMounted, watch, createVNode, render } from 'vue'
import MapMarkerOverlay from './MapMarkerOverlay.vue'

import type { Property } from '@/api/types'

const props = defineProps<{
  address?: string
  markers?: Property[]
}>()

const emit = defineEmits<{
  (e: 'select-marker', property: Property): void
  (e: 'update-bounds', bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number, level: number }): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null
let geocoder: any = null
let mainMarker: any = null
let mapMarkers: any[] = []

const clearMarkers = () => {
  mapMarkers.forEach(m => {
    // Unmount Vue component to prevent memory leaks
    if (m.vueContainer) {
      render(null, m.vueContainer)
    }
    m.setMap(null)
  })
  mapMarkers = []
}

const renderMarkers = (items: Property[] | undefined) => {
  clearMarkers()
  if (!map || !items) {
    return
  }

  items.forEach(item => {
    const position = new (window as any).kakao.maps.LatLng(item.latitude, item.longitude)
    
    // Create container for Vue component
    const content = document.createElement('div')
    content.className = 'custom-overlay-marker'
    
    // Create Vue VNode and render it to the container
    const vnode = createVNode(MapMarkerOverlay, {
      price: item.dealAmount
    })
    render(vnode, content)
    
    // Handle Click (Add event listener to the container)
    content.addEventListener('click', () => {
      emit('select-marker', item)
    })

    const customOverlay = new (window as any).kakao.maps.CustomOverlay({
      position: position,
      content: content,
      yAnchor: 1.2,
      zIndex: 3
    })
    
    // Store container reference for cleanup
    ;(customOverlay as any).vueContainer = content
    
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
        
        const emitBounds = () => {
          if (!map) return
          const level = map.getLevel()
          const bounds = map.getBounds()
          const swLatlng = bounds.getSouthWest()
          const neLatlng = bounds.getNorthEast()

          const boundsData = {
            minLat: swLatlng.getLat(),
            maxLat: neLatlng.getLat(),
            minLng: swLatlng.getLng(),
            maxLng: neLatlng.getLng(),
            level: level
          }
          
          console.log('Emitting update-bounds:', boundsData)
          emit('update-bounds', boundsData)
        }

        // Initial Relayout
        window.requestAnimationFrame(() => {
          console.log('Relayout map...')
          map.relayout()
          map.setCenter(options.center)
          
          // Emit initial bounds
          console.log('Initial bounds check')
          emitBounds()

          if (props.markers && props.markers.length > 0) {
            renderMarkers(props.markers)
          }
        })

        // Add idle event listener
        console.log('Adding idle event listener')
        ;(window as any).kakao.maps.event.addListener(map, 'idle', function() {
          console.log('Map idle event fired')
          emitBounds()
        })

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
  console.log('KakaoMap: markers prop updated:', newMarkers?.length)
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
