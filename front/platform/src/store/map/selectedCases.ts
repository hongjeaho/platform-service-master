import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { atom } from 'jotai'

// 지도 이동 요청을 위한 타입
interface MapMoveRequest {
  coordinates: { lat: number; lng: number }
  timestamp: number
}

// 선택된 사건 목록을 관리하는 atom
export const selectedCasesAtom = atom<KakaoMapSearchCase[]>([])

// 선택된 사건을 추가하는 write-only atom
export const addSelectedCaseAtom = atom(null, (get, set, newCase: KakaoMapSearchCase) => {
  const currentCases = get(selectedCasesAtom)
  // 이미 선택된 사건인지 확인
  const isAlreadySelected = currentCases.some(caseItem => caseItem.id === newCase.id)

  if (!isAlreadySelected && currentCases.length < 3) {
    set(selectedCasesAtom, [...currentCases, newCase])
    return true // 성공적으로 추가됨
  }
  return false // 추가되지 않음 (중복이거나 3개 초과)
})

// 선택된 사건을 제거하는 write-only atom
export const removeSelectedCaseAtom = atom(null, (get, set, caseId: string) => {
  const currentCases = get(selectedCasesAtom)
  const filteredCases = currentCases.filter(caseItem => caseItem.id !== caseId)
  set(selectedCasesAtom, filteredCases)
})

// 모든 선택된 사건을 초기화하는 write-only atom
export const clearSelectedCasesAtom = atom(null, (_, set) => {
  set(selectedCasesAtom, [])
})

// 오버레이 위치 초기화 요청을 위한 atom (타임스탬프를 사용해 변화 감지)
export const clearOverlayPositionRequestAtom = atom<{ caseId: string; timestamp: number } | null>(
  null,
)

// 특정 사건의 오버레이 위치 초기화를 요청하는 write-only atom
export const requestClearOverlayPositionAtom = atom(null, (_, set, caseId: string) => {
  console.log('오버레이 위치 초기화 요청:', caseId)
  set(clearOverlayPositionRequestAtom, {
    caseId,
    timestamp: Date.now(),
  })
})

// 특정 사건이 선택되어 있는지 확인하는 read-only atom
export const isCaseSelectedAtom = atom(get => (caseId: string) => {
  const selectedCases = get(selectedCasesAtom)
  return selectedCases.some(caseItem => caseItem.id === caseId)
})

// 선택된 사건 수를 반환하는 read-only atom
export const selectedCasesCountAtom = atom(get => get(selectedCasesAtom).length)

// 최대 선택 가능 여부를 확인하는 read-only atom
export const canSelectMoreCasesAtom = atom(get => get(selectedCasesAtom).length < 3)

// 지도 이동 요청을 관리하는 atom
export const mapMoveRequestAtom = atom<MapMoveRequest | null>(null)

// 지도 이동 요청을 생성하는 write-only atom
export const requestMapMoveAtom = atom(
  null,
  (_, set, coordinates: { lat: number; lng: number }) => {
    console.log('지도 이동 요청 생성:', coordinates)
    set(mapMoveRequestAtom, {
      coordinates,
      timestamp: Date.now(),
    })
  },
)
