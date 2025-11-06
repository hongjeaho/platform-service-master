import KakaoMapCompareButton from '@components/references/map/compare/KakaoMapCompareButton'
import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import React from 'react'

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/design'

interface KakaoMapSelectedCasesPanelProps {
  selectedCases: KakaoMapSearchCase[]
  selectedCount: number
  onCompareClick: () => void
}

const KakaoMapSelectedCasesPanel: React.FC<KakaoMapSelectedCasesPanelProps> = React.memo(
  ({ selectedCases, selectedCount, onCompareClick }) => {
    // 선택된 사건이 없으면 렌더링하지 않음
    if (selectedCount === 0) {
      return null
    }

    return (
      <div
        className="rounded-lg shadow-lg transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: COLORS.primary.lighter,
          border: `1px solid ${COLORS.primary.light}33`,
          padding: SPACING.md,
          minWidth: '280px',
          maxWidth: '320px',
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
            선택된 사건
          </h4>
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.mono,
              fontSize: TYPOGRAPHY.fontSize.xs,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.primary.main,
            }}
          >
            {selectedCount}/3
          </span>
        </div>

        {/* 선택된 사건 목록 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.xs,
            marginBottom: SPACING.md,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {selectedCases.map(caseItem => (
            <div
              key={caseItem.id}
              className="truncate transition-colors duration-200 hover:opacity-80"
              style={{
                fontFamily: TYPOGRAPHY.fontFamily.body,
                fontSize: TYPOGRAPHY.fontSize.xs,
                fontWeight: TYPOGRAPHY.fontWeight.normal,
                color: COLORS.primary.main,
                lineHeight: TYPOGRAPHY.lineHeight.normal,
              }}
              title={`${caseItem.caseNumber} - ${caseItem.caseName}`}
            >
              {caseItem.caseNumber} - {caseItem.caseName}
            </div>
          ))}
        </div>

        {/* 비교하기 버튼 */}
        <KakaoMapCompareButton selectedCount={selectedCount} onCompareClick={onCompareClick} />
      </div>
    )
  },
)

export default KakaoMapSelectedCasesPanel
