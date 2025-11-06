import type { SubmitHandler } from 'react-hook-form'

import { useInsertOrUpdateConclusionContent } from '@/api/conclusion-base-api/conclusion-base-api'
import type { ConclusionContent } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface ConclusionProgressSubmitProps {
  judgSeq: number
  opinionTemplateSeq: number
}

const UseConclusionProgressSubmit = ({
  judgSeq,
  opinionTemplateSeq,
}: ConclusionProgressSubmitProps) => {
  const showAlertMessage = useShowAlertMessage()

  /**
   * 결론 내용을 저장하거나 업데이트하는 API 호출 함수
   *
   * @description 성공 시 저장 완료 메시지를 표시하고,
   * 실패 시 에러 메시지를 표시합니다.
   */
  const { mutate, isPending } = useInsertOrUpdateConclusionContent({
    mutation: {
      onSuccess: () => {
        showAlertMessage('저장 되었습니다.')
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  /**
   * 폼 제출 핸들러 함수
   *
   * @description 폼 데이터를 받아 결론 내용을 저장하거나 업데이트합니다.
   * 예외 발생 시 사용자에게 오류 메시지를 표시합니다.
   *
   */
  const onSubmit: SubmitHandler<ConclusionContent> = (conclusionContent, event) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }

    const { attachment, ...rest } = conclusionContent

    try {
      mutate({
        judgSeq,
        opinionTemplateSeq,
        data: { conclusionContent: rest, file: attachment?.file },
      })
    } catch {
      showAlertMessage('예기치 않은 오류가 발생했습니다.')
    }
  }

  return { onSubmit, isPending }
}
export default UseConclusionProgressSubmit
