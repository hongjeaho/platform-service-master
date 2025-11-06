import { useForm } from 'react-hook-form'

import type {
  InsertOpinionCaseTemplateBody,
  OpinionCaseCommentEntity,
  OpinionCaseTemplate,
} from '@/model'

interface OpinionCaseTemplateFormProps {
  opinionCaseTemplate?: OpinionCaseTemplate
  opinionCaseCommentList?: OpinionCaseCommentEntity[]
}

const useOpinionCaseTemplateForm = ({
  opinionCaseTemplate,
  opinionCaseCommentList,
}: OpinionCaseTemplateFormProps) => {
  return useForm<InsertOpinionCaseTemplateBody>({
    defaultValues: {
      opinionCaseTemplate: opinionCaseTemplate ?? {},
      opinionCaseCommentList: opinionCaseCommentList ?? [
        {
          judgTarget: '',
          implementerComment: '',
          ownerComment: '',
          opinionCaseCommentOrder: 1,
        },
      ],
    },
  })
}

export default useOpinionCaseTemplateForm
