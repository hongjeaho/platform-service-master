import ContainerCenter from '@components/common/ContainerCenter'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import MainTitle from '@components/common/MainTitle'
import React, { lazy, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'

interface BoardAnnouncementApplicationViewProps {
  isUpdate: boolean
}
interface Param {
  boardSeq: number | undefined
}

const BoardAnnouncementViewForm = lazy(
  () => import('@components/board/announcement/BoardAnnouncementViewForm'),
)

const BoardAnnouncementWriteForm = lazy(
  () => import('@components/board/announcement/BoardAnnouncementWriteForm'),
)

const BoardAnnouncementView: React.FC<BoardAnnouncementApplicationViewProps> = ({ isUpdate }) => {
  const { boardSeq } = useParams() as unknown as Readonly<Param>
  const isWriteForm = useMemo(() => {
    return boardSeq === undefined || boardSeq === null || isUpdate === true
  }, [boardSeq, isUpdate])

  return (
    <>
      <MainTitle title={'공지사항'} />
      <ContainerCenter>
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<SkeletonLoading />}>
            {isWriteForm ? (
              <BoardAnnouncementWriteForm
                formId={'boardAnnouncementWriteForm'}
                boardCategoryCode={'CB001002'}
              />
            ) : (
              <BoardAnnouncementViewForm boardSeq={boardSeq ?? 0} />
            )}
          </Suspense>
        </div>
      </ContainerCenter>
    </>
  )
}
export default BoardAnnouncementView
