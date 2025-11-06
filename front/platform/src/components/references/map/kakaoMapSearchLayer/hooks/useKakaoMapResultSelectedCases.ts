import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import {
  addSelectedCaseAtom,
  canSelectMoreCasesAtom,
  clearSelectedCasesAtom,
  isCaseSelectedAtom,
  removeSelectedCaseAtom,
  requestClearOverlayPositionAtom,
  requestMapMoveAtom,
  selectedCasesAtom,
  selectedCasesCountAtom,
} from '@store/map/selectedCases'
import { useShowAlertMessage } from '@store/message'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

export const useKakaoMapResultSelectedCases = () => {
  const rawSelectedCases = useAtomValue(selectedCasesAtom)

  // 테스트를 위한 표준지 데이터 추가 (Mock 데이터)
  const selectedCases = useMemo(
    () =>
      rawSelectedCases.map((caseItem, index) => {
        // 모든 사건에 표준지 데이터 추가 (테스트용)
        // 좌표가 있는 경우에만 표준지 데이터 생성
        if (index >= 0 && caseItem.coordinates) {
          return {
            ...caseItem,
            standardLand: {
              coordinates: {
                lat: caseItem.coordinates.lat + 0.01, // 원본에서 약간 북쪽
                lng: caseItem.coordinates.lng + 0.005, // 약간 동쪽
              },
              address: `${caseItem.address} 일대 표준지`,
              price: Math.floor((caseItem.price / caseItem.area) * 0.8), // 단가의 80% 수준
              area: Math.floor(caseItem.area * 0.1), // 원본 면적의 10%
            },
          }
        }
        return caseItem
      }),
    [rawSelectedCases],
  )
  const selectedCount = useAtomValue(selectedCasesCountAtom)
  const canSelectMore = useAtomValue(canSelectMoreCasesAtom)
  const isCaseSelected = useAtomValue(isCaseSelectedAtom)

  const addSelectedCase = useSetAtom(addSelectedCaseAtom)
  const removeSelectedCase = useSetAtom(removeSelectedCaseAtom)
  const clearSelectedCases = useSetAtom(clearSelectedCasesAtom)
  const requestMapMove = useSetAtom(requestMapMoveAtom)
  const requestClearOverlayPosition = useSetAtom(requestClearOverlayPositionAtom)

  const showAlertMessage = useShowAlertMessage()

  const handleCaseSelection = useCallback(
    (caseItem: KakaoMapSearchCase, selected: boolean) => {
      if (selected) {
        // 사건 선택
        if (!canSelectMore) {
          showAlertMessage('최대 3개까지 선택할 수 있습니다.')
          return false
        }

        // 좌표가 없는 경우 먼저 체크하고 알림 표시
        if (!caseItem.coordinates) {
          console.warn('좌표 없는 사건 선택 시도:', caseItem)
          showAlertMessage('선택한 사건의 좌표 정보가 없습니다.')
          // 좌표가 없어도 선택 목록에는 추가
        }

        const success = addSelectedCase(caseItem)
        if (!success) {
          showAlertMessage('이미 선택된 사건입니다.')
          return false
        }

        // 좌표가 있는 경우에만 지도 이동 요청
        if (caseItem.coordinates) {
          console.log('체크박스 선택 - 지도 이동 요청')
          console.log('선택된 사건:', caseItem)
          console.log('사건 좌표:', caseItem.coordinates)

          const targetCoordinates = {
            lat: caseItem.coordinates.lat + 0.002, // 오버레이를 고려한 중심점 조정
            lng: caseItem.coordinates.lng,
          }
          console.log('지도 이동 요청 좌표:', targetCoordinates)
          requestMapMove(targetCoordinates)
        }

        return true
      } else {
        // 사건 선택 해제
        removeSelectedCase(caseItem.id)

        // 선택 해제 시 오버레이 위치 초기화 요청
        requestClearOverlayPosition(caseItem.id)

        return true
      }
    },
    [
      canSelectMore,
      addSelectedCase,
      removeSelectedCase,
      showAlertMessage,
      requestMapMove,
      requestClearOverlayPosition,
    ],
  )

  const isSelected = useCallback(
    (caseId: string) => {
      return isCaseSelected(caseId)
    },
    [isCaseSelected],
  )

  const getSelectedCaseById = useCallback(
    (caseId: string) => {
      return selectedCases.find(caseItem => caseItem.id === caseId)
    },
    [selectedCases],
  )

  const toggleCaseSelection = useCallback(
    (caseItem: KakaoMapSearchCase) => {
      const currentlySelected = isSelected(caseItem.id)
      return handleCaseSelection(caseItem, !currentlySelected)
    },
    [isSelected, handleCaseSelection],
  )

  return useMemo(
    () => ({
      selectedCases,
      selectedCount,
      canSelectMore,
      isSelected,
      handleCaseSelection,
      toggleCaseSelection,
      getSelectedCaseById,
      clearSelectedCases,
    }),
    [
      selectedCases,
      selectedCount,
      canSelectMore,
      isSelected,
      handleCaseSelection,
      toggleCaseSelection,
      getSelectedCaseById,
      clearSelectedCases,
    ],
  )
}
