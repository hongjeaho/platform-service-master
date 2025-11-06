import ContainerCenter from '@components/common/ContainerCenter'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import MainTitle from '@components/common/MainTitle'
import React, { lazy, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'

interface BoardQuestionAnswerApplicationViewProps {
  isUpdate: boolean
}
interface Param {
  boardSeq: number | undefined
}

const BoardQuestionAnswerViewForm = lazy(
  () => import('@components/board/questionAnswer/BoardQuestionAnswerView'),
)

const BoardQuestionWriteForm = lazy(
  () => import('@components/board/questionAnswer/BoardQuestionWriteForm'),
)

const BoardQuestionAnswerView: React.FC<BoardQuestionAnswerApplicationViewProps> = ({
  isUpdate,
}) => {
  const { boardSeq } = useParams() as unknown as Readonly<Param>

  const isWriteForm = useMemo(() => {
    return boardSeq === undefined || boardSeq === null || isUpdate === true
  }, [boardSeq, isUpdate])

  return (
    <>
      <MainTitle title={'묻고 답하기'} />
      <ContainerCenter>
        <div className="max-w-2xl mx-auto">
          {!isWriteForm && (
            <Suspense fallback={<SkeletonLoading />}>
              <BoardQuestionAnswerViewForm boardSeq={boardSeq ?? 0} />
            </Suspense>
          )}
          {isWriteForm && (
            <Suspense fallback={<SkeletonLoading />}>
              <BoardQuestionWriteForm
                formId={'boardQuestionWriteForm'}
                boardCategoryCode={'CB001003'}
              />
            </Suspense>
          )}
        </div>
      </ContainerCenter>
    </>
  )
}
export default BoardQuestionAnswerView
