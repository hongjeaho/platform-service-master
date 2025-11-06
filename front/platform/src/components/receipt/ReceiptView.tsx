import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

import useGetJudgSeq from '@/hooks/useGetJudgSeq'

import ReceiptViewButtons from './components/ReceiptViewButtons'
import ReceiptViewContent from './components/ReceiptViewContent'

const ReceiptView: React.FC = () => {
  const judgSeq = useGetJudgSeq()

  return (
    <>
      {/* 페이지 제목 */}
      <MainTitle title="심의 지원 접수 정보 확인" />
      <ContainerCenter>
        <ReceiptViewContent judgSeq={judgSeq} />
        <ReceiptViewButtons judgSeq={judgSeq} />
      </ContainerCenter>
    </>
  )
}

export default ReceiptView
