import { lazy } from 'react'

import BaseLayout from '@/layout/BaseLayout'

const ReceiptApplication = lazy(() => import('@views/receipt/application/ReceiptApplication'))
const ReceiptApplicationView = lazy(() => import('@views/receipt/view/ReceiptApplicationView'))

export default [
  {
    path: 'receipt',
    element: <BaseLayout />,
    children: [
      {
        path: 'application',
        element: <ReceiptApplication />,
      },
      {
        path: 'application/:judgSeq',
        element: <ReceiptApplicationView />,
      },
    ],
  },
]
