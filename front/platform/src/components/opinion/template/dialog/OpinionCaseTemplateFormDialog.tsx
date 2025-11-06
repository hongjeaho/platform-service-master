import FullScreenDialog from '@components/common/ui/dialog/FullScreenDialog'
import useShowOpinionCaseTemplate from '@components/opinion/template/dialog/hook/useShowOpinionCaseTemplate'
import OpinionCaseTemplateForm from '@components/opinion/template/dialog/OpinionCaseTemplateForm'
import React from 'react'

interface OpinionCaseTemplateFormDialogProps {
  judgSeq: number
  onClose: () => void
}

const OpinionCaseTemplateFormDialog: React.FC<OpinionCaseTemplateFormDialogProps> = ({
  judgSeq,
  onClose,
}) => {
  const formId = 'opinionCaseTemplateForm'

  const { isOpen, opinionCaseTemplate, opinionCaseCommentList } = useShowOpinionCaseTemplate()

  return (
    <FullScreenDialog
      formId={formId}
      isOpen={isOpen}
      title={`쟁점명 : ${opinionCaseTemplate?.templateName}`}
      onClose={onClose}
    >
      <OpinionCaseTemplateForm
        formId={formId}
        judgSeq={judgSeq}
        opinionCaseTemplate={opinionCaseTemplate}
        opinionCaseCommentList={opinionCaseCommentList}
        onClose={onClose}
      />
    </FullScreenDialog>
  )
}

export default OpinionCaseTemplateFormDialog
