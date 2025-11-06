/**
 * 필터 옵션 정의
 * API 응답에서 한글명으로 오기 때문에 value도 한글로 설정
 * 예: API 응답 - "landCategoryList": ["대"], "usageStatusList": ["상업용"], "zoneTypeList": ["일반상업지역"]
 */
export const FILTER_OPTIONS = {
  landCategory: [
    { value: '전', label: '전' },
    { value: '답', label: '답' },
    { value: '과수원', label: '과수원' },
    { value: '목장용지', label: '목장용지' },
    { value: '임야', label: '임야' },
    { value: '대', label: '대' },
    { value: '공장용지', label: '공장용지' },
    { value: '학교용지', label: '학교용지' },
    { value: '주차장', label: '주차장' },
    { value: '주유소용지', label: '주유소용지' },
    { value: '창고용지', label: '창고용지' },
    { value: '도로', label: '도로' },
  ],
  usageStatus: [
    { value: '주거용', label: '주거용' },
    { value: '상업용', label: '상업용' },
    { value: '상업기타', label: '상업기타' },
    { value: '공업용', label: '공업용' },
    { value: '농업용', label: '농업용' },
    { value: '임업용', label: '임업용' },
    { value: '기타', label: '기타' },
  ],
  zoneType: [
    { value: '제1종전용주거지역', label: '제1종전용주거지역' },
    { value: '제2종전용주거지역', label: '제2종전용주거지역' },
    { value: '제1종일반주거지역', label: '제1종일반주거지역' },
    { value: '제2종일반주거지역', label: '제2종일반주거지역' },
    { value: '제3종일반주거지역', label: '제3종일반주거지역' },
    { value: '준주거지역', label: '준주거지역' },
    { value: '중심상업지역', label: '중심상업지역' },
    { value: '일반상업지역', label: '일반상업지역' },
    { value: '근린상업지역', label: '근린상업지역' },
    { value: '유통상업지역', label: '유통상업지역' },
    { value: '전용공업지역', label: '전용공업지역' },
    { value: '일반공업지역', label: '일반공업지역' },
    { value: '준공업지역', label: '준공업지역' },
    { value: '보전녹지지역', label: '보전녹지지역' },
    { value: '생산녹지지역', label: '생산녹지지역' },
    { value: '자연녹지지역', label: '자연녹지지역' },
    { value: '보전관리지역', label: '보전관리지역' },
    { value: '생산관리지역', label: '생산관리지역' },
    { value: '계획관리지역', label: '계획관리지역' },
    { value: '농림지역', label: '농림지역' },
    { value: '자연환경보전지역', label: '자연환경보전지역' },
  ],
}

export const FILTER_LABELS = {
  landCategory: '지목',
  usageStatus: '이용상황',
  zoneType: '용도지역',
}

/**
 * 필터 타입과 값으로 라벨 조회
 * value와 label이 동일하므로 그대로 반환
 */
export const getFilterLabel = (filterType: string, value: string): string => {
  const options = FILTER_OPTIONS[filterType as keyof typeof FILTER_OPTIONS]
  return options?.find(option => option.value === value)?.label || value
}
