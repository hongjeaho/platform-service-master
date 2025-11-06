import useBoardAnnouncementRequestMemo from '@components/board/announcement/hook/useBoardAnnouncementRequestMemo'
import useBoardAnnouncementSubmit from '@components/board/announcement/hook/useBoardAnnouncementSubmit'
import useBoardAnnouncementWriteForm, {
  type BoardAnnouncementWriteFormProps,
} from '@components/board/announcement/hook/useBoardAnnouncementWriteForm'
import BoardContentWrite from '@components/board/basic/BoardContentWrite'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import React from 'react'
import { FormProvider } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'

import {
  useGetBoardAttachmentByBoardSeq,
  useGetBoardContentDetail,
} from '@/api/board-api/board-api.ts'

interface BoardAnnouncementWriteProps {
  formId: string
  boardCategoryCode: string
}
interface Param {
  boardSeq: number | undefined
}
const BoardAnnouncementWriteForm: React.FC<BoardAnnouncementWriteProps> = ({
  boardCategoryCode,
  formId,
}) => {
  const { boardSeq } = useParams() as unknown as Readonly<Param>
  const { data: boardContentDetail, isLoading } = useGetBoardContentDetail(
    boardSeq,
    boardCategoryCode,
    {
      query: {
        enabled: !!boardSeq,
      },
    },
  )
  const { data: boardAttachmentDetail, isLoading: isLoadingFile } = useGetBoardAttachmentByBoardSeq(
    boardSeq,
    {
      query: {
        enabled: !!boardSeq,
      },
    },
  )

  const defaultValuesForAnnouncement: BoardAnnouncementWriteFormProps =
    useBoardAnnouncementRequestMemo(
      boardSeq ?? 0,
      boardCategoryCode,
      boardContentDetail,
      boardAttachmentDetail,
    )

  const {
    boardSeq: boardSeqResultOfMemo,
    boardContentEntity,
    detailForUploadBoardAttachment,
  } = defaultValuesForAnnouncement

  const methods = useBoardAnnouncementWriteForm({
    boardSeq: boardSeqResultOfMemo,
    boardContentEntity: boardContentEntity,
    detailForUploadBoardAttachment: detailForUploadBoardAttachment,
  })
  const needToSubmitFile = boardCategoryCode === 'CB001002'
  const { onSubmit } = useBoardAnnouncementSubmit(boardCategoryCode)

  if (isLoading || isLoadingFile) return <SkeletonLoading />
  return (
    <form id={formId} onSubmit={methods.handleSubmit(onSubmit)} noValidate autoComplete="off">
      <FormProvider {...methods}>
        <BoardContentWrite needToSubmitFile={needToSubmitFile} />
        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-3 justify-between items-center  mt-4">
          <button
            type={'button'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Link to={`/board/announcement/application`}>목록으로</Link>
          </button>

          <div className="flex gap-3 ">
            <button
              type={'submit'}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </FormProvider>
    </form>
  )
}
export default BoardAnnouncementWriteForm
