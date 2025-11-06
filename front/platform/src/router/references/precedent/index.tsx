import { lazy } from 'react'

const ReferencePrcedentApplication = lazy(
  () => import('@views/references/precedent/application/ReferencePrcedentApplication'),
)
const ReferencePrecedentApplicationView = lazy(
  () => import('@views/references/precedent/view/ReferencePrecedentView'),
)

export default [
  {
    path: 'precedent/application',
    element: <ReferencePrcedentApplication />,
  },

  {
    path: 'precedent/application/:precedentSeq',
    element: <ReferencePrecedentApplicationView />,
  },
]
