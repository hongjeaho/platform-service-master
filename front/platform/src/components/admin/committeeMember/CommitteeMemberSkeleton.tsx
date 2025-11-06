import React from 'react'

import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@/components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'

const CommitteeMemberSkeleton: React.FC = () => {
  return (
    <div>
      <TableBaseContainer title="위원회 구성원 정보" paddingTop={0}>
        <TableBaseBody>
          {/* 구분 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell width={250}>구분</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-32 mt-1"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 성명 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>성명</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 비고 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>비고</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-48 mt-1"></div>
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

export default CommitteeMemberSkeleton
