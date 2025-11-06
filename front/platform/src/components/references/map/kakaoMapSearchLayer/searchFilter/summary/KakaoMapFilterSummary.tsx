import type { SearchFilters } from '@components/references/map/kakaoMapSearchLayer/hooks/useSearchFilters'
import React from 'react'

import KakaoMapFilterItems from './KakaoMapFilterItems'

interface FilterSummaryProps {
  landCategory: string[]
  usageStatus: string[]
  zoneType: string[]
  onRemoveItem: (filterType: keyof SearchFilters, item: string) => void
  onClearFilter: (filterType: keyof SearchFilters) => void
  onClearAll: () => void
  hasAnySelection: boolean
}

const KakaoMapFilterSummary: React.FC<FilterSummaryProps> = ({
  landCategory,
  usageStatus,
  zoneType,
  onRemoveItem,
  onClearFilter,
  onClearAll,
  hasAnySelection,
}) => {
  if (!hasAnySelection) return null

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">선택된 조건</h4>
        <button
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          전체 초기화
        </button>
      </div>

      <KakaoMapFilterItems
        filterType="landCategory"
        items={landCategory}
        onRemoveItem={onRemoveItem}
        onClearFilter={onClearFilter}
      />
      <KakaoMapFilterItems
        filterType="usageStatus"
        items={usageStatus}
        onRemoveItem={onRemoveItem}
        onClearFilter={onClearFilter}
      />
      <KakaoMapFilterItems
        filterType="zoneType"
        items={zoneType}
        onRemoveItem={onRemoveItem}
        onClearFilter={onClearFilter}
      />

      <div className="text-xs text-gray-500 mt-2">
        총 {landCategory.length + usageStatus.length + zoneType.length}개 조건이 선택되었습니다.
      </div>
    </div>
  )
}

export default React.memo(KakaoMapFilterSummary)
