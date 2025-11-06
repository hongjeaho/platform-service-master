export interface KakaoMapSearchCase {
  id: string
  caseNumber: string // 사건번호
  caseName: string // 사건명
  caseType: string // 사건 유형
  address: string // 주소
  area: number // 면적 (㎡)
  price: number // 가격 (원)
  coordinates?: {
    lat: number
    lng: number
  }
  landCategory: string[] // 지목
  usageStatus: string[] // 이용상황
  zoneType: string[] // 용도지역
  createdAt: string
  standardLand?: {
    coordinates: {
      lat: number
      lng: number
    }
    address: string
    price: number // 표준지 공시지가 (원/㎡)
    area: number // 표준지 면적 (㎡)
  }
}

export interface KakaoMapSearchRequest {
  keyword?: string
  landCategory: string[]
  usageStatus: string[]
  zoneType: string[]
  page?: number
  size?: number
}

export interface KakaoMapSearchResponse {
  cases: KakaoMapSearchCase[]
  totalCount: number
  page: number
  size: number
  hasNext: boolean
}
