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

  const filters = ref({
    types: [] as string[],
    priceRange: { min: 0, max: 20 },
    area: [] as string[],
    general: [] as string[]
  })

  // Getters
  const filteredProperties = computed(() => {
    let result = marketProperties.value

    // 1. Search Query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.address.toLowerCase().includes(query)
      )
    }

    // 2. Type Filter
    if (filters.value.types.length > 0) {
      result = result.filter(p => {
        const typeCode = p.type === '아파트' ? 'APT' : p.type === '오피스텔' ? 'OPST' : 'VILLA'
        return filters.value.types.includes(typeCode)
      })
    }

    // 3. Price Filter
    // Mock data price format: "10억 5000만원"
    // We need to parse this to compare with min/max (unit: 100 million / Eok)
    const parsePriceToEok = (priceStr: string): number => {
      let total = 0
      const ukMatch = priceStr.match(/(\d+)억/)
      const manMatch = priceStr.match(/(\d+)만원/)
      
      if (ukMatch) total += parseInt(ukMatch[1])
      if (manMatch) total += parseInt(manMatch[1]) / 10000
      
      return total
    }

    if (filters.value.priceRange.min > 0 || filters.value.priceRange.max < 20) {
      result = result.filter(p => {
        const price = parsePriceToEok(p.price)
        return price >= filters.value.priceRange.min && price <= filters.value.priceRange.max
      })
    }

    // 4. Area Filter
    // Mock data area format: "34평"
    if (filters.value.area.length > 0) {
      result = result.filter(p => {
        const areaVal = parseInt(p.area.replace('평', ''))
        return filters.value.area.some(range => {
          if (range === '40+') return areaVal >= 40
          const min = parseInt(range)
          return areaVal >= min && areaVal < min + 10
        })
      })
    }

    return result
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

  function setFilters(newFilters: any) {
    filters.value = newFilters
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
    filters,
    filteredProperties,
    myHouse,
    comparisonList,
    setMarketProperties,
    selectProperty,
    setAddress,
    setSearchQuery,
    setFilters,
    setMyHouse,
    addToComparison,
    removeFromComparison,
    isInComparison
  }
})
