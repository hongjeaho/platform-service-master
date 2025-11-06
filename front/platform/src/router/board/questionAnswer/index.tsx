import { lazy } from 'react'

const BoardQuestionAnswerApplication = lazy(
  () => import('@views/board/questionAnswer/application/BoardQuestionAnswerApplication'),
)
const BoardQuestionAnswerApplicationView = lazy(
  () => import('@views/board/questionAnswer/view/BoardQuestionAnswerView'),
)

export default [
  {
    path: 'questionAnswer/application',
    element: <BoardQuestionAnswerApplication />,
  },
  {
    path: 'questionAnswer/application/:boardSeq',
    element: <BoardQuestionAnswerApplicationView isUpdate={false} />,
  },
  {
    path: 'questionAnswer/write',
    element: <BoardQuestionAnswerApplicationView isUpdate={false} />,
  },
  {
    path: 'questionAnswer/update/:boardSeq',
    element: <BoardQuestionAnswerApplicationView isUpdate={true} />,
  },
]
