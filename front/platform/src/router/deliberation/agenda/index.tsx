import { lazy } from 'react'

const DeliberationAgendaApplication = lazy(
  () => import('@views/deliberation/agenda/application/DeliberationAgendaApplication'),
)

export default [
  {
    path: 'agenda/application',
    element: <DeliberationAgendaApplication />,
  },
]
