import type { BeforeAppraisalFormRequest } from '@components/receipt/receiptPreviousAppraisal/hook/useReceiptPreviousAppraisalForm'
import { type SubmitHandler } from 'react-hook-form'

import { useInsertOrUpdateReceiptAppraisal } from '@/api/receipt-base-api/receipt-base-api'
import type {
  ReceiptPreviousAppraisalAttachmentUploadFile,
  ReceiptPreviousAppraisalRecommend,
} from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface BeforeAppraisalSubmitProps {
  judgSeq: number
  handleNextStep: () => void
}

/**
 * useReceiptPreviousAppraisalSubmit
 *
 * 이 React 컴포넌트는 협의 감정평가를 제출하기 위한 비동기 처리 로직과
 * 폼 제출 핸들러를 정의합니다.
 *
 */
const useReceiptPreviousAppraisalSubmit = ({
  judgSeq,
  handleNextStep,
}: BeforeAppraisalSubmitProps) => {
  const showAlertMessage = useShowAlertMessage()

  /** 협의 감정평가 정보 저장 API 뮤테이션 */
  const { mutate } = useInsertOrUpdateReceiptAppraisal({
    mutation: {
      onSuccess: () => {
        handleNextStep()
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  /** 폼 제출 핸들러 */
  const onSubmit: SubmitHandler<BeforeAppraisalFormRequest> = async data => {
    // 추천 감정평가 정보 필터링
    data.receiptPreviousAppraisalRecommendList = data.receiptPreviousAppraisalRecommendList.filter(
      it => !!it.recommendCorporationName,
    )

    // 파일 정보에서 파일 객체를 제외한 정보를 추출한다.
    const {
      receiptPreviousAppraisal,
      receiptPreviousAppraisalRecommendList,
      receiptPreviousAppraisalAttachmentUploadFileList,
    } = data
    const recommendFileList: ReceiptPreviousAppraisalRecommend[] = []
    const recommendFiles: Blob[] = []
    receiptPreviousAppraisalRecommendList.forEach(recommend => {
      const { attachment, ...rest } = recommend

      recommendFileList.push({
        ...rest,
      })

      recommendFiles.push(attachment?.file ?? new Blob())
    })

    const previousAppraisalFileList: ReceiptPreviousAppraisalAttachmentUploadFile[] = []
    const previousAppraisalFiles: Blob[] = []
    receiptPreviousAppraisalAttachmentUploadFileList
      .flatMap(it => it.documents)
      .forEach(documents => {
        const { previousAppraisalTypeCode, attachment } = documents
        const isGovernorRecommendation = receiptPreviousAppraisal.governorRecommendation // 시도지사 추천 여부

        // 시도지사를 추천 하지 않는경우 CR004001 파일만 첨부
        const shouldAddFile = isGovernorRecommendation || previousAppraisalTypeCode === 'CR004001'

        if (!shouldAddFile) {
          return
        }

        // 기본 메타데이터 객체
        const baseMetadata = {
          previousAppraisalTypeCode,
        }

        if (attachment) {
          previousAppraisalFileList.push({
            ...baseMetadata,
            previousAppraisalFileSeq: attachment?.fileSeq,
          })
          previousAppraisalFiles.push(attachment?.file ?? new Blob())
        }
      })

    // 추천 정보 검증
    if (
      receiptPreviousAppraisalRecommendList.filter(it => !!it.recommendCorporationName).length < 2
    ) {
      showAlertMessage('최소 2군대 이상은 추천 등록을 해야 합니다.')
      return
    }

    // 사업 시행자 추가 여부
    receiptPreviousAppraisal.optionalImplementerRecommendation =
      receiptPreviousAppraisalRecommendList.some(
        recommend => recommend.recommendTypeCode === 'CR003004',
      )
    // 토지 소유자 추가 여부
    receiptPreviousAppraisal.optionalLandOwnerRecommendation =
      receiptPreviousAppraisalRecommendList.some(
        recommend => recommend.recommendTypeCode === 'CR003003',
      )

    // API 호출
    mutate({
      judgSeq,
      data: {
        receiptPreviousAppraisal,
        receiptPreviousAppraisalAttachmentUploadFileList: previousAppraisalFileList,
        receiptPreviousAppraisalAttachmentUploadFiles: previousAppraisalFiles,
        receiptPreviousAppraisalRecommendList: recommendFileList,
        receiptPreviousAppraisalRecommendFiles: recommendFiles,
      },
    })
  }

  return { onSubmit }
}

export default useReceiptPreviousAppraisalSubmit
