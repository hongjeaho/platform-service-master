import type { SubmitHandler } from 'react-hook-form'

import {
  type InsertOrUpdateDeliberationScheduleMutationBody,
  useInsertOrUpdateDeliberationSchedule,
} from '@/api/deliberation-schedule-api/deliberation-schedule-api'
import { useShowAlertMessage, useShowAlertMessageCallBack } from '@/store/message'

const useAgendaCreationDialogSubmit = (ides: number[], onClose: () => void) => {
  const showAlertMessage = useShowAlertMessage()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const { mutate } = useInsertOrUpdateDeliberationSchedule({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('안건이 등록 되었습니다.', onClose)
      },
      onError: () => {
        showAlertMessage('안건 등록중 에러가 발생 하였습니다.')
      },
    },
  })

  const submit: SubmitHandler<InsertOrUpdateDeliberationScheduleMutationBody> = data => {
    if (ides.length < 0) {
      showAlertMessage('하나 이상의 안건을 선택해 주세요')
      return
    }

    mutate({
      data: {
        deliberationDateSeq: data.deliberationDateSeq,
        deliberationGroupSeq: data.deliberationGroupSeq,
        judgSeqList: ides,
      },
    })
  }

  return {
    submit,
  }
}
export default useAgendaCreationDialogSubmit
