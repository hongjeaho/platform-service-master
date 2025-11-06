import ReceiptAttachmentCategorySection from '@components/receipt/receiptAttachment/form/ReceiptAttachmentCategorySection'
import useReceiptAttachmentUploadForm from '@components/receipt/receiptAttachment/hook/useReceiptAttachmentUploadForm'
import useReceiptAttachmentUploadSubmit from '@components/receipt/receiptAttachment/hook/useReceiptAttachmentUploadSubmit'
import { AlertCircle } from 'lucide-react'
import React from 'react'

import { attachmentCategories } from '@/constants/receipt/attachmentUploadCategory'

interface ReceiptAttachmentUploadFormContentProps {
  defaultData?: any
  judgSeq: number
  formId: string
  handleNextStep: () => void
}

const ReceiptAttachmentUploadFormContent: React.FC<ReceiptAttachmentUploadFormContentProps> = ({
  formId,
  handleNextStep,
  defaultData,
  judgSeq,
}) => {
  // 폼 초기화 및 유효성 검사를 위한 훅
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useReceiptAttachmentUploadForm(judgSeq, defaultData)

  // 폼 제출 처리를 위한 훅
  const { onSubmit } = useReceiptAttachmentUploadSubmit({ judgSeq, handleNextStep })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
      <div className="max-w-5xl mx-auto p-1">
        <div className=" flex items-center justify-end">
          <p className=" text-sm text-gray-600">재결신청에 필요한 서류를 등록합니다.</p>
        </div>
      </div>

      {!!errors?.receiptAttachmentRequestList && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">필수 서류가 누락되었습니다.</p>
              <p className="text-sm text-red-600 mt-1">
                빨간색으로 표시된 카테고리의 필수 서류를 업로드해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {attachmentCategories.map((category, index) => (
          <ReceiptAttachmentCategorySection
            key={index}
            index={index}
            control={control}
            errors={errors}
            category={category}
          />
        ))}
      </div>
    </form>
  )
}
export default ReceiptAttachmentUploadFormContent
