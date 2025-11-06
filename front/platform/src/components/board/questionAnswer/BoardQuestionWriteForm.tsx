import BoardContentWrite from '@components/board/basic/BoardContentWrite'
import useBoardQuestionWriteForm, {
  type BoardQuestionWriteFormProps,
} from '@components/board/questionAnswer/hook/useBoardContentWriteForm'
import useBoardQuestionSubmit from '@components/board/questionAnswer/hook/useBoardQuestionSubmit'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import React from 'react'
import { FormProvider } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'

import { useGetBoardContentDetail } from '@/api/board-api/board-api'
import { userAuthoritySelector } from '@/store/user'

interface BoardQuestionWriteProps {
  formId: string
  boardCategoryCode: string
}
interface Param {
  boardSeq: number | undefined
}
const BoardQuestionWriteForm: React.FC<BoardQuestionWriteProps> = ({
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
  const userAuthority = userAuthoritySelector()
  const isReplyWriter = userAuthority
    .flatMap(basicAuth => basicAuth.userSeq)
    .includes(boardContentDetail?.createdBy ?? 0)
  const isDecision = userAuthority.flatMap(basicAuth => basicAuth.role).includes('DECISION')

  const hasRightToWrite =
    boardSeq === null || boardSeq === undefined ? true : isReplyWriter || isDecision

  const methods = useBoardQuestionWriteForm({
    boardSeq: boardSeq,
    boardContentEntity: boardContentDetail,
  } as BoardQuestionWriteFormProps)

  const { onSubmit } = useBoardQuestionSubmit()
  if (isLoading) return <SkeletonLoading />
  return (
    <form id={formId} onSubmit={methods.handleSubmit(onSubmit)} noValidate autoComplete="off">
      <FormProvider {...methods}>
        <BoardContentWrite needToSubmitFile={false} />
        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-3 justify-between items-center  mt-4">
          <button
            type={'button'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Link to={`/board/questionAnswer/application`}>목록으로</Link>
          </button>

          {hasRightToWrite && (
            <div className="flex gap-3 ">
              <button
                type={'submit'}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                저장
              </button>
            </div>
          )}
        </div>
      </FormProvider>
    </form>
  )
}
export default BoardQuestionWriteForm
