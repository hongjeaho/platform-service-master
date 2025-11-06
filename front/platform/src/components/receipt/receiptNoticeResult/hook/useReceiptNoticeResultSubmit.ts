import type { ReceiptNoticeFormParam } from '@components/receipt/receiptNoticeResult/hook/useReceiptNoticeResultForm'
import { type SubmitHandler } from 'react-hook-form'

import { useInsertOrUpdateNoticeResult } from '@/api/notice-result-api/notice-result-api'
import type { NoticeAttachmentFile } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface ReceiptNoticeSubmitProps {
  judgSeq: number
  handleNextStep: () => void
}

const useReceiptNoticeResultSubmit = ({ judgSeq, handleNextStep }: ReceiptNoticeSubmitProps) => {
  const showAlertMessage = useShowAlertMessage()
  /**
   * 열람 공고 결과 저장 API를 호출하는 훅
   * 성공 시 다음 단계로 이동하고, 실패 시 에러 메시지를 표시합니다.
   */
  const { mutate } = useInsertOrUpdateNoticeResult({
    mutation: {
      onSuccess: () => {
        handleNextStep()
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  /**
   * 폼 제출 핸들러
   * 폼 데이터를 가공하여 API 호출에 필요한 형태로 변환합니다.
   *
   * @param data - 열람공고 결과 등록 폼 데이터
   */
  const onSubmit: SubmitHandler<ReceiptNoticeFormParam> = async data => {
    const { noticeInfo, noticeAttachmentFileList } = data
    const documentsList = noticeAttachmentFileList.flatMap(it => it.documents)

    const noticeUploadFileList: NoticeAttachmentFile[] = []
    const noticeFiles: Blob[] = []

    documentsList.forEach(doc => {
      const { typeCode, attachments } = doc
      // 기본 메타데이터 객체
      const baseMetadata = {
        noticeAttachmentTypeCode: typeCode,
      }

      // 멀티 파일 처리
      if (Array.isArray(attachments)) {
        attachments.forEach((fileObj, fileIndex) => {
          const { fileSeq } = fileObj
          noticeUploadFileList.push({
            ...baseMetadata,
            noticeAttachmentFileSeq: fileSeq,
            noticeAttachmentOrder: fileIndex,
          })

          noticeFiles.push(fileObj.file ?? new Blob())
        })
      } else if (attachments) {
        const { fileSeq } = attachments

        noticeUploadFileList.push({
          ...baseMetadata,
          noticeAttachmentFileSeq: fileSeq,
          noticeAttachmentOrder: 0,
        })

        noticeFiles.push(attachments?.file ?? new Blob())
      }
    })

    mutate({
      judgSeq,
      data: {
        noticeInfo,
        noticeAttachmentFileList: noticeUploadFileList,
        files: noticeFiles,
      },
    })
  }

  return { onSubmit }
}

export default useReceiptNoticeResultSubmit
