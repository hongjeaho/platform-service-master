import BaseLayout from '@/layout/BaseLayout'
import announcement from '@/router/board/announcement'
import questionAnswer from '@/router/board/questionAnswer'

export default [
  {
    path: 'board',
    element: <BaseLayout />,
    children: [...announcement, ...questionAnswer],
  },
]
