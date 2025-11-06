import InputMultiFileUploadBox from '@components/common/input/uploadBox/InputMultiFileUploadBox'
import InputSingleFileUploadBox from '@components/common/input/uploadBox/InputSingleFileUploadBox'
import CategorySection from '@components/common/ui/category/CategorySection'
import type { ReceiptAttachmentUploadFormProps } from '@components/receipt/receiptAttachment/hook/useReceiptAttachmentUploadForm'
import React from 'react'
import { type Control, type FieldErrors, useFieldArray } from 'react-hook-form'

import type { ReceiptAttachmentCategory } from '@/constants/receipt/attachmentUploadCategory'

interface ReceiptAttachmentCategorySectionProps {
  index: number
  category: ReceiptAttachmentCategory
  control: Control<ReceiptAttachmentUploadFormProps>
  errors?: FieldErrors<ReceiptAttachmentUploadFormProps>
}

const ReceiptAttachmentCategorySection: React.FC<ReceiptAttachmentCategorySectionProps> = ({
  index,
  category,
  control,
  errors,
}) => {
  const hasRequiredFiles = !errors?.receiptAttachmentRequestList?.[index]?.documents
  const { fields } = useFieldArray({
    control,
    name: `receiptAttachmentRequestList.${index}.documents`,
  })

  return (
    <CategorySection name={category.name} required={category.required && !hasRequiredFiles}>
      {fields?.map((document, documentIndex) => (
        <div className="p-4 space-y-4 bg-white" key={document.typeCode}>
          {document.multiple ? (
            <InputMultiFileUploadBox
              id={`receiptAttachmentRequestList.${index}.documents.${documentIndex}.attachments`}
              name={document.name}
              control={control}
              rules={{
                required: document.required ? `${document.name}은 필수입니다.` : false,
              }}
            />
          ) : (
            <InputSingleFileUploadBox
              id={`receiptAttachmentRequestList.${index}.documents.${documentIndex}.attachments`}
              name={document.name}
              control={control}
              rules={{
                required: document.required ? `${document.name}은 필수입니다.` : false,
              }}
            />
          )}
        </div>
      ))}
    </CategorySection>
  )
}
export default ReceiptAttachmentCategorySection
