import ReceiptNoticeResultCategorySection from '@components/receipt/receiptNoticeResult/form/ReceiptNoticeResultCategorySection'
import ReceiptNoticeResultRegistrationSection from '@components/receipt/receiptNoticeResult/form/ReceiptNoticeResultRegistrationSection'
import useReceiptNoticeResultForm from '@components/receipt/receiptNoticeResult/hook/useReceiptNoticeResultForm'
import useReceiptNoticeResultSubmit from '@components/receipt/receiptNoticeResult/hook/useReceiptNoticeResultSubmit'
import React from 'react'

import { noticeResultAttachmentsCategories } from '@/constants/receipt/noteResultAttachment'
import type { NoticeResultResponse } from '@/model'

interface ReceiptNoticeResultContentProps {
  formId: string
  noticeResponse: NoticeResultResponse
  judgSeq: number
  handleNextStep: () => void
}

const ReceiptNoticeResultFormContent: React.FC<ReceiptNoticeResultContentProps> = ({
  formId,
  handleNextStep,
  judgSeq,
  noticeResponse,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useReceiptNoticeResultForm(judgSeq, noticeResponse)

  const { onSubmit } = useReceiptNoticeResultSubmit({ judgSeq, handleNextStep })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
      <ReceiptNoticeResultRegistrationSection control={control} errors={errors} />
      <div className="mt-8">
        {noticeResultAttachmentsCategories.map((category, index) => (
          <ReceiptNoticeResultCategorySection
            key={index}
            control={control}
            errors={errors}
            category={category}
            index={index}
          />
        ))}
      </div>
    </form>
  )
}
export default ReceiptNoticeResultFormContent
