import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

import useGetJudgSeq from '@/hooks/useGetJudgSeq'

import ReceiptWriteButtons from './components/ReceiptWriteButtons'
import ReceiptWriteContent from './components/ReceiptWriteContent'

/**
 * ReceiptWrite 컴포넌트
 *
 * LTIS 입력 정보 등록 화면을 제공합니다.
 * 다음과 같은 정보를 표시합니다:
 * - 사업 요약 정보 (BusinessInfo)
 * - 사건 정보 입력 폼 (ReceiptForm)
 *
 * 하단에는 목록 보기 버튼이 있어 '/receipt/application' 경로로 이동할 수 있습니다.
 *
 * @returns {JSX.Element} LTIS 입력 정보 등록 화면
 */
const ReceiptWrite: React.FC = () => {
  // URL 파라미터에서 재결 일련번호 추출
  const judgSeq = useGetJudgSeq()

  return (
    <>
      {/* 페이지 제목 */}
      <MainTitle title="LTIS 입력 정보 등록" />
      <ContainerCenter>
        <ReceiptWriteContent judgSeq={judgSeq} />
        <ReceiptWriteButtons />
      </ContainerCenter>
    </>
  )
}

export default ReceiptWrite
