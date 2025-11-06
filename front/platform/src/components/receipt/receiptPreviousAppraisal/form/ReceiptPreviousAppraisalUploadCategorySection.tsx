import InputSingleFileUploadBox from '@components/common/input/uploadBox/InputSingleFileUploadBox'
import CategorySection from '@components/common/ui/category/CategorySection'
import type { BeforeAppraisalFormRequest } from '@components/receipt/receiptPreviousAppraisal/hook/useReceiptPreviousAppraisalForm'
import React from 'react'
import { type Control, type FieldErrors, useFieldArray } from 'react-hook-form'

import type { ReceiptPreviousAppraisalCategory } from '@/constants/receipt/previousAppraisalUploadCategories'

interface ReceiptPreviousAppraisalUploadCategorySectionProps {
  category: ReceiptPreviousAppraisalCategory
  control: Control<BeforeAppraisalFormRequest>
  recommendation: boolean
  errors: FieldErrors<BeforeAppraisalFormRequest>
  index: number
}

const ReceiptPreviousAppraisalUploadCategorySection: React.FC<
  ReceiptPreviousAppraisalUploadCategorySectionProps
> = ({ category, control, errors, recommendation, index }) => {
  const hasRequiredFiles =
    !!errors?.receiptPreviousAppraisalAttachmentUploadFileList?.[index]?.documents

  const { fields } = useFieldArray({
    control,
    name: `receiptPreviousAppraisalAttachmentUploadFileList.${index}.documents`,
  })

  return (
    <CategorySection name={category.name} required={category.required && hasRequiredFiles}>
      {fields?.map((document, documentIndex) => {
        if (!recommendation && document.previousAppraisalTypeCode !== 'CR004001') {
          return null
        }

        return (
          <InputSingleFileUploadBox
            key={document.previousAppraisalTypeCode}
            id={`receiptPreviousAppraisalAttachmentUploadFileList.${index}.documents.${documentIndex}.attachment`}
            name={document.name}
            control={control}
            rules={{
              required: `${document.name}은 필수입니다.`,
            }}
          />
        )
      })}
    </CategorySection>
  )
}
export default ReceiptPreviousAppraisalUploadCategorySection
