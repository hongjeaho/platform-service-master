import { type SubmitHandler } from 'react-hook-form'

import { useInsertOrUpdateReceiptQuantityReport } from '@/api/receipt-base-api/receipt-base-api'
import { type ReceiptQuantityReportEntity } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface TotalQuantityReportSubmitProps {
  judgSeq: number
  sumCalculate: Record<string, number>
  handleNextStep: () => void
}

const useReceiptTotalQuantityReportSubmit = ({
  judgSeq,
  sumCalculate,
  handleNextStep,
}: TotalQuantityReportSubmitProps) => {
  const showAlertMessage = useShowAlertMessage()

  const { mutate } = useInsertOrUpdateReceiptQuantityReport({
    mutation: {
      onSuccess: () => {
        handleNextStep()
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  const onSubmit: SubmitHandler<ReceiptQuantityReportEntity> = async data => {
    const inputData = Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, value === undefined ? 0 : value])
        .map(([key, value]) => [key, value === '' ? 0 : value]),
    )

    mutate({
      judgSeq,
      data: {
        ...inputData,
        ...sumCalculate,
      },
    })
  }

  return { onSubmit }
}

export default useReceiptTotalQuantityReportSubmit
