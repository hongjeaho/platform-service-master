import type { BoardQuestionWriteForm } from '@components/board/questionAnswer/hook/useBoardContentWriteForm.ts'
import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useInsertOrUpdateBoardContent } from '@/api/board-api/board-api.ts'
import { useShowAlertMessageCallBack } from '@/store/message'

const useBoardQuestionSubmit = () => {
  const navigate = useNavigate()
  // const [boardSeqResultOfContent, setBoardSeqResultOfContent] = useState<number>(0)
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const { mutate: mutateContent } = useInsertOrUpdateBoardContent<number>({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('저장되었습니다.', () => {
          navigate('/board/questionAnswer/application')
        })
      },
    },
  })

  const onSubmit: SubmitHandler<BoardQuestionWriteForm> = data => {
    mutateContent({ data: data.boardContentEntity })
  }

  return { onSubmit }
}
export default useBoardQuestionSubmit
