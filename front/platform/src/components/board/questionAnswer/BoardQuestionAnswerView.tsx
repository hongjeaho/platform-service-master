import BoardContent from '@components/board/basic/BoardContent'
import useDeleteBoardContent from '@components/board/basic/hook/useDeleteBoardContent'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useGetBoardContentDetail, useUpdateBoardViewCount } from '@/api/board-api/board-api'
import { useGetBoardReplyFromQuestionAnswer } from '@/api/board-question-and-answer-api/board-question-and-answer-api'
import {
  useInsertOrUpdateBoardQuestionAnswerReply,
  useRemoveBoardQuestionAnswerReply,
} from '@/api/board-question-answer-api/board-question-answer-api'
import type { BoardQuestionAnswerReplyEntity } from '@/model'
import {
  useShowAlertMessage,
  useShowAlertMessageCallBack,
  useShowConfirmMessage,
} from '@/store/message'
import { userAuthoritySelector } from '@/store/user'

interface BoardQuestionAnswerViewBodyProps {
  boardSeq: number
}

const BoardQuestionAnswerView: React.FC<BoardQuestionAnswerViewBodyProps> = ({ boardSeq }) => {
  const { data, isLoading } = useGetBoardContentDetail(boardSeq, 'CB001003', {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  const { onClickDeleteBoardContent } = useDeleteBoardContent(boardSeq, 'CB001003')

  const { mutate } = useUpdateBoardViewCount()

  const { data: replyData, refetch } = useGetBoardReplyFromQuestionAnswer(boardSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })
  const [reply, setReply] = useState<string>(replyData?.reply ?? '')
  const userAuthority = userAuthoritySelector()
  const isReplyWriter = userAuthority
    .flatMap(basicAuth => basicAuth.userSeq)
    .includes(replyData?.createdBy ?? 0)
  const isDecision = userAuthority.flatMap(basicAuth => basicAuth.role).includes('DECISION')
  const [isReadonly, setIsReadonly] = useState<boolean>(!isReplyWriter && !isDecision)

  const insertReply = (replyInInput: string) => {
    setReply(replyInInput)
  }

  const isNullReply = useMemo(() => {
    return replyData?.reply === null || replyData?.reply === undefined
  }, [replyData?.reply])

  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const showAlertMessage = useShowAlertMessage()
  const showConfirmMessage = useShowConfirmMessage()
  const { mutate: saveReply } = useInsertOrUpdateBoardQuestionAnswerReply({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('답글이 저장되었습니다.', () => {
          void refetch()
          setIsReadonly(true)
        })
      },
    },
  })

  const { mutate: removeReply } = useRemoveBoardQuestionAnswerReply({
    mutation: {
      onSuccess: () => {
        void refetch()
        showAlertMessage('답글이 삭제되었습니다.')
      },
    },
  })

  const removeReplyFromQuestionAnswer = () => {
    showConfirmMessage('현재 답글을 삭제하시겠습니까? ', () => {
      removeReply({ boardSeq })
    })
  }

  const saveReplyToQuestionAnswerReply = () => {
    const replyParam = {
      reply: reply,
      boardSeq: boardSeq,
      createdBy: replyData?.createdBy,
    } as BoardQuestionAnswerReplyEntity
    saveReply({ data: replyParam })
  }

  useEffect(() => {
    if (isLoading) return

    mutate({ boardSeq })
  }, [boardSeq, isLoading])

  if (isLoading) return <SkeletonLoading />
  console.log('isReadonly', isReadonly)
  return (
    <>
      {/* 헤더 영역 */}

      <div className="py-8">
        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{data?.title}</h1>
      </div>

      {/* 내용 영역 */}
      <BoardContent title={'문의내용'}>{data?.content}</BoardContent>

      {/* 댓글 영역 (추가 기능) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{'답변'}</h3>
        </div>
        <div className="px-6 py-8 text-left text-gray-500">
          <input
            id="reply"
            className="w-full px-6 py-8 text-left text-gray-500"
            width={100}
            type="text"
            placeholder="답글 작성"
            required={true}
            value={reply}
            readOnly={isReadonly}
            onChange={e => insertReply(e.target.value)}
          />
        </div>
      </div>
      {/* 액션 버튼들 */}
      <div className="flex flex-wrap gap-3 justify-between items-center  mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <Link to={`/board/questionAnswer/application`}>목록으로</Link>
        </button>

        <div className="flex gap-5">
          {!isReadonly && (
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              onClick={() => saveReplyToQuestionAnswerReply()}
            >
              {'답변 저장'}
            </button>
          )}
          {!isNullReply && (
            <button
              type="button"
              onClick={() => removeReplyFromQuestionAnswer()}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
            >
              {'답변 삭제'}
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Link to={`/board/questionAnswer/update/${boardSeq}`}>수정</Link>
          </button>
          <button
            type="button"
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
export default BoardQuestionAnswerView
