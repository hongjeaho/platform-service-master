import ReceiptForm from '@components/receipt/form/ReceiptForm'
import BusinessInfo from '@components/reptInfo/LTISBusinessSummary'
import React from 'react'

interface ReceiptWriteContentProps {
  judgSeq: number
}

const ReceiptWriteContent: React.FC<ReceiptWriteContentProps> = ({ judgSeq }) => (
  <>
    {/* 사업 요약 정보 섹션 */}
    <BusinessInfo judgSeq={judgSeq} />
    {/* 접수 정보 입력 폼 */}
    <ReceiptForm judgSeq={judgSeq} />
  </>
)

export default ReceiptWriteContent
