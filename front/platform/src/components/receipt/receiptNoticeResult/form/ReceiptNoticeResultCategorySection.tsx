import InputMultiFileUploadBox from '@components/common/input/uploadBox/InputMultiFileUploadBox'
import CategorySection from '@components/common/ui/category/CategorySection'
import type { ReceiptNoticeFormParam } from '@components/receipt/receiptNoticeResult/hook/useReceiptNoticeResultForm'
import React from 'react'
import { type Control, type FieldErrors, useFieldArray } from 'react-hook-form'

import type { NoticeResultAttachmentCategory } from '@/constants/receipt/noteResultAttachment'

interface ReceiptNoticeResultCategorySectionProps {
  control: Control<ReceiptNoticeFormParam>
  errors?: FieldErrors<ReceiptNoticeFormParam>
  category: NoticeResultAttachmentCategory
  index: number
}

const ReceiptNoticeResultCategorySection: React.FC<ReceiptNoticeResultCategorySectionProps> = ({
  control,
  errors,
  category,
  index,
}) => {
  const hasRequiredFiles = !errors?.noticeAttachmentFileList?.[index]?.documents

  const { fields } = useFieldArray({
    control,
    name: `noticeAttachmentFileList.${index}.documents`,
  })

  return (
    <CategorySection name={category.name} required={category.required && !hasRequiredFiles}>
      {fields?.map((document, documentIndex) => (
        <div className="p-4 space-y-4 bg-white" key={document.typeCode}>
          <InputMultiFileUploadBox
            id={`noticeAttachmentFileList.${index}.documents.${documentIndex}.attachments`}
            name={document.name}
            control={control}
            rules={{
              required: document.required ? `${document.name}은 필수입니다.` : false,
            }}
          />
        </div>
      ))}
    </CategorySection>
  )
}

export default ReceiptNoticeResultCategorySection
