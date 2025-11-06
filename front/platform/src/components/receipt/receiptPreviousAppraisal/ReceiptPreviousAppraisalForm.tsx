import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReceiptPreviousAppraisalFormContent from '@components/receipt/receiptPreviousAppraisal/ReceiptPreviousAppraisalFormContent'
import React from 'react'

import { useGetReceiptPreviousAppraisalByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'

interface ReceiptPreviousAppraisalFormProps {
  formId: string
  handleNextStep: () => void
}

const ReceiptPreviousAppraisalForm: React.FC<ReceiptPreviousAppraisalFormProps> = ({
  formId,
  handleNextStep,
}) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading, isRefetching } = useGetReceiptPreviousAppraisalByJudgSeq(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  if (isLoading || isRefetching || !data) {
    return <SkeletonLoading />
  }

  return (
    <ReceiptPreviousAppraisalFormContent
      judgSeq={judgSeq}
      formId={formId}
      defaultData={data}
      handleNextStep={handleNextStep}
    />
  )
}

export default ReceiptPreviousAppraisalForm
