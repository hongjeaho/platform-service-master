import React from 'react'

import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@/components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'

const DistrictChargeSkeleton: React.FC = () => {
  return (
    <div>
      <TableBaseContainer title="구별 담당자 정보" paddingTop={0}>
        <TableBaseBody>
          {/* 이름 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell width={250}>이름</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-40 mt-1"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 담당 구 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>담당 구</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-56 mt-1"></div>
            </TableBaseCell>
          </TableBaseRow>

          {/* 전화번호 행 */}
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>전화번호</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-32 mt-1"></div>
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

export default DistrictChargeSkeleton
