import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useInsertOrUpdateStartConclusion } from '@/api/conclusion-base-api/conclusion-base-api'
import {
  useShowAlertMessage,
  useShowAlertMessageCallBack,
  useShowConfirmMessage,
} from '@/store/message'

/**
 * 심의일자, 심의 그룹을 저장하고 검토를 시작하는 제출 기능을 처리하는 훅
 *
 * @param judgSeq - 재결 일련번호
 */
const useConclusionStartSubmit = (judgSeq: number) => {
  const showAlertMessage = useShowAlertMessage()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const showConfirmMessage = useShowConfirmMessage()
  const navigate = useNavigate()
  /**
   * 검토 시작 API 호출을 위한 mutation 설정
   * 성공 시 콘솔에 로그를 출력하고, 실패 시 에러 메시지를 표시
   */
  const { mutate } = useInsertOrUpdateStartConclusion({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('검토 중으로 상태를 변경했습니다.', () => {
          navigate(`/conclusion/application/${judgSeq}/progress`, {
            state: { statusCode: 'CC001001' },
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
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    showConfirmMessage('심의서 검토중으로 상태를 변경 하시겠습니까?', () => {
      mutate({ judgSeq })
    })
  }

  return { onSubmit }
}

export default useConclusionStartSubmit
