/**
 * Kakao 로드뷰 관련 유틸리티
 */

/**
 * 특정 좌표(위도, 경도)에서 가장 가까운 로드뷰 panoId를 찾습니다.
 * @param lat 위도
 * @param lng 경도
 * @returns panoId 또는 null (로드뷰가 없는 경우)
 */
export const getNearestPanoId = (lat: number, lng: number): Promise<number | null> => {
  return new Promise((resolve) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Map SDK is not loaded yet.');
      resolve(null);
      return;
    }

    const roadviewClient = new window.kakao.maps.RoadviewClient();
    const position = new window.kakao.maps.LatLng(lat, lng);

    // 100m 반경 내에서 가장 가까운 로드뷰 지점을 찾음
    roadviewClient.getNearestPanoId(position, 100, (panoId: number | null) => {
      if (panoId) {
        resolve(panoId);
      } else {
        console.warn('No Roadview found near this position.');
        resolve(null);
      }
    });
  });
};
