import ResetButton from '@components/common/button/ResetButton'
import { useKakaoMapResultSelectedCases } from '@components/references/map/kakaoMapSearchLayer/hooks/useKakaoMapResultSelectedCases'
import { useKakaoMapSearch } from '@components/references/map/kakaoMapSearchLayer/hooks/useKakaoMapSearch'
import type { SearchFilters } from '@components/references/map/kakaoMapSearchLayer/hooks/useSearchFilters'
import KakaoMapFilterButton from '@components/references/map/kakaoMapSearchLayer/KakaoMapFilterButton'
import KakaoMapKeywordInput from '@components/references/map/kakaoMapSearchLayer/KakaoMapKeywordInput'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'

import KakaoMapSearchResults from './KakaoMapSearchResults'

interface SearchLayerV2Props {
  expandedFilter: string | null
  onToggleFilter: (filterType: string) => void
  filterCounts: { landCategory: number; usageStatus: number; zoneType: number }
  filters: SearchFilters
  updateFilter: <K extends keyof SearchFilters>(filterType: K, value: SearchFilters[K]) => void
  clearAllFilters: () => void
}

// 빈 배열 상수 - 매번 새로운 배열 생성 방지
const EMPTY_CASES: never[] = []

const KakaoMapSearchLayer: React.FC<SearchLayerV2Props> = React.memo(
  ({ expandedFilter, onToggleFilter, filterCounts, filters, updateFilter, clearAllFilters }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { clearSelectedCases } = useKakaoMapResultSelectedCases()

    // 개별 필터 값들 추출
    const { keyword } = filters

    // 카카오맵 검색 훅 사용 - 완전 자동 검색 (1.5초 디바운스)
    const {
      cases,
      totalCount,
      isLoading,
      isLoadingMore,
      error,
      hasSearched,
      loadMore,
      resetSearch,
      executeSearch,
    } = useKakaoMapSearch(filters)

    const handleReset = useCallback(() => {
      clearAllFilters()
      clearSelectedCases()
      onToggleFilter('')
      resetSearch()
      executeSearch()
    }, [clearAllFilters, clearSelectedCases, onToggleFilter, resetSearch])

    const toggleLayer = useCallback(() => {
      setIsOpen(prev => {
        const newIsOpen = !prev
        if (!newIsOpen) {
          onToggleFilter('')
        }
        return newIsOpen
      })
    }, [onToggleFilter])

    const toggleFilter = useCallback(
      (filterType: string) => {
        onToggleFilter(expandedFilter === filterType ? '' : filterType)
      },
      [expandedFilter, onToggleFilter],
    )

    const handleKeywordChange = useCallback(
      (value: string) => {
        updateFilter('keyword', value)
      },
      [updateFilter],
    )

    // 검색 결과 props 메모이제이션
    const searchResultsProps = useMemo(
      () => ({
        isLoading,
        isLoadingMore,
        error,
        cases: cases.length > 0 ? cases : EMPTY_CASES,
        totalCount,
        hasSearched,
        onLoadMore: loadMore,
      }),
      [isLoading, isLoadingMore, error, cases, totalCount, hasSearched, loadMore],
    )

    const handleFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        executeSearch()
        console.log('executeSearch()')
      },
      [executeSearch],
    )

    return (
      <div
        className={`w-80 min-w-[300px] h-full ${isOpen ? 'flex' : 'hidden'} lg:flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out`}
      >
        {/* 작은 화면에서 검색창이 닫혀있을 때 표시되는 토글 버튼 */}
        <div className="lg:hidden">
          {!isOpen && (
            <button
              onClick={toggleLayer}
              className="fixed top-20 left-4 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center border border-gray-200"
              style={{ width: '48px', height: '48px' }}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* 검색 레이어 메인 컨테이너 */}
        <div className="h-full flex flex-col">
          {/* 작은 화면에서 검색창이 열려있을 때 표시되는 토글 버튼 */}
          <div className="lg:hidden">
            {isOpen && (
              <button
                onClick={toggleLayer}
                className="absolute -right-12 top-20 z-50 bg-white shadow-lg rounded-r-lg p-3 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center border border-l-0 border-gray-200"
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  width: '48px',
                  height: '48px',
                }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* 헤더 */}
          <div className="bg-blue-600 text-white p-4 flex-shrink-0">
            <h2 className="text-lg font-semibold">검색 필터</h2>
          </div>

          {/* 검색 폼 */}
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
              {/* 필터 토글 버튼들 */}
              <KakaoMapFilterButton
                expandedFilter={expandedFilter}
                filterCounts={filterCounts}
                onToggleFilter={toggleFilter}
              />

              {/* 키워드 검색 */}
              <KakaoMapKeywordInput value={keyword} onChange={handleKeywordChange} />

              {/* 버튼 영역 */}
              <div className="flex gap-2">
                <ResetButton onClick={handleReset} className="flex-1 justify-center">
                  초기화
                </ResetButton>
              </div>

              {/* 검색 결과 영역 */}
              <div className="border-t pt-4 mt-4 flex flex-col">
                <KakaoMapSearchResults {...searchResultsProps} />
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  },
)

export default KakaoMapSearchLayer
