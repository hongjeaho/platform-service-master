import type {
  KakaoMapSearchCase,
  KakaoMapSearchRequest,
  KakaoMapSearchResponse,
} from '@components/references/map/type/kakaoMapSearch'

const mockCases: KakaoMapSearchCase[] = [
  {
    id: '1',
    caseNumber: '2024-보상-001',
    caseName: '부산진구 전포동 도로개설사업',
    caseType: '도로개설',
    address: '부산광역시 부산진구 전포동 123-45',
    area: 850.5,
    price: 450000000,
    coordinates: { lat: 35.1547, lng: 129.0647 },
    landCategory: ['site', 'road'],
    usageStatus: ['commercial'],
    zoneType: ['commercialZone'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    caseNumber: '2024-보상-002',
    caseName: '해운대구 우동 아파트 건설',
    caseType: '주택건설',
    address: '부산광역시 해운대구 우동 567-89',
    area: 1200.3,
    price: 800000000,
    coordinates: { lat: 35.1694, lng: 129.1467 },
    landCategory: ['site', 'parking'],
    usageStatus: ['residential'],
    zoneType: ['residentialZone'],
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    caseNumber: '2024-보상-003',
    caseName: '사상구 괘법동 공장용지 조성',
    caseType: '공장용지',
    address: '부산광역시 사상구 괘법동 234-56',
    area: 2500.8,
    price: 1200000000,
    coordinates: { lat: 35.1485, lng: 128.9915 },
    landCategory: ['factory', 'warehouse'],
    usageStatus: ['industrial'],
    zoneType: ['industrialZone'],
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    caseNumber: '2024-보상-004',
    caseName: '동래구 온천동 상업시설 건립',
    caseType: '상업시설',
    address: '부산광역시 동래구 온천동 345-67',
    area: 680.2,
    price: 380000000,
    coordinates: { lat: 35.2098, lng: 129.0844 },
    landCategory: ['site'],
    usageStatus: ['commercial'],
    zoneType: ['commercialZone'],
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    caseNumber: '2024-보상-005',
    caseName: '강서구 대저동 농지 전용',
    caseType: '농지전용',
    address: '부산광역시 강서구 대저동 456-78',
    area: 3200.5,
    price: 640000000,
    coordinates: { lat: 35.2158, lng: 128.9794 },
    landCategory: ['field', 'paddyField'],
    usageStatus: ['agricultural'],
    zoneType: ['managementZone'],
    createdAt: '2024-02-15',
  },
  {
    id: '6',
    caseNumber: '2024-보상-006',
    caseName: '남구 용호동 공원 조성',
    caseType: '공원조성',
    address: '부산광역시 남구 용호동 567-89',
    area: 1800.7,
    price: 720000000,
    coordinates: { lat: 35.1267, lng: 129.1053 },
    landCategory: ['forest'],
    usageStatus: ['other'],
    zoneType: ['greenZone'],
    createdAt: '2024-02-20',
  },
  {
    id: '7',
    caseNumber: '2024-보상-007',
    caseName: '서구 암남동 주차장 건설',
    caseType: '주차장',
    address: '부산광역시 서구 암남동 678-90',
    area: 450.3,
    price: 180000000,
    coordinates: { lat: 35.0956, lng: 129.0172 },
    landCategory: ['parking', 'site'],
    usageStatus: ['other'],
    zoneType: ['residentialZone'],
    createdAt: '2024-03-01',
  },
  {
    id: '8',
    caseNumber: '2024-보상-008',
    caseName: '연제구 거제동 학교용지 확보',
    caseType: '학교건설',
    address: '부산광역시 연제구 거제동 789-01',
    area: 2200.4,
    price: 1100000000,
    coordinates: { lat: 35.1851, lng: 129.0692 },
    landCategory: ['school', 'site'],
    usageStatus: ['other'],
    zoneType: ['residentialZone'],
    createdAt: '2024-03-05',
  },
]

// 검색 조건에 따른 필터링 함수
const filterCases = (
  cases: KakaoMapSearchCase[],
  request: KakaoMapSearchRequest,
): KakaoMapSearchCase[] => {
  console.log('=== 필터링 시작 ===')
  console.log('전체 케이스 수:', cases.length)
  console.log('필터링 조건:', request)

  const filtered = cases.filter(caseItem => {
    // 키워드 검색 (사건명, 사건번호, 주소에서 검색)
    if (request.keyword && request.keyword.trim()) {
      const keyword = request.keyword.toLowerCase()
      const matchesKeyword =
        caseItem.caseName.toLowerCase().includes(keyword) ||
        caseItem.caseNumber.toLowerCase().includes(keyword) ||
        caseItem.address.toLowerCase().includes(keyword)

      if (!matchesKeyword) {
        console.log(`키워드 불일치: ${caseItem.caseName} (키워드: ${keyword})`)
        return false
      }
    }

    // 지목 필터
    if (request.landCategory.length > 0) {
      const hasMatchingLandCategory = request.landCategory.some(category =>
        caseItem.landCategory.includes(category),
      )
      console.log(`지목 체크: ${caseItem.caseName}`)
      console.log(`- 요청된 지목:`, request.landCategory)
      console.log(`- 사건의 지목:`, caseItem.landCategory)
      console.log(`- 일치 여부:`, hasMatchingLandCategory)

      if (!hasMatchingLandCategory) return false
    }

    // 이용상황 필터
    if (request.usageStatus.length > 0) {
      const hasMatchingUsageStatus = request.usageStatus.some(status =>
        caseItem.usageStatus.includes(status),
      )
      if (!hasMatchingUsageStatus) return false
    }

    // 용도지역 필터
    if (request.zoneType.length > 0) {
      const hasMatchingZoneType = request.zoneType.some(zone => caseItem.zoneType.includes(zone))
      if (!hasMatchingZoneType) return false
    }

    return true
  })

  console.log('필터링 결과:', filtered.length, '개')
  return filtered
}

// Mock API 함수
export const mockSearchCases = async (
  request: KakaoMapSearchRequest,
): Promise<KakaoMapSearchResponse> => {
  // API 호출 시뮬레이션을 위한 딜레이
  await new Promise(resolve => setTimeout(resolve, 800))

  const filteredCases = filterCases(mockCases, request)
  const page = request.page || 1
  const size = request.size || 20
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  const paginatedCases = filteredCases.slice(startIndex, endIndex)

  return {
    cases: paginatedCases,
    totalCount: filteredCases.length,
    page,
    size,
    hasNext: endIndex < filteredCases.length,
  }
}
