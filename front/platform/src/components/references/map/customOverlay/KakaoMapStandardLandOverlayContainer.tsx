import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { standardLandVisibilityAtom } from '@store/map/standardLand'
import { useAtomValue } from 'jotai'
import React, { useCallback, useRef, useState } from 'react'
import { CustomOverlayMap, Polyline } from 'react-kakao-maps-sdk'

import KakaoMapStandardLandOverlay from './KakaoMapStandardLandOverlay'

interface StandardLandOverlayContainerProps {
  selectedCases: KakaoMapSearchCase[]
  mapRef: React.RefObject<kakao.maps.Map | null>
  mapDraggable: boolean
  setMapDraggable: (draggable: boolean) => void
}

const KakaoMapStandardLandOverlayContainer: React.FC<StandardLandOverlayContainerProps> = ({
  selectedCases,
  mapRef,
  setMapDraggable,
}) => {
  const standardLandVisibility = useAtomValue(standardLandVisibilityAtom)
  const [isStandardLandDragging, setIsStandardLandDragging] = useState<Record<string, boolean>>({})
  const [draggedStandardLandPositions, setDraggedStandardLandPositions] = useState<
    Record<string, { lat: number; lng: number }>
  >({})

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

  // 표준지 오버레이 위치 계산
  const getStandardLandOverlayPosition = useCallback(
    (caseId: string, originalCoords: { lat: number; lng: number }) => {
      // 드래그로 이동된 위치가 있으면 우선 사용
      if (draggedStandardLandPositions[caseId]) {
        return draggedStandardLandPositions[caseId]
      }

      // 기본 위치 (표준지 마커 위쪽)
      return {
        lat: originalCoords.lat + 0.004, // 위쪽으로 오프셋
        lng: originalCoords.lng, // 좌우 중앙 정렬
      }
    },
    [draggedStandardLandPositions],
  )

  // 표준지 드래그 상태 관리
  const standardLandDragStateRef = useRef<{
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

  // 표준지 쓰로틀링을 위한 ref들
  const standardLandRafIdRef = useRef<number | null>(null)
  const standardLandLastMouseEventRef = useRef<MouseEvent | null>(null)

  // 표준지 쓰로틀링된 드래그 처리 함수
  const processStandardLandDragMove = useCallback(() => {
    const currentDragState = standardLandDragStateRef.current
    const mouseEvent = standardLandLastMouseEventRef.current

    if (
      !currentDragState.isDragging ||
      !currentDragState.caseId ||
      !currentDragState.startPosition ||
      !currentDragState.initialOverlayPosition ||
      !mouseEvent
    ) {
      standardLandRafIdRef.current = null
      return
    }

    // 지도 인스턴스 유효성 검사
    if (!mapRef.current) {
      console.error('표준지 드래그 중 지도 인스턴스를 찾을 수 없습니다')
      standardLandRafIdRef.current = null
      return
    }

    try {
      // 마우스 이동 거리 계산
      const deltaX = mouseEvent.clientX - currentDragState.startPosition.x
      const deltaY = mouseEvent.clientY - currentDragState.startPosition.y

      const projection = mapRef.current.getProjection()
      if (!projection) {
        console.error('지도 투영 정보를 가져올 수 없습니다')
        standardLandRafIdRef.current = null
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
        console.warn('표준지 드래그된 위치가 유효하지 않습니다')
        standardLandRafIdRef.current = null
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
          setDraggedStandardLandPositions(prev => {
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
          standardLandRafIdRef.current = null
          return
        }
      }

      // 위치가 실제로 변경된 경우에만 업데이트 (정상 범위)
      const newCoords = { lat: newLatLng.getLat(), lng: newLatLng.getLng() }
      setDraggedStandardLandPositions(prev => {
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
      console.error('표준지 드래그 중 오류가 발생했습니다:', error)
    }

    standardLandRafIdRef.current = null
  }, [isValidCoordinates, mapRef])

  // 표준지 커스텀 드래그 시작 핸들러
  const handleStandardLandDragStart = useCallback(
    (e: React.MouseEvent, caseId: string) => {
      e.preventDefault()
      e.stopPropagation()

      // 이미 드래그 중이면 무시
      if (standardLandDragStateRef.current.isDragging) {
        return
      }

      // 지도 인스턴스가 없으면 드래그 불가
      if (!mapRef.current) {
        console.error('지도 인스턴스가 없어 표준지 드래그를 시작할 수 없습니다')
        return
      }

      // 현재 표준지 오버레이 위치 가져오기
      const currentCase = selectedCases.find(c => c.id === caseId)
      if (!currentCase || !currentCase.standardLand) {
        console.error(`표준지 데이터를 찾을 수 없습니다: ${caseId}`)
        return
      }

      const initialOverlayPos = getStandardLandOverlayPosition(
        caseId,
        currentCase.standardLand.coordinates,
      )

      // ref에 드래그 상태 저장
      standardLandDragStateRef.current = {
        isDragging: true,
        caseId,
        startPosition: { x: e.clientX, y: e.clientY },
        initialOverlayPosition: initialOverlayPos,
      }

      setIsStandardLandDragging(prev => ({ ...prev, [caseId]: true }))
      setMapDraggable(false) // 지도 드래그 비활성화

      // 전역 마우스 이벤트 리스너 등록 (쓰로틀링 적용)
      const handleMouseMove = (e: MouseEvent) => {
        if (!standardLandDragStateRef.current.isDragging) return

        e.preventDefault()

        // 마우스 이벤트 저장
        standardLandLastMouseEventRef.current = e

        // 이미 requestAnimationFrame이 예약되어 있다면 무시
        if (standardLandRafIdRef.current !== null) return

        // requestAnimationFrame으로 60fps 제한
        standardLandRafIdRef.current = requestAnimationFrame(processStandardLandDragMove)
      }

      const handleMouseUp = () => {
        const currentDragState = standardLandDragStateRef.current

        // 진행 중인 requestAnimationFrame 취소
        if (standardLandRafIdRef.current !== null) {
          cancelAnimationFrame(standardLandRafIdRef.current)
          standardLandRafIdRef.current = null
        }

        // 마우스 이벤트 참조 정리
        standardLandLastMouseEventRef.current = null

        // 상태 리셋
        if (currentDragState.caseId) {
          setIsStandardLandDragging(prev => ({ ...prev, [currentDragState.caseId!]: false }))
        }
        setMapDraggable(true) // 지도 드래그 재활성화

        standardLandDragStateRef.current = {
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
    [
      selectedCases,
      getStandardLandOverlayPosition,
      processStandardLandDragMove,
      mapRef,
      setMapDraggable,
    ],
  )

  // 표준지가 표시되어야 하는 사건들 필터링
  const visibleStandardLandCases = selectedCases.filter(
    caseItem => caseItem.standardLand && standardLandVisibility[caseItem.id],
  )

  return (
    <>
      {visibleStandardLandCases.map(caseItem => {
        const standardLand = caseItem.standardLand!
        const standardLandPosition = standardLand.coordinates
        const overlayPosition = getStandardLandOverlayPosition(caseItem.id, standardLandPosition)

        return (
          <React.Fragment key={`standard-${caseItem.id}`}>
            {/* 표준지 커스텀 오버레이 */}
            <CustomOverlayMap position={overlayPosition} xAnchor={0.5} yAnchor={1}>
              <div
                onMouseDown={e => handleStandardLandDragStart(e, caseItem.id)}
                style={{
                  cursor: isStandardLandDragging[caseItem.id] ? 'grabbing' : 'grab',
                }}
              >
                <KakaoMapStandardLandOverlay
                  caseData={caseItem}
                  standardLandData={standardLand}
                  isDragging={isStandardLandDragging[caseItem.id] || false}
                />
              </div>
            </CustomOverlayMap>

            {/* 표준지 마커와 오버레이를 연결하는 빨간색 선 */}
            <Polyline
              path={[standardLandPosition, overlayPosition]}
              strokeWeight={2}
              strokeColor="#dc2626"
              strokeOpacity={0.8}
              strokeStyle="solid"
            />
          </React.Fragment>
        )
      })}
    </>
  )
}

export default React.memo(KakaoMapStandardLandOverlayContainer)
