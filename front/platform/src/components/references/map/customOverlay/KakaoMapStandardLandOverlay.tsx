import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { formatPrice } from '@util/numberUtils'
import React from 'react'

interface StandardLandOverlayProps {
  caseData: KakaoMapSearchCase
  standardLandData: NonNullable<KakaoMapSearchCase['standardLand']>
  isDragging?: boolean
}

const KakaoMapStandardLandOverlay: React.FC<StandardLandOverlayProps> = ({
  caseData,
  standardLandData,
  isDragging = false,
}) => {
  const formatArea = (area: number): string => {
    return `${area.toLocaleString()}㎡`
  }

  const formatStandardPrice = (price: number): string => {
    return `${formatPrice(price)}/㎡`
  }

  return (
    <div
      className={`bg-white border-2 border-red-500 rounded-lg shadow-lg min-w-48 max-w-64 transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-xl border-red-600' : 'shadow-lg'
      }`}
    >
      {/* 드래그 핸들 영역 - 빨간색 테마 */}
      <div className="bg-red-500 text-white px-3 py-2 rounded-t-lg cursor-move flex items-center justify-between select-none">
        <span className="text-xs font-medium">표준지 정보</span>
        <span className="text-xs">🏛️</span>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-3">
        {/* 헤더 */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
              {caseData.caseNumber} 표준지
            </span>
            <span className="text-xs text-gray-500">공시지가</span>
          </div>
        </div>

        {/* 표준지 주소 */}
        <h4
          className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2"
          title={standardLandData.address}
        >
          {standardLandData.address}
        </h4>

        {/* 면적 및 공시지가 */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-500">{formatArea(standardLandData.area)}</span>
          <span className="text-red-600 font-semibold">
            {formatStandardPrice(standardLandData.price)}
          </span>
        </div>

        {/* 총 공시지가 */}
        <div className="border-t border-gray-100 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">총 공시지가</span>
            <span className="text-red-700 font-bold">
              {formatPrice(standardLandData.price * standardLandData.area)}
            </span>
          </div>
        </div>
      </div>

      {/* 삼각형 꼬리 (말풍선 효과) - 빨간색 테마 */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-500"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-px">
          <div className="w-0 h-0 border-l-3 border-r-3 border-b-3 border-l-transparent border-r-transparent border-b-white"></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(KakaoMapStandardLandOverlay)
