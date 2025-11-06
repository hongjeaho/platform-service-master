import React from 'react'

import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@/components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'

const UserManagementSkeleton: React.FC = () => {
  return (
    <div>
      <TableBaseContainer title="회원 정보" paddingTop={0}>
        <TableBaseBody>
          {/* 아이디 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell width={250}>아이디</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="flex items-center gap-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 비밀번호 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>비밀번호</TableBaseHeadCell>
            <TableBaseCell>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-40 mt-1"></div>
            </TableBaseCell>
            <TableBaseHeadCell>비밀번호 확인</TableBaseHeadCell>
            <TableBaseCell>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-40 mt-1"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 이름 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>이름</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 이메일 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>이메일</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 권한 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>권한</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="min-h-[60px]">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-48 mt-1 ml-2"></div>
              </div>
            </TableBaseCell>
          </TableBaseRow>
        </TableBaseBody>
      </TableBaseContainer>

      {/* 버튼 영역 */}
      <div className="flex justify-center space-x-4 mt-8">
        <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}

export default UserManagementSkeleton
