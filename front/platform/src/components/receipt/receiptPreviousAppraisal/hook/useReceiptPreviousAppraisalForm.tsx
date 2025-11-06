import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { previousAppraisalRecommendList } from '@/constants/receipt/previousAppraisalRecommendList.ts'
import previousAppraisalUploadCategories, {
  type ReceiptPreviousAppraisalCategory,
} from '@/constants/receipt/previousAppraisalUploadCategories.ts'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import type {
  ReceiptAppraisalResponse,
  ReceiptPreviousAppraisalEntity,
  ReceiptPreviousAppraisalRecommend,
} from '@/model'

export interface BeforeAppraisalFormRequest {
  /** 협의 감정평가 정보 */
  receiptPreviousAppraisal: ReceiptPreviousAppraisalEntity
  /** 협의 감정평가 추천 정보 */
  receiptPreviousAppraisalRecommendList: ReceiptPreviousAppraisalRecommend[]
  /** 협의 공고 파일 정보 */
  receiptPreviousAppraisalAttachmentUploadFileList: ReceiptPreviousAppraisalCategory[]
}

const useReceiptPreviousAppraisalForm = ({
  receiptPreviousAppraisal,
  receiptPreviousAppraisalRecommendList,
  receiptPreviousAppraisalAttachmentUploadFileList,
}: ReceiptAppraisalResponse) => {
  const judgSeq = useGetJudgSeq()

  // 저장된 추천 정보를 설정한다.
  const initReceiptPreviousAppraisalRecommendList = useMemo(() => {
    return receiptPreviousAppraisalRecommendList?.length === 0
      ? previousAppraisalRecommendList
      : previousAppraisalRecommendList.map(it => {
          const current = receiptPreviousAppraisalRecommendList?.find(
            att => att.recommendTypeCode === it.recommendTypeCode,
          )
          return {
            ...it,
            ...current,
          }
        })
  }, [judgSeq])

  const initReceiptPreviousAppraisalAttachmentUploadFileList: ReceiptPreviousAppraisalCategory[] =
    useMemo(() => {
      return (receiptPreviousAppraisalAttachmentUploadFileList?.length ?? 0) === 0
        ? previousAppraisalUploadCategories
        : previousAppraisalUploadCategories.map(category => {
            const mergedDocuments = category.documents.map(doc => {
              const current = receiptPreviousAppraisalAttachmentUploadFileList?.find(
                file => file.previousAppraisalTypeCode === doc.previousAppraisalTypeCode,
              )

              if (!current) {
                return { ...doc }
              }

              return { ...doc, attachment: current.attachment }
            })

            // 다중 문서일 경우 map 후 2차원 배열이 되므로 평탄화(flatten)
            return {
              ...category,
              documents: mergedDocuments.flat(),
            }
          })
    }, [judgSeq])

  // 협의 정보의 기본 값을 설정 한다.
  return useForm<BeforeAppraisalFormRequest>({
    defaultValues: {
      receiptPreviousAppraisal: receiptPreviousAppraisal,
      receiptPreviousAppraisalRecommendList: initReceiptPreviousAppraisalRecommendList,
      receiptPreviousAppraisalAttachmentUploadFileList:
        initReceiptPreviousAppraisalAttachmentUploadFileList,
    },
  })
}

export default useReceiptPreviousAppraisalForm
