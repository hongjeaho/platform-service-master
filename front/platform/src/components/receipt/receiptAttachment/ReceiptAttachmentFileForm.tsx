import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import React from 'react'

import { useGetReceiptAttachmentByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'

import ReceiptAttachmentUploadFormContent from './ReceiptAttachmentUploadFormContent'

interface ReceiptAttachmentFileFormProps {
  formId: string
  handleNextStep: () => void
}

const ReceiptAttachmentFileForm: React.FC<ReceiptAttachmentFileFormProps> = ({
  formId,
  handleNextStep,
}) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading, isRefetching } = useGetReceiptAttachmentByJudgSeq(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  if (isLoading || isRefetching) {
    return <SkeletonLoading />
  }

  return (
    <ReceiptAttachmentUploadFormContent
      judgSeq={judgSeq}
      formId={formId}
      handleNextStep={handleNextStep}
      defaultData={data}
    />
  )
}

export default ReceiptAttachmentFileForm
