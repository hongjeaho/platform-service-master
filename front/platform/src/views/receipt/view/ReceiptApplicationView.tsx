import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import useGetJudgSeq from '@hooks/useGetJudgSeq'
import React, { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetReceiptCurrentStatusCode } from '@/api/receipt-base-api/receipt-base-api'

/**
 * 라우터 위치 상태에서 추출하는 쓰기 모드 상태를 위한 인터페이스
 */
interface LocationState {
  isWrite: boolean | undefined | null
  isComplete: boolean | undefined | null
}

// 지연 로딩을 통해 성능 최적화를 위한 컴포넌트 임포트
/**
 * LTIS 입력 정보 확인 화면 (미리보기)
 * 사용자가 LTIS 입력 정보를 확인하고 등록할 수 있는 화면
 */
const ReceiptPreview = lazy(() => import('@components/receipt/ReceiptPreview'))

/**
 * LTIS 입력 정보 확인 화면 (조회)
 * 등록된 LTIS 입력 정보를 조회하는 화면
 */
const ReceiptView = lazy(() => import('@components/receipt/ReceiptView'))

/**
 * LTIS 입력 정보 등록 화면
 * 사용자가 LTIS 입력 정보를 등록하는 화면
 */
const ReceiptWrite = lazy(() => import('@components/receipt/ReceiptWrite'))

/**
 * 시행자 애플리케이션 뷰 컴포넌트
 *
 * 이 컴포넌트는 현재 케이스의 상태 코드와 라우터 상태에 따라
 * 적절한 화면(미리보기, 등록, 조회)을 조건부로 렌더링합니다.
 *
 * @returns {JSX.Element} 상태에 따른 적절한 시행자 화면
 */
const ReceiptApplicationView: React.FC = () => {
  // URL 파라미터에서 재결 일련번호 추출
  const judgSeq = useGetJudgSeq()
  // 현재 라우터 위치 및 상태 정보 가져오기
  const location = useLocation()
  const locationState = location.state as LocationState

  // 현재 케이스 정보의 상태 코드를 가져옴
  const { data, isLoading, refetch } = useGetReceiptCurrentStatusCode(judgSeq)

  // 페이지 이동 또는 쓰기 모드 변경 시 페이지 상단으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0)
    void refetch()

    console.log('data', data)
    console.log('locationState', locationState)
  }, [location.pathname, locationState])

  // 데이터 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <SkeletonLoading />
  }

  // 작성을 시작하기 전이라면 LTIS에서 입력한 정보를 보여준다.
  if (data === 'CR001000' && locationState?.isWrite !== true) {
    return (
      <Suspense fallback={<SkeletonLoading />}>
        <ReceiptPreview />
      </Suspense>
    )
  }

  // 상태 코드가 CR001007(의견 등록)이 아니거나 쓰기 모드인 경우 등록 화면 표시
  if (data !== 'CR001007' || locationState?.isWrite) {
    return (
      <Suspense fallback={<SkeletonLoading />}>
        <ReceiptWrite />
      </Suspense>
    )
  }

  // 의견 등록까지 모든 작성을 완료 하였다면, 입력한 내용을 볼 수 있는 화면으로 이동
  if (data === 'CR001007' || locationState?.isComplete !== true) {
    return (
      <Suspense fallback={<SkeletonLoading />}>
        <ReceiptView />
      </Suspense>
    )
  }
}

export default ReceiptApplicationView
