<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  address: String,
  markers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-marker'])

const mapContainer = ref(null)
let map = null
let geocoder = null
let mainMarker = null
let mapMarkers = []

const clearMarkers = () => {
  mapMarkers.forEach(m => m.setMap(null))
  mapMarkers = []
}

const renderMarkers = (items) => {
  clearMarkers()
  if (!map || !items) return

  items.forEach(item => {
    const position = new window.kakao.maps.LatLng(item.lat, item.lng)
    
    // Create Custom Overlay Content using DOM API
    const content = document.createElement('div')
    content.className = 'custom-overlay-marker'
    content.innerHTML = `
      <div class="px-3 py-1.5 bg-white border-2 border-lime-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110 hover:bg-lime-50">
        <span class="text-lime-700 font-extrabold text-sm whitespace-nowrap">${item.price}</span>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-lime-500 transform rotate-45"></div>
      </div>
    `
    
    // Handle Click
    content.addEventListener('click', () => {
      emit('select-marker', item)
    })

    const customOverlay = new window.kakao.maps.CustomOverlay({
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
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        console.log('Kakao Map SDK loaded. Initializing map...')
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // Seoul City Hall
          level: 5
        }
        map = new window.kakao.maps.Map(mapContainer.value, options)
        geocoder = new window.kakao.maps.services.Geocoder()
        
        // Initial Relayout
        setTimeout(() => {
          console.log('Relayout map...')
          map.relayout()
          map.setCenter(options.center)
          if (props.markers.length > 0) {
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
        resizeObserver.observe(mapContainer.value)
      })
    } else {
      console.warn('Kakao Map SDK not found. Retrying...')
      setTimeout(loadMap, 500)
    }
  }

  loadMap()
})


watch(() => props.markers, (newMarkers) => {
  renderMarkers(newMarkers)
}, { deep: true })

watch(() => props.address, (newAddr) => {
  if (!map || !geocoder || !newAddr) return

  geocoder.addressSearch(newAddr, function(result, status) {
    if (status === window.kakao.maps.services.Status.OK) {
      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
      map.setCenter(coords)
      map.setLevel(3)
      
      if (mainMarker) mainMarker.setMap(null)
      mainMarker = new window.kakao.maps.Marker({
        map: map,
        position: coords
      })
    }
  })
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full bg-gray-200"></div>
</template>
