import { useDeleteOpinionCaseTemplate } from '@/api/opinion-base-api/opinion-base-api'
import {
  useShowAlertMessage,
  useShowAlertMessageCallBack,
  useShowConfirmMessage,
} from '@/store/message'

interface OpinionTemplateTabRemoveProps {
  judgSeq: number
  onCommitListRefetch: () => void
}
const useOpinionTemplateTabRemove = ({
  judgSeq,
  onCommitListRefetch,
}: OpinionTemplateTabRemoveProps) => {
  const showConfirmMessage = useShowConfirmMessage()
  const showAlertMessage = useShowAlertMessage()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()

  const { mutate } = useDeleteOpinionCaseTemplate({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('쟁점 의견을 삭제 하였습니다.', onCommitListRefetch)
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  const onOpinionTabRemoveButton = (opinionCaseTemplateSeq: number) => {
    showConfirmMessage('쟁점을 삭제 하시겠습니다?', () => {
      mutate({ judgSeq, opinionCaseTemplateSeq })
    })
  }

  return {
    onOpinionTabRemoveButton,
  }
}
export default useOpinionTemplateTabRemove
