import { useKakaoMapResultSelectedCases } from '@components/references/map/kakaoMapSearchLayer/hooks/useKakaoMapResultSelectedCases'
import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { formatPrice } from '@util/numberUtils'
import React from 'react'

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/design'

interface KakaoMapSearchResultItemProps {
  caseItem: KakaoMapSearchCase
}

const KakaoMapSearchResultItem: React.FC<KakaoMapSearchResultItemProps> = ({ caseItem }) => {
  const { isSelected, handleCaseSelection } = useKakaoMapResultSelectedCases()

  const handleCheckboxChange = (caseItem: KakaoMapSearchCase, checked: boolean) => {
    handleCaseSelection(caseItem, checked)
  }

  return (
    <div
      key={caseItem.id}
      className="bg-white border border-neutral-200 rounded-lg hover:border-primary-light hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{ padding: SPACING.sm }}
    >
      <div className="flex items-center" style={{ gap: SPACING.sm }}>
        {/* 체크박스 */}
        <input
          type="checkbox"
          id={`case-${caseItem.id}`}
          checked={isSelected(caseItem.id)}
          onChange={e => handleCheckboxChange(caseItem, e.target.checked)}
          className="w-4 h-4 text-primary-main bg-neutral-100 border-neutral-300 rounded cursor-pointer transition-all duration-200 hover:border-primary-light accent-primary-main focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-main flex-shrink-0"
        />

        {/* 사건 정보 */}
        <label htmlFor={`case-${caseItem.id}`} className="flex-1 min-w-0 cursor-pointer">
          <div className="flex flex-col" style={{ gap: SPACING.xs }}>
            {/* 사건번호 뱃지 */}
            <div className="flex items-center">
              <span
                className="inline-flex items-center"
                style={{
                  backgroundColor: COLORS.primary.main,
                  color: COLORS.neutral[50],
                  borderRadius: '20px',
                  padding: `${SPACING.xs} ${SPACING.sm}`,
                  fontFamily: TYPOGRAPHY.fontFamily.mono,
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                }}
              >
                {caseItem.caseNumber}
              </span>
            </div>

            {/* 사건명 */}
            <h5
              className="truncate"
              title={caseItem.caseName}
              style={{
                fontFamily: TYPOGRAPHY.fontFamily.heading,
                fontSize: TYPOGRAPHY.fontSize.sm,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                color: COLORS.neutral[900],
              }}
            >
              {caseItem.caseName}
            </h5>

            {/* 주소 */}
            <p
              className="line-clamp-1"
              title={caseItem.address}
              style={{
                fontFamily: TYPOGRAPHY.fontFamily.body,
                fontSize: TYPOGRAPHY.fontSize.xs,
                color: COLORS.neutral[600],
                lineHeight: TYPOGRAPHY.lineHeight.normal,
              }}
            >
              {caseItem.address}
            </p>

            {/* 면적 / 가격 */}
            <div className="flex items-center" style={{ gap: SPACING.sm }}>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily.mono,
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  color: COLORS.neutral[500],
                }}
              >
                {`${caseItem.area.toLocaleString()}㎡`}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily.mono,
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                  color: COLORS.semantic.success,
                }}
              >
                {formatPrice(caseItem.price)}
              </span>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}
export default KakaoMapSearchResultItem
