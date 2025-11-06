import React from 'react'
import { useNavigate } from 'react-router-dom'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleMenuItemClick = (path: string) => {
    if (path) {
      navigate(path)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-16 left-0 right-0 bg-white shadow-2xl border border-gray-200 z-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-bold text-gray-800">전체 메뉴</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200 cursor-pointer"
        >
          <span className="text-gray-600 text-xl font-bold">×</span>
        </button>
      </div>

      {/* 메뉴 목록 - 가로 레이아웃 */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6">
          {menuState.map((menu, index) => (
            <div key={index} className="text-center">
              {/* 메인 메뉴 제목 */}
              <h3 className="text-sm font-bold text-gray-800 mb-3 px-2 py-2 bg-blue-100 rounded-lg border border-blue-200 break-words">
                {menu.name}
              </h3>

              {/* 서브 메뉴들 */}
              <div className="space-y-2">
                {menu.sub.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => handleMenuItemClick(subItem.path)}
                    className="w-full text-center px-2 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-all duration-200 hover:scale-105 transform block break-words cursor-pointer"
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const menuState = [
  {
    name: '토지수용제도안내',
    sub: [
      { name: '토지수용제도 및 보상금안내', path: '/land/compensationApplication' },
      { name: '수용재결 안내', path: '/land/acceptanceDecisionApplication' },
      { name: '수용재결 절차안내', path: '/land/procedureApplication' },
      { name: '지방토지 수용위원회', path: '/land/committeeApplication' },
      { name: '구별 담당현황', path: '/land/chargeApplication' },
    ],
  },
  {
    name: '사업시행자',
    sub: [{ name: '재결 접수', path: '/receipt/application' }],
  },
  {
    name: '재결관',
    sub: [
      { name: '열람 공고 의뢰 등록', path: '' },
      { name: '심의서 작성', path: '/conclusion/application' },
    ],
  },
  {
    name: '심의',
    sub: [
      { name: '심의 안건 등록', path: 'deliberation/schedule/application' },
      { name: '심의 안건', path: 'deliberation/agenda/application' },
    ],
  },
  {
    name: '심의 자료',
    sub: [
      { name: '법령 및 시행규칙', path: '/references/decree/application' },
      { name: '재결관 의견', path: '/references/conclusionOpinion/application' },
      { name: '판례', path: '/references/precedent/application' },
      { name: '통계', path: '' },
      { name: '심의 지도', path: '' },
    ],
  },
  {
    name: '게시판',
    sub: [
      { name: '공지사항', path: '/board/announcement/application' },
      { name: '묻고 답하기', path: '/board/questionAnswer/application' },
    ],
  },
  {
    name: '관리자',
    sub: [
      { name: '구별 담당자', path: '/admin/districtCharge/application' },
      { name: '위원회 명단', path: '/admin/committeeMember/application' },
      { name: '회원 관리', path: '/admin/userManagement/application' },
    ],
  },
]

export default HamburgerMenu
