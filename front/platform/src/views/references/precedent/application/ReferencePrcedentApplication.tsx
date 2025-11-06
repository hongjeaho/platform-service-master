import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import ReferencePrecedentSearchFilter from '@components/references/precedent/ReferencePrecedentSearchFilter'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'

import { useGetPrecedentList } from '@/api/references-precedent-api/references-precedent-api'
import type { GetPrecedentListParams } from '@/model'

interface ReferencePrecedentApplicationProps {}

const ReferencePrecedentApplication: React.FC<ReferencePrecedentApplicationProps> = () => {
  const [searchParam, setSearchParam] = useState<GetPrecedentListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const { data, isLoading, refetch } = useGetPrecedentList({ ...searchParam, ...pagination })

  const handleSearchSubmit: SubmitHandler<GetPrecedentListParams> = async data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: pagination.pageSize }))
    void refetch()
  }

  return (
    <>
      <MainTitle title="판례 조회" />
      <ContainerCenter>
        <ReferencePrecedentSearchFilter onSubmit={handleSearchSubmit} />
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'caseNo',
              header: '사건',
              size: 150,
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
              size: 550,
              cell: ({ row }) => {
                const precedentSeq = row.original.seq ?? 0
                return (
                  <PlatformDataGridV2LinkButton
                    link={`/references/precedent/application/${precedentSeq}`}
                    title={row.getValue('caseTitle')}
                  ></PlatformDataGridV2LinkButton>
                )
              },
            },
            {
              accessorKey: 'precedentCaseNo',
              header: '법원사건번호',
              size: 150,
            },
            {
              accessorKey: 'templateName',
              header: '쟁점의견',
              size: 335,
            },
            {
              accessorKey: 'viewCount',
              header: '조회수',
              size: 80,
            },
          ]}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'seq'} // grid unique
          loading={isLoading}
          hideHorizontalScrollbar // 가로 스크롤 숨김처리
          rowCursor
        />
      </ContainerCenter>
    </>
  )
}
export default ReferencePrecedentApplication
