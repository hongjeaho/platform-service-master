import { lazy } from 'react'

const ReferenceConclusionOpinionApplication = lazy(
  () =>
    import('@views/references/conclusionOpinion/application/ReferenceConclusionOpinionApplication'),
)
const ReferenceConclusionOpinionApplicationView = lazy(
  () => import('@views/references/conclusionOpinion/view/ReferenceConclusionOpinionView'),
)

export default [
  {
    path: 'conclusionOpinion/application',
    element: <ReferenceConclusionOpinionApplication />,
  },

  {
    path: 'conclusionOpinion/application/:conclusionOpinionSeq',
    element: <ReferenceConclusionOpinionApplicationView />,
  },
]
