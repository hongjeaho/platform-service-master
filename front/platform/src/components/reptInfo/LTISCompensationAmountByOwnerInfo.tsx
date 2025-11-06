import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import type { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

import { useGetLTISCompensationAmountByOwnerInfo } from '@/api/ltis-rept-api/ltis-rept-api'
import type { GetLTISCompensationAmountByOwnerInfoParams, LTISInfo } from '@/model'

interface CompensationAmountByOwnerInfoProps {
  judgSeq: number
}

const columns: ColumnDef<LTISInfo>[] = [
  { accessorKey: 'ownrIntrNm', header: '소유자', size: 100 },
  { accessorKey: 'landCnt', header: '토지', size: 50 },
  { accessorKey: 'objectCnt', header: '지장물', size: 50 },
  {
    header: '협의평가',
    columns: [
      {
        accessorKey: 'beforeFirstAmtSum',
        header: 'A',
        size: 90,
        cell: () => <>-</>,
      },
      {
        accessorKey: 'beforeSecondAmtSum',
        header: 'B',
        size: 90,
        cell: () => <>-</>,
      },
      {
        accessorKey: 'beforeThirdAmtSum',
        header: 'C',
        size: 90,
        cell: () => <>-</>,
      },
      {
        accessorKey: 'bizOprtPrice',
        header: '종전',
        size: 90,
        meta: {
          type: 'number',
        },
      },
    ],
  },
  {
    header: '재결평가',
    columns: [
      {
        accessorKey: 'frstCompAmtSum',
        header: 'A',
        size: 100,
        meta: {
          type: 'number',
        },
      },
      {
        accessorKey: 'secdCompAmtSum',
        header: 'B',
        size: 100,
        meta: {
          type: 'number',
        },
      },
      {
        accessorKey: 'avgCompAmtSum',
        header: '평균',
        size: 100,
        meta: {
          type: 'number',
        },
      },
      {
        accessorKey: 'increasedAmtSum',
        header: '격차',
        size: 100,
        meta: {
          type: 'number',
        },
      },
      {
        accessorKey: 'increasedRate',
        header: '상승율',
        size: 100,
        meta: {
          type: 'number',
        },
      },
    ],
  },
  {
    accessorKey: 'detail',
    header: '상세',
    size: 50,
    cell: ({ row }) => (
      <Search
        className="w-4 h-4 cursor-pointer"
        onClick={() => {
          console.log(row)
        }}
      />
    ),
  },
]

const LTISCompensationAmountByOwnerInfo: React.FC<CompensationAmountByOwnerInfoProps> = ({
  judgSeq,
}) => {
  const [searchParam] = useState<GetLTISCompensationAmountByOwnerInfoParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()

  const { data, isLoading } = useGetLTISCompensationAmountByOwnerInfo(judgSeq, {
    ...searchParam,
    ...pagination,
  })

  return (
    <div className="pt-5">
      <div className="mb-4 flex justify-between">
        <span className="text-[22px] font-bold text-[#274ba9]">소유자별 보상액</span>
      </div>

      <PlatformDataGridV2
        data={data?.resultList ?? []}
        columns={columns}
        totalPageSize={data?.total ?? 0} // 전체 카운터
        pageSize={searchParam.pageSize ?? 10}
        onChangePage={onChangePage}
        onChangePageSize={onChangePageSize}
        rowId={'ownrSeq'} // grid unique
        loading={isLoading}
      />
    </div>
  )
}

export default LTISCompensationAmountByOwnerInfo
