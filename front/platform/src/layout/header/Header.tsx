import { useAtomValue, useSetAtom } from 'jotai'
import { LogOut, Menu, User } from 'lucide-react'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'

import HamburgerMenu from '@/layout/header/HamburgerMenu'
import MainMenu from '@/layout/header/MainMenu'
import { useShowConfirmMessage } from '@/store/message'
import { isLoginSelector, userState } from '@/store/user'
import MyPageModal from '@/views/account/MyPageModal'

const Header: React.FC = () => {
  const isLogin = useAtomValue<boolean>(isLoginSelector)
  const setCustomer = useSetAtom(userState)
  const showConfirmMessage = useShowConfirmMessage()

  const handlerLogout = useCallback(() => {
    showConfirmMessage('로그아웃을 하시겠습니까?', () => {
      localStorage.removeItem('authorization')
      setCustomer(null)
      window.location.href = '/'
    })
  }, [isLogin])

  const [isHamburgerOpen, setIsHamburgerOpen] = React.useState(false)
  const [isMyPageOpen, setIsMyPageOpen] = React.useState(false)

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen)
  }

  const closeHamburgerMenu = () => {
    setIsHamburgerOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* 왼쪽: 타이틀 */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800 cursor-pointer">
                <Link to={'/'}>토지수용위원회</Link>
              </h1>
            </div>
            {/* 중앙: 메인 메뉴 */}
            <MainMenu />
            {/* 오른쪽: 로그인, 마이페이지, 햄버거 메뉴 */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isLogin ? (
                <>
                  <button
                    type={'button'}
                    onClick={handlerLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                  <button
                    type={'button'}
                    onClick={() => setIsMyPageOpen(true)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>마이페이지</span>
                  </button>
                </>
              ) : (
                <Link to={`/login`}>
                  <button
                    type={'button'}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>로그인</span>
                  </button>
                </Link>
              )}

              {/* 햄버거 메뉴 컨테이너 */}
              <div className="relative">
                <button
                  onClick={toggleHamburgerMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700 cursor-pointer" />
                </button>

                {/* 햄버거 메뉴 */}
                <HamburgerMenu isOpen={isHamburgerOpen} onClose={closeHamburgerMenu} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 마이페이지 모달 */}
      <MyPageModal isOpen={isMyPageOpen} onClose={() => setIsMyPageOpen(false)} />
    </>
  )
}

export default Header
