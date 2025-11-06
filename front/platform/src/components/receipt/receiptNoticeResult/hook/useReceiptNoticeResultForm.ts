import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  type NoticeResultAttachmentCategory,
  noticeResultAttachmentsCategories,
} from '@/constants/receipt/noteResultAttachment'
import type { NoticeInfoEntity, NoticeResultResponse } from '@/model'

export interface ReceiptNoticeFormParam {
  noticeInfo: NoticeInfoEntity
  noticeAttachmentFileList: NoticeResultAttachmentCategory[]
}

const useReceiptNoticeResultForm = (judgSeq: number, noticeResponse: NoticeResultResponse) => {
  const { noticeDetail, noticeAttachmentFileList } = noticeResponse

  /**
   * 초기 첨부 파일 값을 설정합니다.
   * 기존 파일이 없으면 기본 첨부 파일 목록을 사용하고,
   * 있으면 기존 파일 정보와 기본 첨부 파일 정보를 병합합니다.
   */
  const initValues = useMemo(() => {
    return noticeAttachmentFileList?.length === 0
      ? noticeResultAttachmentsCategories
      : noticeResultAttachmentsCategories.map(category => {
          const mergedDocuments = category.documents.map(doc => {
            const attachments = noticeAttachmentFileList
              ?.filter(file => file.noticeAttachmentTypeCode === doc.typeCode)
              .map(file => file?.attachment)

            if (!attachments) {
              return { ...doc }
            }

            return { ...doc, attachments: attachments }
          })

          // 다중 문서일 경우 map 후 2차원 배열이 되므로 평탄화(flatten)
          return {
            ...category,
            documents: mergedDocuments.flat(),
          }
        })
  }, [judgSeq])

  return useForm<ReceiptNoticeFormParam>({
    defaultValues: { noticeInfo: noticeDetail, noticeAttachmentFileList: initValues },
  })
}

export default useReceiptNoticeResultForm
