import OpinionCaseTemplateCommentTabSection from '@components/opinion/template/comment/OpinionCaseTemplateCommentTabSection'
import ReceiptAttachmentFileView from '@components/receipt/receiptAttachment/ReceiptAttachmentFileView'
import ReceiptCaseInfoView from '@components/receipt/receiptCaseInfo/ReceiptCaseInfoView'
import ReceiptPreviousAppraisalView from '@components/receipt/receiptPreviousAppraisal/ReceiptPreviousAppraisalView'
import useOpinionCaseTemplateCommitList from '@components/receipt/receiptTemplateOpinion/hook/useOpinionCaseTemplateCommitList'
import ReceiptTotalQuantityReportView from '@components/receipt/receiptTotalQuantityReport/ReceiptTotalQuantityReportView'
import React from 'react'

interface ReceiptViewContentProps {
  judgSeq: number
}

const ReceiptViewContent: React.FC<ReceiptViewContentProps> = ({ judgSeq }) => {
  const { opinionCaseTemplateCommitList } = useOpinionCaseTemplateCommitList()

  return (
    <div>
      {/* 시행자 사건 정보 섹션 */}
      <ReceiptCaseInfoView judgSeq={judgSeq} />

      {/* 사전 협의 평가 정보 섹션 */}
      <ReceiptPreviousAppraisalView judgSeq={judgSeq} />

      {/* 총물량조서 섹션 */}
      <ReceiptTotalQuantityReportView judgSeq={judgSeq} />

      {/* 사건 파일 업로드 정보 섹션 */}
      <ReceiptAttachmentFileView judgSeq={judgSeq} />

      {/* 사업시행자 의견 */}
      <div className="mt-6">
        <OpinionCaseTemplateCommentTabSection
          type="read"
          opinionCaseTemplateCommitList={opinionCaseTemplateCommitList}
        />
      </div>
    </div>
  )
}

export default ReceiptViewContent
