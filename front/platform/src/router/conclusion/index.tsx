import { lazy } from 'react'

import BaseLayout from '@/layout/BaseLayout'

const ConclusionApplication = lazy(
  () => import('@views/conclusion/review/application/ConclusionReviewApplication'),
)

const ConclusionCompleteApplication = lazy(
  () => import('@views/conclusion/review/complete/ConclusionReviewComplete'),
)

const ConclusionProgressApplication = lazy(
  () => import('@views/conclusion/review/progress/ConclusionReviewProgress'),
)

const ConclusionStartApplication = lazy(
  () => import('@views/conclusion/review/start/ConclusionReviewStar'),
)

const ConclusionNoticeApplication = lazy(
  () => import('@views/conclusion/notice/application/ConclusionNoticeApplication'),
)

export default [
  {
    path: 'conclusion/application',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <ConclusionApplication />,
      },
      {
        path: ':judgSeq',
        element: <ConclusionStartApplication />,
      },
      {
        path: ':judgSeq/progress',
        element: <ConclusionProgressApplication />,
      },
      {
        path: ':judgSeq/complete',
        element: <ConclusionCompleteApplication />,
      },
    ],
  },
  {
    path: 'conclusion/notice',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <ConclusionNoticeApplication />,
      },
    ],
  },
]
