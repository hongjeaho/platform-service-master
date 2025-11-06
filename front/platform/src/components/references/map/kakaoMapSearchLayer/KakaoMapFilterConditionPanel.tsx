import KakaoMapLandCategoryCondition from '@components/references/map/kakaoMapSearchLayer/searchFilter/condition/KakaoMapLandCategoryCondition'
import KakaoMapUsageStatusCondition from '@components/references/map/kakaoMapSearchLayer/searchFilter/condition/KakaoMapUsageStatusCondition'
import KakaoMapZoneTypeCondition from '@components/references/map/kakaoMapSearchLayer/searchFilter/condition/KakaoMapZoneTypeCondition'
import { X } from 'lucide-react'
import React from 'react'

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/design'

interface KakaoMapFilterConditionPanelProps {
  expandedFilter: string | null
  landCategory: string[]
  usageStatus: string[]
  zoneType: string[]
  onCheckboxChange: (
    filterType: 'landCategory' | 'usageStatus' | 'zoneType',
  ) => (values: string[]) => void
  onClose: () => void
}

const KakaoMapFilterConditionPanel: React.FC<KakaoMapFilterConditionPanelProps> = ({
  expandedFilter,
  landCategory,
  usageStatus,
  zoneType,
  onCheckboxChange,
  onClose,
}) => {
  // 확장된 필터가 없으면 렌더링하지 않음
  if (!expandedFilter) return null

  // 필터 타입별 제목 매핑
  const getFilterTitle = (filterType: string): string => {
    const titleMap: Record<string, string> = {
      landCategory: '지목',
      usageStatus: '이용사항',
      zoneType: '용도지역',
    }
    return titleMap[filterType] || ''
  }

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
      {/* 헤더 + 닫기 버튼 */}
      <div className="flex items-center justify-between" style={{ marginBottom: SPACING.sm }}>
        <h4
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.heading,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: COLORS.primary.dark,
          }}
        >
          {getFilterTitle(expandedFilter)}
        </h4>
        <button
          onClick={onClose}
          className="transition-opacity duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: SPACING.xs,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="닫기"
        >
          <X size={16} style={{ color: COLORS.primary.dark }} />
        </button>
      </div>

      {/* 체크박스 조건 영역 */}
      <div
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
        }}
      >
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
    </div>
  )
}

export default React.memo(KakaoMapFilterConditionPanel)
