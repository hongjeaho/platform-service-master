import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

import useGetJudgSeq from '@/hooks/useGetJudgSeq'

import ReceiptPreviewButtons from './components/ReceiptPreviewButtons'
import ReceiptPreviewContent from './components/ReceiptPreviewContent'

const ReceiptPreview: React.FC = () => {
  // URL 파라미터에서 재결일련번호 추출
  const judgSeq = useGetJudgSeq()

  return (
    <>
      {/* 페이지 제목 */}
      <MainTitle title="심의 지원 접수" />
      <ContainerCenter>
        <ReceiptPreviewContent judgSeq={judgSeq} />
        <ReceiptPreviewButtons judgSeq={judgSeq} />
      </ContainerCenter>
    </>
  )
}
export default ReceiptPreview
