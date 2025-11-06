import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReceiptNoticeResultFormContent from '@components/receipt/receiptNoticeResult/ReceiptNoticeResultFormContent'
import React from 'react'

import { useGetNoticeResult } from '@/api/notice-result-api/notice-result-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'

interface ReceiptNoticeResultFormProps {
  formId: string
  handleNextStep: () => void
}

const ReceiptNoticeResultForm: React.FC<ReceiptNoticeResultFormProps> = ({
  formId,
  handleNextStep,
}) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading, isRefetching } = useGetNoticeResult(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  if (isLoading || isRefetching || data === undefined) {
    return <SkeletonLoading />
  }

  return (
    <ReceiptNoticeResultFormContent
      formId={formId}
      noticeResponse={data}
      judgSeq={judgSeq}
      handleNextStep={handleNextStep}
    />
  )
}

export default ReceiptNoticeResultForm
