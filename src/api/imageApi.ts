/**
 * Kakao 이미지 검색 API를 활용한 아파트 이미지 검색 유틸리티
 */

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_IMAGE_SEARCH_URL = 'https://dapi.kakao.com/v2/search/image';

// 간단한 인메모리 캐시 (Key: query, Value: imageUrl)
const imageCache = new Map<string, string | null>();

/**
 * 아파트 이름과 주소를 검색어로 하여 이미지를 검색하고 첫 번째 결과의 URL을 반환합니다.
 * @param aptName 아파트 이름
 * @param address 아파트 주소
 * @returns 이미지 URL 또는 null (검색 결과가 없는 경우)
 */
export const searchApartmentImage = async (aptName: string, address: string = ''): Promise<string | null> => {
  if (!KAKAO_REST_API_KEY) {
    console.error('Kakao REST API Key is missing. Please set VITE_KAKAO_REST_API_KEY in .env');
    return null;
  }

  const query = `${address} ${aptName} 이미지`;

  // 캐시 확인
  if (imageCache.has(query)) {
    console.log(`[ImageSearch] Cache Hit: "${query}"`);
    return imageCache.get(query) || null;
  }

  try {
    console.log(`[ImageSearch] Query: "${query}"`);
    
    const response = await fetch(`${KAKAO_IMAGE_SEARCH_URL}?query=${encodeURIComponent(query)}&size=1`, {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Kakao API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const resultUrl = data.documents[0].image_url;
      console.log(`[ImageSearch] Found Image: ${resultUrl}`);
      // 캐시에 저장
      imageCache.set(query, resultUrl);
      return resultUrl;
    }

    console.warn(`[ImageSearch] No results found for: "${query}"`);
    imageCache.set(query, null);
    return null;
  } catch (error) {
    console.error('Error searching apartment image:', error);
    return null;
  }
};
