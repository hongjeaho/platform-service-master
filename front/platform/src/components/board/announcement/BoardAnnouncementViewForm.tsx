import BoardAttachmentView from '@components/board/basic/BoardAttachmentView'
import BoardContent from '@components/board/basic/BoardContent'
import useDeleteBoardContent from '@components/board/basic/hook/useDeleteBoardContent'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useGetBoardContentDetail, useUpdateBoardViewCount } from '@/api/board-api/board-api'

interface BoardAnnouncementViewBodyProps {
  boardSeq: number
}

const BoardAnnouncementViewForm: React.FC<BoardAnnouncementViewBodyProps> = ({ boardSeq }) => {
  const { data, isLoading } = useGetBoardContentDetail(boardSeq, 'CB001002')

  const { mutate } = useUpdateBoardViewCount()

  useEffect(() => {
    if (isLoading) return

    mutate({ boardSeq })
  }, [boardSeq, isLoading])

  const { onClickDeleteBoardContent } = useDeleteBoardContent(boardSeq, 'CB001002')
  if (isLoading) return <SkeletonLoading />
  return (
    <>
      {/* 헤더 영역 */}
      <div className="py-8">
        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{data?.title ?? ''}</h1>
      </div>

      {/* 내용 영역 */}
      <BoardContent title={'내용'}>{data?.content ?? ''}</BoardContent>
      <BoardAttachmentView boardSeq={boardSeq} />
      {/* 액션 버튼들 */}
      <div className="flex flex-wrap gap-3 justify-between items-center  mt-4 ">
        <button
          type={'button'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Link to={`/board/announcement/application`}>목록으로</Link>
        </button>

        <div className="flex gap-3 ">
          <button
            type={'button'}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Link to={`/board/announcement/update/${boardSeq}`}>수정</Link>
          </button>
          <button
            type={'button'}
            onClick={onClickDeleteBoardContent}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
          >
            삭제
          </button>
        </div>
      </div>
    </>
  )
}
export default BoardAnnouncementViewForm
