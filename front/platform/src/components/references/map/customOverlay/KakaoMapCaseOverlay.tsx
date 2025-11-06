import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { isStandardLandVisibleAtom, toggleStandardLandAtom } from '@store/map/standardLand'
import { formatPrice } from '@util/numberUtils'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { useRef } from 'react'

interface MarkerOverlayProps {
  caseData: KakaoMapSearchCase
  isDragging?: boolean
}

const KakaoMapCaseOverlay: React.FC<MarkerOverlayProps> = ({ caseData, isDragging = false }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const isStandardLandVisible = useAtomValue(isStandardLandVisibleAtom)
  const toggleStandardLand = useSetAtom(toggleStandardLandAtom)

  const formatArea = (area: number): string => {
    return `${area.toLocaleString()}㎡`
  }

  const handleStandardLandToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleStandardLand(caseData.id)
  }

  const hasStandardLand = !!caseData.standardLand
  const isStandardVisible = isStandardLandVisible(caseData.id)

  return (
    <div
      ref={overlayRef}
      className={`bg-white border-2 border-blue-500 rounded-lg shadow-lg min-w-48 max-w-64 transition-all duration-200  ${
        isDragging ? 'scale-105 shadow-xl border-blue-600' : 'shadow-lg'
      }`}
    >
      {/* 드래그 핸들 영역 */}
      <div className="bg-blue-500 text-white px-3 py-2 rounded-t-lg cursor-move flex items-center justify-between select-none">
        <span className="text-xs font-medium">사건 정보</span>
        <span className="text-xs">⋮⋮</span>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-3">
        {/* 헤더 */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {caseData.caseNumber}
            </span>
            <span className="text-xs text-gray-500">{caseData.caseType}</span>
          </div>
        </div>

        {/* 사건명 */}
        <h4
          className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2"
          title={caseData.caseName}
        >
          {caseData.caseName}
        </h4>

        {/* 주소 */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-2" title={caseData.address}>
          {caseData.address}
        </p>

        {/* 면적 및 가격 */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-500">{formatArea(caseData.area)}</span>
          <span className="text-green-600 font-semibold">{formatPrice(caseData.price)}</span>
        </div>

        {/* 표준지 보기 버튼 */}
        {hasStandardLand && (
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleStandardLandToggle}
              className={`w-full px-3 py-1.5 text-xs font-medium rounded transition-colors duration-200 ${
                isStandardVisible
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              }`}
            >
              {isStandardVisible ? '표준지 숨기기' : '표준지 보기'} 🏛️
            </button>
          </div>
        )}
      </div>

      {/* 삼각형 꼬리 (말풍선 효과) - 하단에서 마커를 향해 아래쪽 방향 */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-blue-500"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-px">
          <div className="w-0 h-0 border-l-3 border-r-3 border-b-3 border-l-transparent border-r-transparent border-b-white"></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(KakaoMapCaseOverlay)
