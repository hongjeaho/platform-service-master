import { KAKAO_MAP_CONFIG } from '@constants/map/kakaoMap'
import { mapMoveRequestAtom } from '@store/map/selectedCases'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Kakao Map Core functionality를 제공하는 React Hook.
 * Kakao Map의 중심 위치 이동, 줌 레벨 설정, 지도 생성 등의 기본 동작을 관리합니다.
 *
 * @constant {function} useKakaoMapCore Kakao Map Core를 초기화 및 관리하기 위한 Hook.
 * @property {React.RefObject<kakao.maps.Map | null>} mapRef Kakao 지도 객체에 대한 참조를 제공.
 * @property {{ lat: number; lng: number }} mapCenter 현재 지도 중심 좌표를 나타냄.
 * @property {boolean} mapDraggable 지도의 드래그 가능 여부를 설정.
 * @property {function} setMapDraggable 지도 드래그 상태를 수정하는 setter 함수.
 * @property {number} currentZoomLevel 현재 지도 줌 레벨.
 * @property {function} handleMapCreate Kakao Map 객체 생성 시 호출되는 처리 함수로, 이벤트 및 초기화 설정에 사용.
 *
 * @returns {object} Kakao Map 관리에 필요한 기능 및 상태를 포함한 객체 제공.
 */
export const useKakaoMapCore = () => {
  const mapMoveRequest = useAtomValue(mapMoveRequestAtom)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    ...KAKAO_MAP_CONFIG.CENTER,
  })
  const [mapDraggable, setMapDraggable] = useState(true)
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(KAKAO_MAP_CONFIG.ZOOM_LEVEL)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const lastProcessedTimestamp = useRef<number>(0)

  // 좌표 유효성 검증 함수
  const isValidCoordinates = useCallback((coords: { lat: number; lng: number }) => {
    return (
      coords &&
      coords.lat >= -90 &&
      coords.lat <= 90 &&
      coords.lng >= -180 &&
      coords.lng <= 180 &&
      !isNaN(coords.lat) &&
      !isNaN(coords.lng)
    )
  }, [])

  // 지도 중심 이동 함수 (Map ref 직접 제어)
  const moveMapToPosition = useCallback(
    (coordinates: { lat: number; lng: number }) => {
      // 좌표 유효성 검증
      if (!isValidCoordinates(coordinates)) {
        console.error('유효하지 않은 좌표:', coordinates)
        return
      }

      // React 상태 업데이트
      setMapCenter(coordinates)

      // kakao.maps.Map 인스턴스 직접 제어
      if (mapRef.current) {
        const kakaoLatLng = new kakao.maps.LatLng(coordinates.lat, coordinates.lng)
        mapRef.current.setCenter(kakaoLatLng)
        mapRef.current.setLevel(KAKAO_MAP_CONFIG.ZOOM_LEVEL) // 줌 레벨도 설정
      }
    },
    [isValidCoordinates],
  )

  // Map 인스턴스 생성 처리
  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    mapRef.current = map

    // 줌 레벨 변화 이벤트 리스너 등록
    kakao.maps.event.addListener(map, 'zoom_changed', () => {
      const level = map.getLevel()
      setCurrentZoomLevel(level)
    })
  }, [])

  // 지도 이동 요청 감지 및 처리
  useEffect(() => {
    if (mapMoveRequest && mapMoveRequest.timestamp > lastProcessedTimestamp.current) {
      lastProcessedTimestamp.current = mapMoveRequest.timestamp
      moveMapToPosition(mapMoveRequest.coordinates)
    }
  }, [mapMoveRequest, moveMapToPosition])

  return {
    mapRef,
    mapCenter,
    mapDraggable,
    setMapDraggable,
    currentZoomLevel,
    handleMapCreate,
  }
}
