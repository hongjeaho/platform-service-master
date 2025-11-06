import LTISAppraisalInfo from '@components/reptInfo/LTISAppraisalInfo'
import LTISBusinessSummary from '@components/reptInfo/LTISBusinessSummary'
import LTISCompensationAmountByOwnerInfo from '@components/reptInfo/LTISCompensationAmountByOwnerInfo'
import LTISImplementerInfo from '@components/reptInfo/LTISImplementerInfo'
import LtisReptInfo from '@components/reptInfo/LtisReptInfo'
import React from 'react'

interface ReceiptPreviewContentProps {
  judgSeq: number
}

const ReceiptPreviewContent: React.FC<ReceiptPreviewContentProps> = ({ judgSeq }) => (
  <>
    {/* 사업 요약 정보 섹션 */}
    <LTISBusinessSummary judgSeq={judgSeq} />
    {/* 조서 정보 섹션 */}
    <LtisReptInfo judgSeq={judgSeq} />
    {/* 비고 정보 섹션 */}
    <LTISImplementerInfo judgSeq={judgSeq} />
    {/* 감정평가정보 섹션 */}
    <LTISAppraisalInfo judgSeq={judgSeq} />
    {/* 소유자별 보상금액 정보 섹션 */}
    <LTISCompensationAmountByOwnerInfo judgSeq={judgSeq} />
  </>
)

export default ReceiptPreviewContent
