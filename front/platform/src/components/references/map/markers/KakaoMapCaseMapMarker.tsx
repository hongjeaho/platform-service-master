import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import React from 'react'
import { MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk'

interface MapMarkersProps {
  selectedCases: KakaoMapSearchCase[]
  currentZoomLevel: number
}

const KakaoMapCaseMapMarker: React.FC<MapMarkersProps> = ({ selectedCases, currentZoomLevel }) => {
  const markerIcon = {
    src:
      'data:image/svg+xml;base64,' +
      btoa(`
        <svg width="24" height="35" viewBox="0 0 24 35" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.383 0 0 5.383 0 12c0 9 12 23 12 23s12-14 12-23c0-6.617-5.383-12-12-12z" fill="#2563eb"/>
          <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
      `),
    size: { width: 24, height: 35 },
    options: { offset: { x: 12, y: 35 } },
  }

  const clusterStyles = [
    {
      width: '30px',
      height: '30px',
      background: 'rgba(37, 99, 235, 0.8)',
      borderRadius: '15px',
      color: '#fff',
      textAlign: 'center' as const,
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: '30px',
    },
    {
      width: '40px',
      height: '40px',
      background: 'rgba(37, 99, 235, 0.8)',
      borderRadius: '20px',
      color: '#fff',
      textAlign: 'center' as const,
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '40px',
    },
    {
      width: '50px',
      height: '50px',
      background: 'rgba(37, 99, 235, 0.8)',
      borderRadius: '25px',
      color: '#fff',
      textAlign: 'center' as const,
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '50px',
    },
  ]

  // 좌표가 있는 사건만 필터링
  const validCases = selectedCases.filter(caseItem => caseItem.coordinates)

  // 줌 레벨에 따른 조건부 렌더링
  if (currentZoomLevel >= 10) {
    // 클러스터링 모드 (줌 레벨 10 이상)
    return (
      <MarkerClusterer
        averageCenter={true}
        minLevel={10}
        disableClickZoom={false}
        calculator={[2, 5, 10]}
        styles={clusterStyles}
      >
        {validCases.map(caseItem => (
          <MapMarker
            key={`marker-${caseItem.id}`}
            position={caseItem.coordinates!}
            image={markerIcon}
          />
        ))}
      </MarkerClusterer>
    )
  }

  // 개별 표시 모드 (줌 레벨 9 이하)
  return (
    <>
      {validCases.map(caseItem => (
        <MapMarker
          key={`individual-marker-${caseItem.id}`}
          position={caseItem.coordinates!}
          image={markerIcon}
        />
      ))}
    </>
  )
}

export default KakaoMapCaseMapMarker
