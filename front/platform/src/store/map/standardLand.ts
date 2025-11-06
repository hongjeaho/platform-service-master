import { atom } from 'jotai'

// 표준지 표시 상태 관리 (사건 ID별로 on/off)
export const standardLandVisibilityAtom = atom<Record<string, boolean>>({})

// 표준지 표시 상태 토글 함수
export const toggleStandardLandAtom = atom(null, (get, set, caseId: string) => {
  const current = get(standardLandVisibilityAtom)
  set(standardLandVisibilityAtom, {
    ...current,
    [caseId]: !current[caseId],
  })
})

// 특정 사건의 표준지 표시 상태 확인
export const isStandardLandVisibleAtom = atom(get => (caseId: string) => {
  const visibility = get(standardLandVisibilityAtom)
  return !!visibility[caseId]
})

// 모든 표준지 숨김
export const hideAllStandardLandAtom = atom(null, (_, set) => {
  set(standardLandVisibilityAtom, {})
})
