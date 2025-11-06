import { useForm } from 'react-hook-form'

import type { ReceiptCaseInfo } from '@/model'

const useReceiptCaseInfoForm = (implementerCaseInfo?: ReceiptCaseInfo) => {
  return useForm<ReceiptCaseInfo>({
    defaultValues: {
      businessInfo: implementerCaseInfo?.businessInfo,
      businessRecognitionList: implementerCaseInfo?.businessRecognitionList?.length
        ? implementerCaseInfo?.businessRecognitionList
        : [{}],
      agreementDateList: implementerCaseInfo?.agreementDateList?.length
        ? implementerCaseInfo?.agreementDateList
        : [{}],
    },
  })
}

export default useReceiptCaseInfoForm
