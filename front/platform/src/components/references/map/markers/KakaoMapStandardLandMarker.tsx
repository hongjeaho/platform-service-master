import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { standardLandVisibilityAtom } from '@store/map/standardLand'
import { useAtomValue } from 'jotai'
import React from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'

interface StandardLandMarkerContainerProps {
  selectedCases: KakaoMapSearchCase[]
}

const KakaoMapStandardLandMarker: React.FC<StandardLandMarkerContainerProps> = ({
  selectedCases,
}) => {
  const standardLandVisibility = useAtomValue(standardLandVisibilityAtom)

  // 표준지가 표시되어야 하는 사건들 필터링
  const visibleStandardLandCases = selectedCases.filter(
    caseItem => caseItem.standardLand && standardLandVisibility[caseItem.id],
  )

  return (
    <>
      {visibleStandardLandCases.map(caseItem => {
        const standardLand = caseItem.standardLand!
        const standardLandPosition = standardLand.coordinates

        return (
          <MapMarker
            key={`standard-marker-${caseItem.id}`}
            position={standardLandPosition}
            image={{
              src:
                'data:image/svg+xml;base64,' +
                btoa(`
                <svg width="24" height="35" viewBox="0 0 24 35" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.383 0 0 5.383 0 12c0 9 12 23 12 23s12-14 12-23c0-6.617-5.383-12-12-12z" fill="#dc2626"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                  <rect x="8" y="8" width="8" height="8" fill="#dc2626"/>
                </svg>
              `),
              size: { width: 24, height: 35 },
              options: { offset: { x: 12, y: 35 } },
            }}
          />
        )
      })}
    </>
  )
}

export default React.memo(KakaoMapStandardLandMarker)
