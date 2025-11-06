import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import ReferenceDecreeSearchFilter from '@components/references/decree/ReferenceDecreeSearchFilter'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'

import { useGetDecreeList } from '@/api/references-decree-api/references-decree-api'
import type { GetDecreeListParams } from '@/model'

interface ReferenceDecreeApplicationProps {}

const ReferenceDecreeApplication: React.FC<ReferenceDecreeApplicationProps> = () => {
  const [searchParam, setSearchParam] = useState<GetDecreeListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()

  const { data, isLoading, refetch } = useGetDecreeList({ ...searchParam, ...pagination })

  const handleSearchSubmit: SubmitHandler<GetDecreeListParams> = async data => {
    setSearchParam(params => ({
      ...params,
      ...data,
      page: 0,
      pageSize: pagination.pageSize,
    }))
    void refetch()
  }

  return (
    <>
      <MainTitle title="법령 및 시행규칙 조회" />
      <ContainerCenter>
        <ReferenceDecreeSearchFilter onSubmit={handleSearchSubmit} />
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'decreeDetailSeq',
              header: '연번',
              size: 40,
            },
            {
              accessorKey: 'decreeName',
              header: '법령 및 시행규칙',
              size: 950,
              cell: ({ row }) => {
                return (
                  <PlatformDataGridV2LinkButton
                    link={`/references/decree/application/${row.getValue('decreeDetailSeq')}`}
                    title={row.getValue('decreeName')}
                  ></PlatformDataGridV2LinkButton>
                )
              },
            },
            {
              accessorKey: 'articleNo',
              header: '조항',
              size: 150,
            },
            {
              accessorKey: 'viewCount',
              header: '조회수',
              size: 120,
            },
          ]}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'decreeDetailSeq'} // grid unique
          loading={isLoading}
          hideHorizontalScrollbar // 가로 스크롤 숨김처리
          rowCursor
        />
      </ContainerCenter>
    </>
  )
}
export default ReferenceDecreeApplication
