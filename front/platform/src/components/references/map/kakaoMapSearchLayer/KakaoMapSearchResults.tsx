import BasicSpinner from '@components/common/loading/BasicSpinner'
import KakaoMapSearchResultItem from '@components/references/map/kakaoMapSearchLayer/KakaoMapSearchResultItem'
import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { ChevronDown, MapPin } from 'lucide-react'
import React from 'react'

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/design'

interface SearchResultsProps {
  isLoading: boolean
  isLoadingMore?: boolean
  error: Error | null
  cases: KakaoMapSearchCase[]
  totalCount: number
  hasSearched: boolean
  onLoadMore?: () => void
}

const KakaoMapSearchResults: React.FC<SearchResultsProps> = React.memo(
  ({ isLoading, isLoadingMore, error, cases, totalCount, hasSearched, onLoadMore }) => {
    if (!hasSearched) {
      return (
        <div className="text-center" style={{ padding: `${SPACING['2xl']} 0` }}>
          <MapPin
            className="w-12 h-12 mx-auto"
            style={{ color: COLORS.neutral[300], marginBottom: SPACING.md }}
          />
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.body,
              fontSize: TYPOGRAPHY.fontSize.sm,
              color: COLORS.neutral[500],
            }}
          >
            검색 조건을 설정하고 검색 버튼을 클릭하세요
          </p>
        </div>
      )
    }

    if (isLoading && !isLoadingMore) {
      return (
        <div style={{ padding: `${SPACING['2xl']} 0` }}>
          <BasicSpinner size="md" text="검색 중..." />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center" style={{ padding: `${SPACING['2xl']} 0` }}>
          <p className="text-sm" style={{ color: COLORS.semantic.error, marginBottom: SPACING.sm }}>
            검색 중 오류가 발생했습니다
          </p>
          <p className="text-xs" style={{ color: COLORS.neutral[500] }}>
            {error.message}
          </p>
        </div>
      )
    }

    if (cases.length === 0) {
      return (
        <div className="text-center" style={{ padding: `${SPACING['2xl']} 0` }}>
          <MapPin
            className="w-12 h-12 mx-auto"
            style={{ color: COLORS.neutral[300], marginBottom: SPACING.md }}
          />
          <p className="text-sm" style={{ color: COLORS.neutral[500], marginBottom: SPACING.xs }}>
            검색 결과가 없습니다
          </p>
          <p className="text-xs" style={{ color: COLORS.neutral[400] }}>
            다른 검색 조건을 시도해보세요
          </p>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {/* 검색 결과 헤더 */}
        <div className="flex items-center justify-between">
          <h4
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.heading,
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              color: COLORS.neutral[700],
            }}
          >
            검색 결과
          </h4>
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.mono,
              fontSize: TYPOGRAPHY.fontSize.xs,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.neutral[500],
            }}
          >
            총 {totalCount}건
          </span>
        </div>

        {/* 검색 결과 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
          {cases.map(caseItem => (
            <KakaoMapSearchResultItem caseItem={caseItem} key={caseItem.caseNumber} />
          ))}
        </div>

        {/* 더보기 버튼 */}
        {cases.length < totalCount && onLoadMore && (
          <div className="text-center" style={{ paddingTop: SPACING.sm }}>
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: COLORS.primary.lighter,
                color: COLORS.primary.main,
                border: `1px solid ${COLORS.primary.light}33`,
              }}
              onMouseEnter={e => {
                if (!isLoadingMore) {
                  e.currentTarget.style.backgroundColor = COLORS.primary.light + '22'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = COLORS.primary.lighter
              }}
            >
              {isLoadingMore ? (
                <>
                  <BasicSpinner size="sm" />
                  <span className="text-xs">로딩 중...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    더 보기 ({totalCount - cases.length}건 더 있음)
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
  },
)

export default KakaoMapSearchResults
