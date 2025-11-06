import React from 'react'
import { Outlet } from 'react-router-dom'

import ScrollToTop from '@/layout/ScrollToTop'
import AlertMessage from '@/message/AlertMessage'
import ConfirmMessage from '@/message/ConfirmMessage'
import { useAxiosInstance } from '@/util/http'

const BaseLayout: React.FC = () => {
  useAxiosInstance()

  return (
    <div className="h-full m-0">
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
      <AlertMessage />
      <ConfirmMessage />
    </div>
  )
}

export default BaseLayout
