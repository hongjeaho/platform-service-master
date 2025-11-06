import type { SearchFilters } from '@components/references/map/kakaoMapSearchLayer/hooks/useSearchFilters'
import KakaoMapFilterItems from '@components/references/map/kakaoMapSearchLayer/searchFilter/summary/KakaoMapFilterItems'
import React, { useMemo } from 'react'

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/design'

interface KakaoMapActiveFiltersPanelProps {
  landCategory: string[]
  usageStatus: string[]
  zoneType: string[]
  onRemoveItem: (filterType: keyof SearchFilters, item: string) => void
  onClearFilter: (filterType: keyof SearchFilters) => void
  onClearAll: () => void
  hasAnySelection: boolean
}

const KakaoMapActiveFiltersPanel: React.FC<KakaoMapActiveFiltersPanelProps> = ({
  landCategory,
  usageStatus,
  zoneType,
  onRemoveItem,
  onClearFilter,
  onClearAll,
  hasAnySelection,
}) => {
  // 전체 필터 개수 계산 (Hook은 조건부 return 이전에 호출)
  const totalCount = useMemo(
    () => landCategory.length + usageStatus.length + zoneType.length,
    [landCategory.length, usageStatus.length, zoneType.length],
  )

  // 선택된 필터가 없으면 렌더링하지 않음
  if (!hasAnySelection) return null

  return (
    <div
      className="hidden lg:block rounded-lg shadow-lg transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: COLORS.primary.lighter,
        border: `1px solid ${COLORS.primary.light}33`,
        padding: SPACING.md,
        minWidth: '280px',
        maxWidth: '320px',
        maxHeight: '400px',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between" style={{ marginBottom: SPACING.sm }}>
        <h4
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.heading,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: COLORS.primary.dark,
          }}
        >
          적용 중인 조건
        </h4>
        <button
          onClick={onClearAll}
          className="transition-opacity duration-200 hover:opacity-90"
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.body,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            color: COLORS.background.primary,
            backgroundColor: COLORS.semantic.error,
            border: 'none',
            borderRadius: '4px',
            padding: `${SPACING.xs} ${SPACING.sm}`,
            cursor: 'pointer',
          }}
        >
          전체 초기화
        </button>
      </div>

      {/* 필터 항목들 */}
      <div
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.sm,
        }}
      >
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

        {/* 총 개수 표시 */}
        {totalCount > 0 && (
          <div
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.body,
              fontSize: TYPOGRAPHY.fontSize.xs,
              color: COLORS.primary.main,
              marginTop: SPACING.xs,
              paddingTop: SPACING.sm,
              borderTop: `1px solid ${COLORS.primary.light}33`,
            }}
          >
            총 {totalCount}개 조건이 선택되었습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(KakaoMapActiveFiltersPanel)
