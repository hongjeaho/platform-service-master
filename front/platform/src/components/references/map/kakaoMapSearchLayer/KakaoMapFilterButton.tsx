import KakaoMapLandCategoryButton from '@components/references/map/kakaoMapSearchLayer/searchFilter/button/KakaoMapLandCategoryButton'
import KakaoMapUsageStatusButton from '@components/references/map/kakaoMapSearchLayer/searchFilter/button/KakaoMapUsageStatusButton'
import KakaoMapZoneTypeButton from '@components/references/map/kakaoMapSearchLayer/searchFilter/button/KakaoMapZoneTypeButton'
import React from 'react'

interface KakaoMapFilterButtonProps {
  expandedFilter: string | null
  filterCounts: { landCategory: number; usageStatus: number; zoneType: number }
  onToggleFilter: (filterType: string) => void
}

const KakaoMapFilterButton: React.FC<KakaoMapFilterButtonProps> = ({
  expandedFilter,
  filterCounts,
  onToggleFilter,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">필터 조건</label>
      <div className="flex gap-2">
        <KakaoMapLandCategoryButton
          active={expandedFilter === 'landCategory'}
          count={filterCounts.landCategory}
          onClick={() => onToggleFilter('landCategory')}
        />
        <KakaoMapUsageStatusButton
          active={expandedFilter === 'usageStatus'}
          count={filterCounts.usageStatus}
          onClick={() => onToggleFilter('usageStatus')}
        />
        <KakaoMapZoneTypeButton
          active={expandedFilter === 'zoneType'}
          count={filterCounts.zoneType}
          onClick={() => onToggleFilter('zoneType')}
        />
      </div>
    </div>
  )
}

export default React.memo(KakaoMapFilterButton)
