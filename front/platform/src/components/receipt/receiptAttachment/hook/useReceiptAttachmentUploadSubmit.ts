import type { ReceiptAttachmentUploadFormProps } from '@components/receipt/receiptAttachment/hook/useReceiptAttachmentUploadForm'
import { type SubmitHandler } from 'react-hook-form'

import { useInsertOrUpdateReceiptAttachment } from '@/api/receipt-base-api/receipt-base-api'
import type { ReceiptAttachmentUploadFile } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface ReceiptAttachmentUploadSubmitProps {
  handleNextStep: () => void
  judgSeq: number
}

const useReceiptAttachmentUploadSubmit = ({
  judgSeq,
  handleNextStep,
}: ReceiptAttachmentUploadSubmitProps) => {
  const showAlertMessage = useShowAlertMessage()

  const { mutate } = useInsertOrUpdateReceiptAttachment({
    mutation: {
      onSuccess: () => {
        handleNextStep()
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  const onSubmit: SubmitHandler<ReceiptAttachmentUploadFormProps> = async data => {
    const documentsList = data.receiptAttachmentRequestList.flatMap(it => it.documents)
    const receiptAttachmentUploadFileList: ReceiptAttachmentUploadFile[] = []
    const receiptFiles: Blob[] = []

    documentsList.forEach(doc => {
      const { typeCode, attachments } = doc
      // 기본 메타데이터 객체
      const baseMetadata = {
        attachmentTypeCode: typeCode,
      }

      // 멀티 파일 처리
      if (Array.isArray(attachments)) {
        attachments.forEach((fileObj, fileIndex) => {
          const { fileSeq } = fileObj
          receiptAttachmentUploadFileList.push({
            ...baseMetadata,
            attachmentFileSeq: fileSeq,
            attachmentOrder: fileIndex,
          })

          receiptFiles.push(fileObj.file ?? new Blob())
        })
      } else if (attachments) {
        const { fileSeq } = attachments

        receiptAttachmentUploadFileList.push({
          ...baseMetadata,
          attachmentFileSeq: fileSeq,
          attachmentOrder: 0,
        })

        receiptFiles.push(attachments?.file ?? new Blob())
      }
    })

    mutate({
      judgSeq,
      data: {
        receiptAttachmentUploadFileList,
        files: receiptFiles,
      },
    })
  }

  return { onSubmit }
}

export default useReceiptAttachmentUploadSubmit
