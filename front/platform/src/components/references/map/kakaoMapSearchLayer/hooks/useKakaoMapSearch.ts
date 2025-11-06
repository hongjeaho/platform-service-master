import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'

import {
  getGetReferencesMapListQueryKey,
  getReferencesMapList,
} from '@/api/references-map-api/references-map-api'

import {
  convertApiResponseToSearchResponse,
  convertFiltersToApiParams,
} from '../utils/kakaoMapSearchConverter'
import type { SearchFilters } from './useSearchFilters'

/**
 * 카카오맵 검색을 위한 커스텀 훅
 * useInfiniteQuery를 사용한 페이지네이션 기능 지원
 *
 * 설계:
 * - React Query useInfiniteQuery: 자동 페이지네이션 및 캐싱
 * - enabled 조건으로 검색 트리거 제어
 * - 검색 → 초기화 → 재검색 시나리오 안정적 동작
 */
export const useKakaoMapSearch = (filters: SearchFilters) => {
  const queryClient = useQueryClient()

  // 검색 트리거 상태
  const [hasSearched, setHasSearched] = useState(true)

  // API 파라미터 변환 (필터 기반)
  // filters 객체를 직접 의존성으로 사용하여 불필요한 재계산 방지
  const baseApiParams = useMemo(() => convertFiltersToApiParams(filters), [filters])

  // useInfiniteQuery 구현
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: getGetReferencesMapListQueryKey(baseApiParams),
      queryFn: ({ pageParam = 0 }) =>
        getReferencesMapList({
          ...baseApiParams,
          page: pageParam,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const currentCount = allPages.flatMap(page => page.list || []).length
        return currentCount < (lastPage.totalCount || 0) ? allPages.length : undefined
      },
      initialPageParam: 0,
      enabled: hasSearched,
    })

  // 데이터 병합 및 총 개수 계산 (한 번에 처리)
  const { displayedCases, totalCount } = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) {
      return { displayedCases: [], totalCount: 0 }
    }

    return {
      displayedCases: data.pages.flatMap(page => convertApiResponseToSearchResponse(page).cases),
      totalCount: data.pages[data.pages.length - 1]?.totalCount || 0,
    }
  }, [data])

  // 검색 실행 함수
  const executeSearch = useCallback(() => {
    setHasSearched(true) // enabled: true → 자동 호출
  }, [])

  // 더보기 실행 함수
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // 검색 상태 초기화 함수
  const resetSearch = useCallback(() => {
    setHasSearched(false)
    queryClient.removeQueries({
      queryKey: getGetReferencesMapListQueryKey(baseApiParams),
    })
  }, [queryClient, baseApiParams])

  return {
    cases: displayedCases,
    totalCount,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    error,
    hasSearched,
    executeSearch,
    loadMore,
    resetSearch,
  }
}
