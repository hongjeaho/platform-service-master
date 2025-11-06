import type { BoardAttachmentInfoForUploadFile } from '@components/board/basic/hook/boardAttachmentInfoForUploadFile.ts'
import useBoardAttachmentRequestMemo from '@components/board/basic/hook/useBoardAttachmentRequestMemo.ts'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import type { BoardContentEntity, DetailForUploadBoardAttachment } from '@/model'

export interface BoardAnnouncementWriteFormProps {
  boardSeq: number | undefined
  boardContentEntity: BoardContentEntity
  detailForUploadBoardAttachment: DetailForUploadBoardAttachment
}

export interface BoardAnnouncementWriteForm {
  boardSeq: number | undefined
  boardContentEntity: BoardContentEntity
  boardAttachmentInfo: BoardAttachmentInfoForUploadFile
}

const useBoardAnnouncementWriteForm = ({
  boardSeq,
  boardContentEntity,
  detailForUploadBoardAttachment,
}: BoardAnnouncementWriteFormProps) => {
  const defaultValueForBoardAttachment = useBoardAttachmentRequestMemo(
    boardSeq ?? 0,
    detailForUploadBoardAttachment,
  )

  const defaultValueForBoardContent: BoardContentEntity = useMemo(() => {
    if (boardContentEntity === undefined || boardSeq === undefined || boardSeq === null)
      return { boardCategoryCode: 'CB001002', content: '', title: '' } as BoardContentEntity
    else {
      return boardContentEntity as BoardContentEntity
    }
  }, [boardSeq])

  return useForm<BoardAnnouncementWriteForm>({
    defaultValues: {
      boardSeq: boardSeq,
      boardContentEntity: defaultValueForBoardContent,
      boardAttachmentInfo: defaultValueForBoardAttachment,
    },
  })
}
export default useBoardAnnouncementWriteForm
