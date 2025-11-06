import { useShowAlertMessage, useShowConfirmMessage } from '@store/message'

import { useDeleteDeliberationSchedule } from '@/api/deliberation-schedule-api/deliberation-schedule-api'

interface Params {
  onOpen: () => void
  onRefetch: () => void
  platformDataGridV2Selected: number[]
}

const useDeliberationSchedule = ({ onOpen, onRefetch, platformDataGridV2Selected }: Params) => {
  const showAlertMessage = useShowAlertMessage()
  const showConfirmMessage = useShowConfirmMessage()

  const { mutate } = useDeleteDeliberationSchedule({
    mutation: {
      onSuccess: () => {
        showAlertMessage('일정을 삭제 하였습니다.')
        onRefetch()
      },
      onError: () => {
        showAlertMessage('일정을 삭제에 실폐하였습니다.')
      },
    },
  })

  // 사업명을 클릭하면 페이지 상세로 이동 처리
  const handleCheckClick = () => {
    if (platformDataGridV2Selected.length === 0) {
      showAlertMessage('하나 이상의 안건을 선택해 주세요')
      return
    }

    onOpen()
  }

  const handleDeleteClick = () => {
    if (platformDataGridV2Selected.length === 0) {
      showAlertMessage('하나 이상의 안건을 선택해 주세요')
      return
    }

    showConfirmMessage('정말로 일정을 삭제 하시겠습니까?', () => {
      mutate({ data: platformDataGridV2Selected })
    })
  }

  return {
    handleCheckClick,
    handleDeleteClick,
  }
}
export default useDeliberationSchedule
