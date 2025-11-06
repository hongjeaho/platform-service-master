import KakaoMapOverlays from '@components/references/map/customOverlay/KakaoMapOverlays'
import { useKakaoMapCore } from '@components/references/map/hooks/useKakaoMapCore'
import { useKakaoMapResultSelectedCases } from '@components/references/map/kakaoMapSearchLayer/hooks/useKakaoMapResultSelectedCases'
import { KAKAO_MAP_CONFIG } from '@constants/map/kakaoMap'
import React from 'react'
import { Map } from 'react-kakao-maps-sdk'

interface KakaoMapProps {
  width?: string
  height?: string
  className?: string
}

const KakaoMap: React.FC<KakaoMapProps> = ({ width, height, className }) => {
  const { selectedCases } = useKakaoMapResultSelectedCases()
  const { mapRef, mapCenter, mapDraggable, setMapDraggable, currentZoomLevel, handleMapCreate } =
    useKakaoMapCore()

  return (
    <div className={`w-full h-full ${className || ''}`} style={{ width, height }}>
      <Map
        center={mapCenter}
        style={{
          width: '100%',
          height: '100%',
        }}
        level={KAKAO_MAP_CONFIG.ZOOM_LEVEL}
        draggable={mapDraggable}
        onCreate={handleMapCreate}
      >
        <KakaoMapOverlays
          selectedCases={selectedCases}
          currentZoomLevel={currentZoomLevel}
          mapRef={mapRef}
          mapDraggable={mapDraggable}
          setMapDraggable={setMapDraggable}
        />
      </Map>
    </div>
  )
}

export default KakaoMap
