import type { SearchFilters } from '@components/references/map/kakaoMapSearchLayer/hooks/useSearchFilters'
import KakaoMapLandCategoryCondition from '@components/references/map/kakaoMapSearchLayer/searchFilter/condition/KakaoMapLandCategoryCondition'
import KakaoMapUsageStatusCondition from '@components/references/map/kakaoMapSearchLayer/searchFilter/condition/KakaoMapUsageStatusCondition'
import KakaoMapZoneTypeCondition from '@components/references/map/kakaoMapSearchLayer/searchFilter/condition/KakaoMapZoneTypeCondition'
import React from 'react'

interface KakaoMapExpandedFilterProps {
  expandedFilter: string | null
  landCategory: string[]
  usageStatus: string[]
  zoneType: string[]
  onCheckboxChange: (filterType: keyof SearchFilters) => (values: string[]) => void
}

const KakaoMapExpandedFilter: React.FC<KakaoMapExpandedFilterProps> = ({
  expandedFilter,
  landCategory,
  usageStatus,
  zoneType,
  onCheckboxChange,
}) => {
  if (!expandedFilter) return null

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      {expandedFilter === 'landCategory' && (
        <KakaoMapLandCategoryCondition
          selectedValues={landCategory}
          onChange={onCheckboxChange('landCategory')}
        />
      )}

      {expandedFilter === 'usageStatus' && (
        <KakaoMapUsageStatusCondition
          selectedValues={usageStatus}
          onChange={onCheckboxChange('usageStatus')}
        />
      )}

      {expandedFilter === 'zoneType' && (
        <KakaoMapZoneTypeCondition
          selectedValues={zoneType}
          onChange={onCheckboxChange('zoneType')}
        />
      )}
    </div>
  )
}

export default React.memo(KakaoMapExpandedFilter)
