import { useAuth } from '@hooks/useAuth.ts'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MainMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>()
  const navigate = useNavigate()

  const handleMenuItemClick = (path: string) => {
    if (path) {
      navigate(path)
    }
    setActiveMenu(null)
  }

  const { userData } = useAuth()
  const isAdmin = userData.roles?.some(role => role.role === 'ADMIN')

  // 메뉴 상태 (관리자 메뉴 가시성을 동적으로 설정)
  const menuState = useMemo(
    () => [
      {
        name: '토지수용제도안내',
        isVisible: true,
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
        isVisible: true,
        sub: [{ name: '재결 접수', path: '/receipt/application' }],
      },
      {
        name: '재결관',
        isVisible: true,
        sub: [
          { name: '열람 공고 의뢰 등록', path: '' },
          { name: '심의서 작성', path: '/conclusion/application' },
        ],
      },
      {
        name: '심의',
        isVisible: true,
        sub: [
          { name: '심의 안건 등록', path: 'deliberation/schedule/application' },
          { name: '심의 안건', path: 'deliberation/agenda/application' },
        ],
      },
      {
        name: '심의 자료',
        isVisible: true,
        sub: [
          { name: '법령 및 시행규칙', path: '/references/decree/application' },
          { name: '재결관 의견', path: '/references/conclusionOpinion/application' },
          { name: '판례', path: '/references/precedent/application' },
          { name: '통계', path: '' },
          { name: '심의 지도', path: '/references/map/application' },
        ],
      },
      {
        name: '게시판',
        isVisible: true,
        sub: [
          { name: '공지사항', path: '/board/announcement/application' },
          { name: '묻고 답하기', path: '/board/questionAnswer/application' },
        ],
      },
      {
        name: '관리자',
        isVisible: isAdmin, // 관리자 권한이 있을 때만 표시
        sub: [
          { name: '구별 담당자', path: '/admin/districtCharge/application' },
          { name: '위원회 명단', path: '/admin/committeeMember/application' },
          { name: '회원 관리', path: '/admin/userManagement/application' },
        ],
      },
    ],
    [isAdmin],
  )

  return (
    <nav className="hidden xl:flex flex-1 items-center justify-center">
      <div className="flex items-center space-x-6">
        {menuState
          .filter(menu => menu.isVisible)
          .map((menu, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="text-gray-700 hover:text-blue-600 py-2 px-3 font-medium transition-colors whitespace-nowrap cursor-pointer">
                {menu.name}
              </button>

              {/* 드롭다운 메뉴 */}
              {activeMenu === index && menu.sub.length > 0 && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-white shadow-lg rounded-lg py-2 min-w-[250px] border border-gray-200">
                    {menu.sub.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => handleMenuItemClick(subItem.path)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </nav>
  )
}

export default MainMenu
