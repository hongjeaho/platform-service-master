import { type FormEvent, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSendReceiptComplete } from '@/api/receipt-base-api/receipt-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import {
  useShowAlertMessage,
  useShowAlertMessageCallBack,
  useShowConfirmMessage,
} from '@/store/message'

const UseReceiptTemplateOpinionSubmit = () => {
  /**
   * 현재 사건의 고유 식별자를 가져옵니다.
   */
  const judgSeq = useGetJudgSeq()

  /**
   * 메시지 관련 훅
   * - confirmMessage: 확인 메시지 표시
   * - alertMessage: 알림 메시지 표시
   * - alertMessageCallBack: 콜백 함수가 있는 알림 메시지 표시
   */
  const confirmMessage = useShowConfirmMessage()
  const alertMessage = useShowAlertMessage()
  const alertMessageCallBack = useShowAlertMessageCallBack()

  /**
   * 페이지 이동을 위한 네비게이션 훅
   */
  const navigate = useNavigate()

  /**
   * 쟁점의견 완료 처리를 위한 API 호출 훅
   * 성공 시 알림 메시지를 표시하고 페이지를 새로고침합니다.
   * 실패 시 에러 메시지를 표시합니다.
   */
  const { mutate } = useSendReceiptComplete({
    mutation: {
      onSuccess: () => {
        alertMessageCallBack('사건이 접수 되었습니다.', () => {
          navigate(`/receipt/application/${judgSeq}`, {
            state: {
              isComplete: true,
            },
          })
        })
      },
      onError: error => {
        alertMessage(error.message)
      },
    },
  })

  /**
   * 다음 버튼 클릭 핸들러
   * 사건 접수 확인 메시지를 표시하고, 확인 시 사건 접수 API를 호출합니다.
   *
   * @param event - 폼 제출 이벤트
   */
  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()

      confirmMessage('사건 접수 하시겠습니까?', () => {
        mutate({ judgSeq })
      })
    },
    [judgSeq],
  )

  return { onSubmit }
}

export default UseReceiptTemplateOpinionSubmit
