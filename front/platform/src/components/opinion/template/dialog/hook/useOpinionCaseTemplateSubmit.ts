import type { SubmitHandler } from 'react-hook-form'

import { useInsertOpinionCaseTemplate } from '@/api/opinion-base-api/opinion-base-api'
import type { InsertOpinionCaseTemplateBody } from '@/model'
import { useShowAlertMessageCallBack } from '@/store/message'

interface OpinionCaseTemplateSubmitProps {
  judgSeq: number
  opinionTemplateSeq: number
  onClose: () => void
}

const useOpinionCaseTemplateSubmit = ({
  judgSeq,
  opinionTemplateSeq,
  onClose,
}: OpinionCaseTemplateSubmitProps) => {
  const showAlertMessageCallBack = useShowAlertMessageCallBack()

  // 사업 시향자 의견을 저장하는 HOOK
  const { mutate, isPending } = useInsertOpinionCaseTemplate({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('저장 되었습니다.', onClose)
      },
      onError: error => {
        showAlertMessageCallBack(error.message, () => {})
      },
    },
  })

  // 사업 시행자 의견 Submit
  const onSubmit: SubmitHandler<InsertOpinionCaseTemplateBody> = async data => {
    const { opinionCaseTemplate, opinionCaseCommentList } = data

    // 순번 재 정렬
    const list = opinionCaseCommentList?.map((comment, index) => ({
      ...comment,
      opinionCaseCommentOrder: index + 1,
    }))

    const { attachment, ...templateRest } = opinionCaseTemplate ?? {}
    const { file, ...attachmentRest } = attachment ?? {}

    // 템플릿 정보 저장
    const template = {
      ...templateRest,
      attachment: attachmentRest,
      opinionTemplateSeq,
      judgSeq,
    }

    // 저장한다.
    mutate({
      data: {
        opinionCaseCommentList: list,
        opinionCaseTemplate: template,
        file,
      },
    })
  }

  return { onSubmit, isPending }
}

export default useOpinionCaseTemplateSubmit
