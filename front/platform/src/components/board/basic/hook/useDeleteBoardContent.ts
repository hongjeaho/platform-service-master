import { useNavigate } from 'react-router-dom'

import { useRemoveBoardContent } from '@/api/board-api/board-api.ts'
import { useShowAlertMessageCallBack, useShowConfirmMessage } from '@/store/message'

const useDeleteBoardContent = (boardSeq: number, boardCategoryCode: string) => {
  const showAlertMessageCallback = useShowAlertMessageCallBack()
  const showConfirmMessage = useShowConfirmMessage()
  const navigate = useNavigate()
  const { mutate } = useRemoveBoardContent({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallback('삭제되었습니다.', () => {
          boardCategoryCode === 'CB001002'
            ? navigate('/board/announcement/application')
            : navigate('/board/questionAnswer/application')
        })
      },
    },
  })

  const onClickDeleteBoardContent = () => {
    showConfirmMessage('현재 글을 삭제하시겠습니까?', () => {
      mutate({ boardSeq })
    })
  }

  return { onClickDeleteBoardContent }
}

export default useDeleteBoardContent
