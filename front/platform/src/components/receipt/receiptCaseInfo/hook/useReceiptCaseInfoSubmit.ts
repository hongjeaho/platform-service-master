import type { SubmitHandler } from 'react-hook-form'

import { useInsertOrUpdateReceiptCaseInfo } from '@/api/receipt-base-api/receipt-base-api'
import type { ReceiptCaseInfo } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface ReceiptCaseInfoSubmitProps {
  judgSeq: number
  handleNextStep: () => void
}

const useReceiptCaseInfoSubmit = ({ judgSeq, handleNextStep }: ReceiptCaseInfoSubmitProps) => {
  const showAlertMessage = useShowAlertMessage()

  const { mutate } = useInsertOrUpdateReceiptCaseInfo({
    mutation: {
      onSuccess: () => {
        handleNextStep()
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  const onSubmit: SubmitHandler<ReceiptCaseInfo> = async data => {
    const { businessRecognitionList, agreementDateList } = data

    if (!businessRecognitionList || businessRecognitionList.length === 0) {
      showAlertMessage('사업자 인증 관계를 하나 이상 등록해 주세요.')
      return
    }

    if (!agreementDateList || agreementDateList.length === 0) {
      showAlertMessage('협의날짜를 하나 이상 등록해 주세요.')
      return
    }

    mutate({ judgSeq, data })
  }

  return { onSubmit }
}
export default useReceiptCaseInfoSubmit
