import KakaoMapCaseMapMarker from '@components/references/map/markers/KakaoMapCaseMapMarker'
import StandardLandMarkerContainer from '@components/references/map/markers/KakaoMapStandardLandMarker'
import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import React from 'react'

import CaseOverlayContainer from './KakaoMapCaseOverlayContainer'
import StandardLandOverlayContainer from './KakaoMapStandardLandOverlayContainer'

interface MapOverlaysProps {
  selectedCases: KakaoMapSearchCase[]
  currentZoomLevel: number
  mapRef: React.MutableRefObject<kakao.maps.Map | null>
  mapDraggable: boolean
  setMapDraggable: (draggable: boolean) => void
}

const KakaoMapOverlays: React.FC<MapOverlaysProps> = ({
  selectedCases,
  currentZoomLevel,
  mapRef,
  mapDraggable,
  setMapDraggable,
}) => {
  // 줌 레벨에 따른 조건부 렌더링
  if (currentZoomLevel >= 10) {
    // 클러스터링 모드 (줌 레벨 10 이상)
    return (
      <KakaoMapCaseMapMarker selectedCases={selectedCases} currentZoomLevel={currentZoomLevel} />
    )
  }

  return (
    <>
      {/* 사건 표준지 마커 */}
      <KakaoMapCaseMapMarker selectedCases={selectedCases} currentZoomLevel={currentZoomLevel} />

      {/* 사건 오버레이 (드래그 기능 포함) */}
      <CaseOverlayContainer
        selectedCases={selectedCases}
        mapRef={mapRef}
        mapDraggable={mapDraggable}
        setMapDraggable={setMapDraggable}
      />

      {/* 표준지 마커 */}
      <StandardLandMarkerContainer selectedCases={selectedCases} />

      {/* 표준지 오버레이 (드래그 기능 포함) */}
      <StandardLandOverlayContainer
        selectedCases={selectedCases}
        mapRef={mapRef}
        mapDraggable={mapDraggable}
        setMapDraggable={setMapDraggable}
      />
    </>
  )
}

export default KakaoMapOverlays
