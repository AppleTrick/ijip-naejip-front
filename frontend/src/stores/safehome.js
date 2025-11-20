import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSafeHomeStore = defineStore('safehome', () => {
  // State
  const marketProperties = ref([])
  const selectedProperty = ref(null)
  const currentAddress = ref('')
  const searchQuery = ref('')

  const myHouse = ref(null)
  const comparisonList = ref([])

  // Getters
  const filteredProperties = computed(() => {
    if (!searchQuery.value) return marketProperties.value
    
    const query = searchQuery.value.toLowerCase()
    return marketProperties.value.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.address.toLowerCase().includes(query)
    )
  })

  const isInComparison = (propertyId) => {
    return comparisonList.value.some(p => p.id === propertyId)
  }

  // Actions
  function setMarketProperties(properties) {
    marketProperties.value = properties
  }

  function selectProperty(property) {
    selectedProperty.value = property
  }

  function setAddress(address) {
    currentAddress.value = address
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setMyHouse(house) {
    myHouse.value = house
  }

  function addToComparison(property) {
    if (!isInComparison(property.id)) {
      comparisonList.value.push(property)
    }
  }

  function removeFromComparison(propertyId) {
    comparisonList.value = comparisonList.value.filter(p => p.id !== propertyId)
  }

  return {
    marketProperties,
    selectedProperty,
    currentAddress,
    searchQuery,
    filteredProperties,
    myHouse,
    comparisonList,
    setMarketProperties,
    selectProperty,
    setAddress,
    setSearchQuery,
    setMyHouse,
    addToComparison,
    removeFromComparison,
    isInComparison
  }
})
