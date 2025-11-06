import { useMemo } from 'react'

import { attachmentCategories } from '@/constants/receipt/attachmentUploadCategory'
import type { ReceiptAttachmentUploadFile } from '@/model'

const useReceiptAttachmentCategoryMemo = (
  judgSeq: number,
  defaultData?: ReceiptAttachmentUploadFile[],
) => {
  return useMemo(() => {
    return (defaultData?.length ?? 0) === 0
      ? attachmentCategories
      : attachmentCategories.map(category => {
          const mergedDocuments = category.documents.map(doc => {
            const current = defaultData
              ?.filter(file => file.attachmentTypeCode === doc.typeCode)
              .map(file => file.attachment)
              .filter(file => !!file)

            if (!current || current.length === 0) {
              return { ...doc }
            }

            return { ...doc, attachments: current }
          })

          // 다중 문서일 경우 map 후 2차원 배열이 되므로 평탄화(flatten)
          return {
            ...category,
            documents: mergedDocuments.flat(),
          }
        })
  }, [judgSeq, defaultData])
}

export default useReceiptAttachmentCategoryMemo
