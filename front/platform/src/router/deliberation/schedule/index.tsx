import { lazy } from 'react'

const DeliberationScheduleApplication = lazy(
  () => import('@views/deliberation/schedule/application/DeliberationScheduleApplication'),
)

export default [
  {
    path: 'schedule/application',
    element: <DeliberationScheduleApplication />,
  },
]
