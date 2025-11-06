import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReceiptAgreementDateView from '@components/receipt/receiptCaseInfo/view/ReceiptAgreementDateView'
import ReceiptBusinessRecognitionView from '@components/receipt/receiptCaseInfo/view/ReceiptBusinessRecognitionView'
import React from 'react'

import { useGetReceiptCaseInfoByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'

import ReceiptBusinessInfoView from './view/ReceiptBusinessInfoView'

interface ReceiptCaseInfoProps {
  judgSeq: number
}

const ReceiptCaseInfoView: React.FC<ReceiptCaseInfoProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetReceiptCaseInfoByJudgSeq(judgSeq)

  if (isLoading) {
    return <SkeletonLoading />
  }

  return (
    <div>
      {data?.businessInfo && <ReceiptBusinessInfoView data={data.businessInfo} />}
      {data?.agreementDateList && <ReceiptAgreementDateView data={data.agreementDateList} />}
      {data?.businessRecognitionList && (
        <ReceiptBusinessRecognitionView data={data.businessRecognitionList} />
      )}
    </div>
  )
}
export default ReceiptCaseInfoView
