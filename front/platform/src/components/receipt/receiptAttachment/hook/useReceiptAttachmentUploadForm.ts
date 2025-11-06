import useReceiptAttachmentCategoryMemo from '@components/receipt/receiptAttachment/hook/useReceiptAttachmentCategoryMemo'
import { useForm } from 'react-hook-form'

import { type ReceiptAttachmentCategory } from '@/constants/receipt/attachmentUploadCategory'
import type { ReceiptAttachmentUploadFile } from '@/model'

/**
 * 첨부 파일 업로드 폼 파라미터 인터페이스
 * 첨부 파일 목록을 포함합니다.
 */
export interface ReceiptAttachmentUploadFormProps {
  receiptAttachmentRequestList: ReceiptAttachmentCategory[]
}

const useReceiptAttachmentUploadForm = (
  judgSeq: number,
  defaultData?: ReceiptAttachmentUploadFile[],
) => {
  const initValues: ReceiptAttachmentCategory[] = useReceiptAttachmentCategoryMemo(
    judgSeq,
    defaultData,
  )

  return useForm<ReceiptAttachmentUploadFormProps>({
    defaultValues: {
      receiptAttachmentRequestList: initValues,
    },
  })
}

export default useReceiptAttachmentUploadForm
