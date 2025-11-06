import React from 'react'
import { Outlet } from 'react-router-dom'

import Footer from '@/layout/footer/Footer'
import Header from '@/layout/header/Header'
import ScrollToTop from '@/layout/ScrollToTop'
import AlertMessage from '@/message/AlertMessage'
import ConfirmMessage from '@/message/ConfirmMessage'
import { useAxiosInstance } from '@/util/http'

const BaseLayout: React.FC = () => {
  useAxiosInstance()

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />

      {/* 메인 콘텐츠 - Header가 fixed이므로 pt-16으로 헤더 높이만큼 여백 확보 */}
      <main className="pt-16 bg-white">
        <Outlet />
      </main>

      <Footer />
      <AlertMessage />
      <ConfirmMessage />
    </div>
  )
}

export default BaseLayout
