import BaseLayout from '@/layout/BaseLayout'
import agenda from '@/router/deliberation/agenda'
import schedule from '@/router/deliberation/schedule'

export default [
  {
    path: 'deliberation',
    element: <BaseLayout />,
    children: [...schedule, ...agenda],
  },
]
