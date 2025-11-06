import type { BoardAnnouncementWriteFormProps } from '@components/board/announcement/hook/useBoardAnnouncementWriteForm.ts'
import { useMemo } from 'react'

import type { BoardContentEntity, DetailForUploadBoardAttachment } from '@/model'

const useBoardAnnouncementRequestMemo = (
  boardSeq: number,
  boardCategoryCode: string,
  boardContentEntity: BoardContentEntity | undefined,
  detailForUploadBoardAttachment: DetailForUploadBoardAttachment | undefined,
) => {
  const defaultValuesForContent: BoardContentEntity = useMemo(() => {
    if (boardSeq === undefined || boardSeq === null)
      return { boardCategoryCode: boardCategoryCode, content: '', title: '' } as BoardContentEntity
    else {
      return boardContentEntity as BoardContentEntity
    }
  }, [boardSeq])

  const defaultValuesForAttachment: DetailForUploadBoardAttachment = useMemo(() => {
    if (boardSeq === undefined || boardSeq === null)
      return { boardAttachmentTypeCode: boardCategoryCode } as DetailForUploadBoardAttachment
    else return detailForUploadBoardAttachment as DetailForUploadBoardAttachment
  }, [boardSeq])

  const defaultValuesForAnnouncement: BoardAnnouncementWriteFormProps = {
    boardSeq: boardSeq,
    boardContentEntity: defaultValuesForContent,
    detailForUploadBoardAttachment: defaultValuesForAttachment,
  }
  return defaultValuesForAnnouncement
}
export default useBoardAnnouncementRequestMemo
