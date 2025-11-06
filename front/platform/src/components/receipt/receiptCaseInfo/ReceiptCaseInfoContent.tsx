import ReceiptAgreementDateForm from '@components/receipt/receiptCaseInfo/form/ReceiptAgreementDateForm'
import ReceiptBusinessInfoForm from '@components/receipt/receiptCaseInfo/form/ReceiptBusinessInfoForm'
import ReceiptBusinessRecognitionForm from '@components/receipt/receiptCaseInfo/form/ReceiptBusinessRecognitionForm'
import useReceiptCaseInfoForm from '@components/receipt/receiptCaseInfo/hook/useReceiptCaseInfoForm'
import useReceiptCaseInfoSubmit from '@components/receipt/receiptCaseInfo/hook/useReceiptCaseInfoSubmit'
import React from 'react'
import { FormProvider } from 'react-hook-form'

import type { ReceiptCaseInfo } from '@/model'

interface ReceiptCaseInfoContentProps {
  judgSeq: number
  formId: string
  implementerCaseInfo?: ReceiptCaseInfo
  handleNextStep: () => void
}

const ReceiptCaseInfoContent: React.FC<ReceiptCaseInfoContentProps> = ({
  judgSeq,
  formId,
  implementerCaseInfo,
  handleNextStep,
}) => {
  const methods = useReceiptCaseInfoForm(implementerCaseInfo)
  const { onSubmit } = useReceiptCaseInfoSubmit({ judgSeq, handleNextStep })
  return (
    <form id={formId} onSubmit={methods.handleSubmit(onSubmit)} noValidate autoComplete="off">
      <FormProvider {...methods}>
        <ReceiptBusinessInfoForm />
        <ReceiptAgreementDateForm />
        <ReceiptBusinessRecognitionForm />
      </FormProvider>
    </form>
  )
}

export default ReceiptCaseInfoContent
