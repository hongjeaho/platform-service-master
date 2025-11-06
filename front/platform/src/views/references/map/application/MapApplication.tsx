import KakaoMapCompareDialog from '@components/references/map/compare/KakaoMapCaseCompareDialog'
import KakaoMap from '@components/references/map/KakaoMap'
import { useKakaoMapResultSelectedCases } from '@components/references/map/kakaoMapSearchLayer/hooks/useKakaoMapResultSelectedCases'
import { useSearchFilters } from '@components/references/map/kakaoMapSearchLayer/hooks/useSearchFilters'
import KakaoMapActiveFiltersPanel from '@components/references/map/kakaoMapSearchLayer/KakaoMapActiveFiltersPanel'
import KakaoMapFilterConditionPanel from '@components/references/map/kakaoMapSearchLayer/KakaoMapFilterConditionPanel'
import KakaoMapSearchLayer from '@components/references/map/kakaoMapSearchLayer/KakaoMapSearchLayer'
import KakaoMapSelectedCasesPanel from '@components/references/map/selectedCases/KakaoMapSelectedCasesPanel'
import React, { useMemo, useState } from 'react'

interface MapApplicationProps {}

const MapApplication: React.FC<MapApplicationProps> = () => {
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)

  const { selectedCases, selectedCount } = useKakaoMapResultSelectedCases()
  const { filters, updateFilter, removeFilterItem, clearFilter, clearAllFilters } =
    useSearchFilters()

  // 개별 필터 값들 추출
  const { landCategory, usageStatus, zoneType } = filters

  // 필터 선택 상태 계산
  const hasSelection = useMemo(
    () => landCategory.length > 0 || usageStatus.length > 0 || zoneType.length > 0,
    [landCategory.length, usageStatus.length, zoneType.length],
  )

  // 필터 카운트 계산
  const filterCounts = useMemo(
    () => ({
      landCategory: landCategory.length,
      usageStatus: usageStatus.length,
      zoneType: zoneType.length,
    }),
    [landCategory.length, usageStatus.length, zoneType.length],
  )

  // 체크박스 변경 핸들러
  const handleCheckboxChange =
    (filterType: 'landCategory' | 'usageStatus' | 'zoneType') => (values: string[]) => {
      updateFilter(filterType, values)
    }

  return (
    <div className="w-full flex" style={{ height: 'calc(100vh - 4rem)' }}>
      <KakaoMapSearchLayer
        expandedFilter={expandedFilter}
        onToggleFilter={setExpandedFilter}
        filterCounts={filterCounts}
        filters={filters}
        updateFilter={updateFilter}
        clearAllFilters={clearAllFilters}
      />
      <div className="flex-1 relative">
        <KakaoMap height="100%" />

        {/* 필터 조건 패널 - 지도 왼쪽 상단 */}
        {expandedFilter && (
          <div className="absolute top-4 left-4 z-10">
            <KakaoMapFilterConditionPanel
              expandedFilter={expandedFilter}
              landCategory={landCategory}
              usageStatus={usageStatus}
              zoneType={zoneType}
              onCheckboxChange={handleCheckboxChange}
              onClose={() => setExpandedFilter(null)}
            />
          </div>
        )}

        {/* 선택된 사건 패널 - 지도 오른쪽 상단 */}
        <div
          className="absolute top-4 right-4 z-10
                     sm:top-6 sm:right-6
                     lg:top-4 lg:right-4"
        >
          <KakaoMapSelectedCasesPanel
            selectedCases={selectedCases}
            selectedCount={selectedCount}
            onCompareClick={() => setIsCompareOpen(true)}
          />
        </div>

        {/* 적용 중인 조건 패널 - 선택된 사건 패널 아래 */}
        {hasSelection && (
          <div
            className="absolute right-4 z-10
                       sm:right-6
                       lg:right-4"
            style={{ top: selectedCount > 0 ? '220px' : '1rem' }}
          >
            <KakaoMapActiveFiltersPanel
              landCategory={landCategory}
              usageStatus={usageStatus}
              zoneType={zoneType}
              onRemoveItem={removeFilterItem}
              onClearFilter={clearFilter}
              onClearAll={clearAllFilters}
              hasAnySelection={hasSelection}
            />
          </div>
        )}
      </div>

      {/* 사건 비교 다이얼로그 */}
      <KakaoMapCompareDialog
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedCases={selectedCases}
      />
    </div>
  )
}

export default MapApplication
