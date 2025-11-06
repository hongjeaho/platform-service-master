import { lazy } from 'react'

const CompensationApplication = lazy(() => import('@/views/land/CompensationApplication'))
const AcceptanceDecisionApplication = lazy(
  () => import('@/views/land/AcceptanceDecisionApplication'),
)
const ProcedureApplication = lazy(() => import('@/views/land/ProcedureApplication'))
const CommitteeApplication = lazy(() => import('@/views/land/CommitteeApplication'))
const ChargeApplication = lazy(() => import('@/views/land/ChargeApplication'))

export default [
  {
    path: 'land',
    children: [
      {
        path: 'compensationApplication',
        element: <CompensationApplication />,
        meta: { title: '토지수용제도 및 보상금 안내' },
      },
      {
        path: 'acceptanceDecisionApplication',
        element: <AcceptanceDecisionApplication />,
        meta: { title: '수용재결 안내' },
      },
      {
        path: 'procedureApplication',
        element: <ProcedureApplication />,
        meta: { title: '수용재결 절차안내' },
      },
      {
        path: 'committeeApplication',
        element: <CommitteeApplication />,
        meta: { title: '서울지방토지 수용위원회' },
      },
      {
        path: 'chargeApplication',
        element: <ChargeApplication />,
        meta: { title: '구별 담당현황' },
      },
    ],
  },
]
