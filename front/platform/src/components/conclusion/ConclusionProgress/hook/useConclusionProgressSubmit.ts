import { useNavigate } from 'react-router-dom'

import {
  useCompleteConclusion,
  useIsAllConclusionContentRegistered,
} from '@/api/conclusion-base-api/conclusion-base-api'
import {
  useShowAlertMessage,
  useShowAlertMessageCallBack,
  useShowConfirmMessage,
} from '@/store/message'

const useConclusionProgressSubmit = (judgSeq: number) => {
  const showAlertMessage = useShowAlertMessage()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const showConfirmMessage = useShowConfirmMessage()
  const navigate = useNavigate()

  const { refetch } = useIsAllConclusionContentRegistered(judgSeq, {
    query: {
      enabled: false, // 초기에는 자동 호출 비활성화
    },
  })

  const { mutate } = useCompleteConclusion({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('저장 되었습니다.', () => {
          navigate(`/conclusion/application/${judgSeq}/complete`, {
            state: { statusCode: 'CC001002' },
          })
        })
      },
      onError: error => {
        showAlertMessage(error.message)
      },
    },
  })

  /**
   * 폼 제출 핸들러 함수
   */
  const onSubmit = async () => {
    const { data: isAllConclusionContentRegistered } = await refetch()

    if (!isAllConclusionContentRegistered) {
      showAlertMessage('모든 심의서 검토 의견을 작성해 주세요')
      return
    }

    try {
      showConfirmMessage('심의서 검토를 완료 하시겠습니까?', () => {
        mutate({ judgSeq })
      })
    } catch {
      showAlertMessage('예기치 않은 오류가 발생했습니다.')
    }
  }

  return { onSubmit }
}

export default useConclusionProgressSubmit
