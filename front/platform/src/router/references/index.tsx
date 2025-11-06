import BaseLayout from '@/layout/BaseLayout'
import NoFooterLayout from '@/layout/NoFooterLayout'

import conclusionOpinion from './conclusionOpinion'
import decree from './decree'
import map from './map'
import precedent from './precedent'

export default [
  {
    path: 'references',
    element: <BaseLayout />,
    children: [...decree, ...precedent, ...conclusionOpinion],
  },
  {
    path: 'references',
    element: <NoFooterLayout />,
    children: [...map],
  },
]
