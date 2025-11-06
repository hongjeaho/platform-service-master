import type { BoardAnnouncementWriteForm } from '@components/board/announcement/hook/useBoardAnnouncementWriteForm.ts'
import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useInsertOrUpdateBoardContentAndFile } from '@/api/board-api/board-api'
import type { DetailForUploadBoardAttachment } from '@/model'
import { useShowAlertMessageCallBack } from '@/store/message'

const useBoardAnnouncementSubmit = (boardCategoryCode: string) => {
  const navigate = useNavigate()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  // const { status, mutateAsync: mutateContent } = useInsertOrUpdateBoardContent<number>({
  //   mutation: {
  //     onSettled: res => {
  //       const resultBoardSeq = res == undefined ? 0 : res
  //       console.log('onSettled >> ', resultBoardSeq)
  //     },
  //   },
  // })

  const { mutate: mutateFile } = useInsertOrUpdateBoardContentAndFile({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('저장되었습니다.', () => {
          navigate('/board/announcement/application')
        })
      },
    },
  })

  const onSubmit: SubmitHandler<BoardAnnouncementWriteForm> = data => {
    const { boardContentEntity, boardAttachmentInfo } = data
    const multipartFile: Blob = boardAttachmentInfo.documents.attachments?.file ?? new Blob()
    const boardAttachInfoForUploadFileList: DetailForUploadBoardAttachment = {
      boardAttachmentTypeCode: boardAttachmentInfo.documents.typeCode,
      boardAttachmentOrder: 0,
      boardAttachmentFileSeq: boardAttachmentInfo.documents.attachments?.fileSeq,
    }

    const needToSubmitFile = boardCategoryCode === 'CB001002'

    console.log('boardAttachInfoForUploadFileList: ', boardAttachInfoForUploadFileList)

    if (needToSubmitFile) {
      mutateFile({
        data: {
          boardContentEntity: boardContentEntity,
          detailForUploadBoardAttachment: boardAttachInfoForUploadFileList,
          multipartFile: multipartFile,
        },
      })
    }
  }

  return { onSubmit }
}
export default useBoardAnnouncementSubmit
