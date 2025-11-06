import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { clearOverlayPositionRequestAtom } from '@store/map/selectedCases'
import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CustomOverlayMap, Polyline } from 'react-kakao-maps-sdk'

import KakaoMapCaseOverlay from './KakaoMapCaseOverlay'

interface CaseOverlayContainerProps {
  selectedCases: KakaoMapSearchCase[]
  mapRef: React.RefObject<kakao.maps.Map | null>
  mapDraggable: boolean
  setMapDraggable: (draggable: boolean) => void
}

const KakaoMapCaseOverlayContainer: React.FC<CaseOverlayContainerProps> = ({
  selectedCases,
  mapRef,
  setMapDraggable,
}) => {
  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({})
  const [draggedOverlayPositions, setDraggedOverlayPositions] = useState<
    Record<string, { lat: number; lng: number }>
  >({})

  const clearPositionRequest = useAtomValue(clearOverlayPositionRequestAtom)
  const lastProcessedClearTimestamp = useRef<number>(0)

  // 좌표 유효성 검증 함수
  const isValidCoordinates = useCallback((coords: { lat: number; lng: number }) => {
    return (
      coords &&
      coords.lat >= -90 &&
      coords.lat <= 90 &&
      coords.lng >= -180 &&
      coords.lng <= 180 &&
      !isNaN(coords.lat) &&
      !isNaN(coords.lng)
    )
  }, [])

  // 특정 사건의 오버레이 위치 초기화 함수
  const clearOverlayPosition = useCallback((caseId: string) => {
    setDraggedOverlayPositions(prev => {
      if (prev[caseId]) {
        const newPositions = { ...prev }
        delete newPositions[caseId]
        console.log(`오버레이 위치 초기화: ${caseId}`)
        return newPositions
      }
      return prev
    })
  }, [])

  // 오버레이 위치 초기화 요청 감지 및 처리
  useEffect(() => {
    if (
      clearPositionRequest &&
      clearPositionRequest.timestamp > lastProcessedClearTimestamp.current
    ) {
      lastProcessedClearTimestamp.current = clearPositionRequest.timestamp
      clearOverlayPosition(clearPositionRequest.caseId)
    }
  }, [clearPositionRequest, clearOverlayPosition])

  // selectedCases 변화 시 존재하지 않는 사건들의 위치 정보 정리 (안전장치)
  useEffect(() => {
    const selectedCaseIds = new Set(selectedCases.map(c => c.id))

    setDraggedOverlayPositions(prev => {
      const cleanedPositions = { ...prev }
      let hasChanges = false

      // 선택되지 않은 사건들의 위치 정보 삭제
      Object.keys(cleanedPositions).forEach(caseId => {
        if (!selectedCaseIds.has(caseId)) {
          delete cleanedPositions[caseId]
          hasChanges = true
          console.log(`안전장치: 선택 해제된 사건의 오버레이 위치 정리 - ${caseId}`)
        }
      })

      return hasChanges ? cleanedPositions : prev
    })
  }, [selectedCases])

  // 오버레이 위치 계산 (드래그된 위치 우선 사용)
  const getOverlayPosition = useCallback(
    (caseId: string, originalCoords: { lat: number; lng: number }) => {
      // 드래그로 이동된 위치가 있으면 우선 사용
      if (draggedOverlayPositions[caseId]) {
        return draggedOverlayPositions[caseId]
      }

      // 기본 위치 (마커 위쪽)
      return {
        lat: originalCoords.lat + 0.004, // 위쪽으로 오프셋
        lng: originalCoords.lng, // 좌우 중앙 정렬
      }
    },
    [draggedOverlayPositions],
  )

  // 현재 드래그 상태를 ref로 관리하여 클로저 문제 해결
  const dragStateRef = useRef<{
    isDragging: boolean
    caseId: string | null
    startPosition: { x: number; y: number } | null
    initialOverlayPosition: { lat: number; lng: number } | null
  }>({
    isDragging: false,
    caseId: null,
    startPosition: null,
    initialOverlayPosition: null,
  })

  // 쓰로틀링을 위한 ref들
  const rafIdRef = useRef<number | null>(null)
  const lastMouseEventRef = useRef<MouseEvent | null>(null)

  // 쓰로틀링된 드래그 처리 함수
  const processDragMove = useCallback(() => {
    const currentDragState = dragStateRef.current
    const mouseEvent = lastMouseEventRef.current

    if (
      !currentDragState.isDragging ||
      !currentDragState.caseId ||
      !currentDragState.startPosition ||
      !currentDragState.initialOverlayPosition ||
      !mouseEvent
    ) {
      rafIdRef.current = null
      return
    }

    // 지도 인스턴스 유효성 검사
    if (!mapRef.current) {
      console.error('드래그 중 지도 인스턴스를 찾을 수 없습니다')
      rafIdRef.current = null
      return
    }

    try {
      // 마우스 이동 거리 계산
      const deltaX = mouseEvent.clientX - currentDragState.startPosition.x
      const deltaY = mouseEvent.clientY - currentDragState.startPosition.y

      const projection = mapRef.current.getProjection()
      if (!projection) {
        console.error('지도 투영 정보를 가져올 수 없습니다')
        rafIdRef.current = null
        return
      }

      // 초기 위치를 픽셀로 변환
      const initialPixel = projection.containerPointFromCoords(
        new kakao.maps.LatLng(
          currentDragState.initialOverlayPosition.lat,
          currentDragState.initialOverlayPosition.lng,
        ),
      )

      // 새로운 픽셀 위치 계산
      const newPixel = new kakao.maps.Point(initialPixel.x + deltaX, initialPixel.y + deltaY)

      // 새로운 지도 좌표로 변환
      const newLatLng = projection.coordsFromContainerPoint(newPixel)

      // 좌표 유효성 검증
      if (!isValidCoordinates({ lat: newLatLng.getLat(), lng: newLatLng.getLng() })) {
        console.warn('드래그된 위치가 유효하지 않습니다')
        rafIdRef.current = null
        return
      }

      // 지도 경계 제한 검사
      const mapBounds = mapRef.current.getBounds()
      if (mapBounds) {
        const newCoords = { lat: newLatLng.getLat(), lng: newLatLng.getLng() }

        // 지도 경계를 벗어나면 경계 내로 제한
        if (!mapBounds.contain(new kakao.maps.LatLng(newCoords.lat, newCoords.lng))) {
          const sw = mapBounds.getSouthWest()
          const ne = mapBounds.getNorthEast()

          const constrainedCoords = {
            lat: Math.max(sw.getLat(), Math.min(ne.getLat(), newCoords.lat)),
            lng: Math.max(sw.getLng(), Math.min(ne.getLng(), newCoords.lng)),
          }

          // 위치가 실제로 변경된 경우에만 업데이트 (경계 제한 적용)
          setDraggedOverlayPositions(prev => {
            const currentPos = prev[currentDragState.caseId!]
            if (
              currentPos &&
              Math.abs(currentPos.lat - constrainedCoords.lat) < 0.0001 &&
              Math.abs(currentPos.lng - constrainedCoords.lng) < 0.0001
            ) {
              return prev // 변경이 미미하면 업데이트하지 않음
            }
            return {
              ...prev,
              [currentDragState.caseId!]: constrainedCoords,
            }
          })
          rafIdRef.current = null
          return
        }
      }

      // 위치가 실제로 변경된 경우에만 업데이트 (정상 범위)
      const newCoords = { lat: newLatLng.getLat(), lng: newLatLng.getLng() }
      setDraggedOverlayPositions(prev => {
        const currentPos = prev[currentDragState.caseId!]
        if (
          currentPos &&
          Math.abs(currentPos.lat - newCoords.lat) < 0.0001 &&
          Math.abs(currentPos.lng - newCoords.lng) < 0.0001
        ) {
          return prev // 변경이 미미하면 업데이트하지 않음
        }
        return {
          ...prev,
          [currentDragState.caseId!]: newCoords,
        }
      })
    } catch (error) {
      console.error('드래그 중 오류가 발생했습니다:', error)
    }

    rafIdRef.current = null
  }, [isValidCoordinates, mapRef])

  // 커스텀 드래그 시작 핸들러
  const handleCustomDragStart = useCallback(
    (e: React.MouseEvent, caseId: string) => {
      e.preventDefault()
      e.stopPropagation()

      // 이미 드래그 중이면 무시
      if (dragStateRef.current.isDragging) {
        return
      }

      // 지도 인스턴스가 없으면 드래그 불가
      if (!mapRef.current) {
        console.error('지도 인스턴스가 없어 드래그를 시작할 수 없습니다')
        return
      }

      // 현재 오버레이 위치 가져오기
      const currentCase = selectedCases.find(c => c.id === caseId)
      if (!currentCase) {
        console.error(`사건 데이터를 찾을 수 없습니다: ${caseId}`)
        return
      }

      // 좌표가 없으면 드래그 불가
      if (!currentCase.coordinates) {
        console.error(`사건에 좌표가 없어 드래그를 시작할 수 없습니다: ${caseId}`)
        return
      }

      const initialOverlayPos = getOverlayPosition(caseId, currentCase.coordinates)

      // ref에 드래그 상태 저장
      dragStateRef.current = {
        isDragging: true,
        caseId,
        startPosition: { x: e.clientX, y: e.clientY },
        initialOverlayPosition: initialOverlayPos,
      }

      setIsDragging(prev => ({ ...prev, [caseId]: true }))
      setMapDraggable(false) // 지도 드래그 비활성화

      // 전역 마우스 이벤트 리스너 등록 (쓰로틀링 적용)
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragStateRef.current.isDragging) return

        e.preventDefault()

        // 마우스 이벤트 저장
        lastMouseEventRef.current = e

        // 이미 requestAnimationFrame이 예약되어 있다면 무시
        if (rafIdRef.current !== null) return

        // requestAnimationFrame으로 60fps 제한
        rafIdRef.current = requestAnimationFrame(processDragMove)
      }

      const handleMouseUp = () => {
        const currentDragState = dragStateRef.current

        // 진행 중인 requestAnimationFrame 취소
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }

        // 마우스 이벤트 참조 정리
        lastMouseEventRef.current = null

        // 상태 리셋
        if (currentDragState.caseId) {
          setIsDragging(prev => ({ ...prev, [currentDragState.caseId!]: false }))
        }
        setMapDraggable(true) // 지도 드래그 재활성화

        dragStateRef.current = {
          isDragging: false,
          caseId: null,
          startPosition: null,
          initialOverlayPosition: null,
        }

        // 전역 이벤트 리스너 제거
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [selectedCases, getOverlayPosition, processDragMove, mapRef, setMapDraggable],
  )

  return (
    <>
      {selectedCases
        .filter(caseItem => caseItem.coordinates) // 좌표가 있는 사건만 렌더링
        .map(caseItem => {
          const markerPosition = caseItem.coordinates!
          const overlayPosition = getOverlayPosition(caseItem.id, markerPosition)

          return (
            <React.Fragment key={`detailed-${caseItem.id}`}>
              {/* 커스텀 오버레이 - 수동 드래그 시스템 */}
              <CustomOverlayMap position={overlayPosition} xAnchor={0.5} yAnchor={1} zIndex={1}>
                <div
                  onMouseDown={e => handleCustomDragStart(e, caseItem.id)}
                  style={{ cursor: isDragging[caseItem.id] ? 'grabbing' : 'grab' }}
                >
                  <KakaoMapCaseOverlay
                    caseData={caseItem}
                    isDragging={isDragging[caseItem.id] || false}
                  />
                </div>
              </CustomOverlayMap>

              {/* 마커와 오버레이를 연결하는 파란색 선 */}
              <Polyline
                path={[markerPosition, overlayPosition]}
                strokeWeight={2}
                strokeColor="#2563eb"
                strokeOpacity={0.8}
                strokeStyle="solid"
              />
            </React.Fragment>
          )
        })}
    </>
  )
}

export default React.memo(KakaoMapCaseOverlayContainer)
