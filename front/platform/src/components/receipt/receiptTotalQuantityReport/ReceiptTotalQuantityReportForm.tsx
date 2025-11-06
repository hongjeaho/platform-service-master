import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReceiptTotalQuantityReportFormContent from '@components/receipt/receiptTotalQuantityReport/ReceiptTotalQuantityReportFormContent'
import React from 'react'

import { useGetReceiptQuantityReportByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'

interface ReceiptTotalQuantityReportFormProps {
  formId: string
  handleNextStep: () => void
}

const ReceiptTotalQuantityReportForm: React.FC<ReceiptTotalQuantityReportFormProps> = ({
  formId,
  handleNextStep,
}) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading, isRefetching } = useGetReceiptQuantityReportByJudgSeq(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  if (isLoading || isRefetching) {
    return <SkeletonLoading />
  }

  return (
    <ReceiptTotalQuantityReportFormContent
      judgSeq={judgSeq}
      defaultData={data}
      handleNextStep={handleNextStep}
      formId={formId}
    />
  )
}

export default ReceiptTotalQuantityReportForm
