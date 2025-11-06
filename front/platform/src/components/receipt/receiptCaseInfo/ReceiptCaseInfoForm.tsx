import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReceiptCaseInfoContent from '@components/receipt/receiptCaseInfo/ReceiptCaseInfoContent'
import React from 'react'

import { useGetReceiptCaseInfoByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'

interface ReceiptCaseInfoFormProps {
  formId: string
  handleNextStep: () => void
}

const ReceiptCaseInfoForm: React.FC<ReceiptCaseInfoFormProps> = ({ formId, handleNextStep }) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading, isRefetching } = useGetReceiptCaseInfoByJudgSeq(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  if (isLoading || isRefetching) {
    return <SkeletonLoading />
  }

  return (
    <ReceiptCaseInfoContent
      judgSeq={judgSeq}
      formId={formId}
      implementerCaseInfo={data}
      handleNextStep={handleNextStep}
    />
  )
}

export default ReceiptCaseInfoForm
