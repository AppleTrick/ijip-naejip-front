/**
 * Kakao Map SDK 로더 유틸리티
 * 여러 컴포넌트에서 SDK 로딩을 공유할 수 있도록 함
 */

let isLoading = false
let isLoaded = false
let loadPromise: Promise<void> | null = null

export const loadKakaoSDK = (): Promise<void> => {
  // 이미 로드 완료된 경우
  if (isLoaded && window.kakao && window.kakao.maps) {
    return Promise.resolve()
  }
  
  // 로딩 중인 경우 기존 Promise 반환
  if (isLoading && loadPromise) {
    return loadPromise
  }
  
  // 새로 로딩 시작
  isLoading = true
  loadPromise = new Promise((resolve, reject) => {
    // 이미 스크립트가 있는 경우
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        isLoaded = true
        isLoading = false
        resolve()
      })
      return
    }
    
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY
    if (!apiKey) {
      reject(new Error('VITE_KAKAO_API_KEY is not set'))
      return
    }
    
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => {
        isLoaded = true
        isLoading = false
        resolve()
      })
    }
    script.onerror = () => {
      isLoading = false
      reject(new Error('Failed to load Kakao Maps SDK'))
    }
    document.head.appendChild(script)
  })
  
  return loadPromise
}

export const isKakaoLoaded = (): boolean => {
  return !!(window.kakao && window.kakao.maps)
}
