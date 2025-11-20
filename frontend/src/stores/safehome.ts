import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Property {
  id: number | string
  name: string
  address: string
  price: string
  area: string
  floor: string
  type: string
  lat: number
  lng: number
  deposit?: string
  maintenanceFee?: string
  description?: string
  safetyScore?: number
}

export interface House {
  name: string
  address: string
  price: string
  area: string
  floor: string
}

export const useSafeHomeStore = defineStore('safehome', () => {
  // State
  const marketProperties = ref<Property[]>([])
  const selectedProperty = ref<Property | null>(null)
  const currentAddress = ref<string>('')
  const searchQuery = ref<string>('')

  const myHouse = ref<House | null>(null)
  const comparisonList = ref<Property[]>([])

  // Getters
  const filteredProperties = computed(() => {
    if (!searchQuery.value) return marketProperties.value
    
    const query = searchQuery.value.toLowerCase()
    return marketProperties.value.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.address.toLowerCase().includes(query)
    )
  })

  const isInComparison = (propertyId: number | string) => {
    return comparisonList.value.some(p => p.id === propertyId)
  }

  // Actions
  function setMarketProperties(properties: Property[]) {
    marketProperties.value = properties
  }

  function selectProperty(property: Property | null) {
    selectedProperty.value = property
  }

  function setAddress(address: string) {
    currentAddress.value = address
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setMyHouse(house: House | null) {
    myHouse.value = house
  }

  function addToComparison(property: Property) {
    if (!isInComparison(property.id)) {
      comparisonList.value.push(property)
    }
  }

  function removeFromComparison(propertyId: number | string) {
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
