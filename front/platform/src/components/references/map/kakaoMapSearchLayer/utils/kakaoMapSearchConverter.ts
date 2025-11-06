import type { KakaoMapSearchResponse } from '@components/references/map/type/kakaoMapSearch'

import type {
  GetReferencesMapListParams,
  ReferencesMapResponse,
  ReferencesMapSearchCase,
} from '@/model'

import type { SearchFilters } from '../hooks/useSearchFilters'

/**
 * API 응답 타입 확장 (실제 API는 List 필드를 추가로 제공)
 */
interface ExtendedReferencesMapSearchCase extends ReferencesMapSearchCase {
  landCategoryList?: string[]
  usageStatusList?: string[]
  zoneTypeList?: string[]
}

/**
 * SearchFilters를 API 파라미터로 변환하는 함수
 *
 * @param filters - 검색 필터 객체
 * @returns API 요청에 사용할 파라미터 객체
 */
export const convertFiltersToApiParams = (filters: SearchFilters): GetReferencesMapListParams => {
  return {
    keyword: filters.keyword || undefined,
    landCategory: filters.landCategory.length > 0 ? filters.landCategory : undefined,
    usageStatus: filters.usageStatus.length > 0 ? filters.usageStatus : undefined,
    zoneType: filters.zoneType.length > 0 ? filters.zoneType : undefined,
    page: 0,
    pageSize: 20,
  }
}

/**
 * API 응답을 KakaoMapSearchResponse 형태로 변환하는 함수
 *
 * API 응답 데이터 구조:
 * - landCategoryList, usageStatusList, zoneTypeList: 배열 형태 (우선 사용)
 * - landCategory, usageStatus, zoneType: 쉼표로 구분된 문자열 (fallback)
 *
 * @param apiResponse - API 응답 객체
 * @returns 변환된 검색 응답 객체
 */
export const convertApiResponseToSearchResponse = (
  apiResponse: ReferencesMapResponse,
): KakaoMapSearchResponse => {
  return {
    cases:
      apiResponse.list?.map(caseItem => {
        const extendedCase = caseItem as ExtendedReferencesMapSearchCase

        return {
          id: caseItem.caseNo || '',
          caseNumber: caseItem.caseNo || '',
          caseName: caseItem.caseTitle || '',
          caseType: '',
          address: caseItem.address || '',
          area: caseItem.area || 0,
          price: caseItem.price || 0,
          coordinates:
            caseItem.lat && caseItem.lng
              ? {
                  lat: parseFloat(caseItem.lat),
                  lng: parseFloat(caseItem.lng),
                }
              : undefined,
          // 배열 필드가 있으면 우선 사용, 없으면 쉼표 구분 문자열 파싱
          landCategory:
            extendedCase.landCategoryList ||
            caseItem.landCategory?.split(',').map(s => s.trim()) ||
            [],
          usageStatus:
            extendedCase.usageStatusList ||
            caseItem.usageStatus?.split(',').map(s => s.trim()) ||
            [],
          zoneType:
            extendedCase.zoneTypeList || caseItem.zoneType?.split(',').map(s => s.trim()) || [],
          createdAt: new Date().toISOString(),
          standardLand:
            caseItem.standardLat && caseItem.standardLng
              ? {
                  coordinates: {
                    lat: parseFloat(caseItem.standardLat),
                    lng: parseFloat(caseItem.standardLng),
                  },
                  address: caseItem.standardAddress || '',
                  price: parseFloat(caseItem.standardPrice || '0'),
                  area: parseFloat(caseItem.standardArea || '0'),
                }
              : undefined,
        }
      }) || [],
    totalCount: apiResponse.totalCount || 0,
    page: 1,
    size: 20,
    hasNext: false,
  }
}
