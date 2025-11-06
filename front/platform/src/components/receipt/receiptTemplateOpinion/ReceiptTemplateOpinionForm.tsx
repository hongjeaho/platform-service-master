import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import OpinionCaseTemplateCommentTabSection from '@components/opinion/template/comment/OpinionCaseTemplateCommentTabSection'
import OpinionTemplateDescriptionSection from '@components/opinion/template/description/OpinionTemplateDescriptionSection'
import OpinionTemplateCodeSelectBox from '@components/opinion/template/OpinionTemplateCodeSelectBox'
import useOpinionCaseTemplateCommitList from '@components/receipt/receiptTemplateOpinion/hook/useOpinionCaseTemplateCommitList'
import useReceiptTemplateOpinionSubmit from '@components/receipt/receiptTemplateOpinion/hook/useReceiptTemplateOpinionSubmit'
import React from 'react'

interface ReceiptOpinionFormProps {
  formId: string
  handleNextStep: () => void
}

const ReceiptTemplateOpinionForm: React.FC<ReceiptOpinionFormProps> = ({ formId }) => {
  const { onSubmit } = useReceiptTemplateOpinionSubmit()
  const {
    isLoadingOpinion,
    isRefetchingOpinion,
    opinionCaseTemplateCommitList,
    onCommitListRefetch,
  } = useOpinionCaseTemplateCommitList()

  /**
   * 로딩 상태 처리
   * 데이터 로딩 중이거나 재조회 중일 때 스켈레톤 로딩 UI를 표시합니다.
   */
  if (isLoadingOpinion || isRefetchingOpinion) {
    return <SkeletonLoading />
  }

  return (
    <>
      {/*  쟁점의견 상세 설명 아코디언  */}
      <OpinionTemplateDescriptionSection />

      <div className={'mt5'}>
        <OpinionTemplateCodeSelectBox onCommitListRefetch={onCommitListRefetch} />
      </div>

      <form id={formId} onSubmit={onSubmit} autoComplete="off">
        <OpinionCaseTemplateCommentTabSection
          opinionCaseTemplateCommitList={opinionCaseTemplateCommitList}
          onCommitListRefetch={onCommitListRefetch}
        />
      </form>
    </>
  )
}

export default ReceiptTemplateOpinionForm
