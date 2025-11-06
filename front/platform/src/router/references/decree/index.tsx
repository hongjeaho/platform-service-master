import { lazy } from 'react'

const ReferenceDecreeApplication = lazy(
  () => import('@views/references/decree/application/ReferenceDecreeApplication'),
)
const ReferenceDecreeApplicationView = lazy(
  () => import('@views/references/decree/view/ReferenceDecreeView'),
)

export default [
  {
    path: 'decree/application',
    element: <ReferenceDecreeApplication />,
  },

  {
    path: 'decree/application/:decreeDetailSeq',
    element: <ReferenceDecreeApplicationView />,
  },
]
