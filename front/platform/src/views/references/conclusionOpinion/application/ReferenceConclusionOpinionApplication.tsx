import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import ReferenceConclusionOpinionSearchFilter from '@components/references/conclusionOpinion/ReferenceConclusionOpinionSearchFilter'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'

import { useGetConclusionOpinionList } from '@/api/references-conclusion-opinion-precedent-api/references-conclusion-opinion-precedent-api'
import type { GetConclusionOpinionListParams } from '@/model'

interface ReferencesConclusionOpinionApplicationProps {}

const ReferenceConclusionOpinionApplication: React.FC<
  ReferencesConclusionOpinionApplicationProps
> = () => {
  const [searchParam, setSearchParam] = useState<GetConclusionOpinionListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()

  const { data, isLoading, refetch } = useGetConclusionOpinionList({
    ...searchParam,
    ...pagination,
  })

  const handleSearchSubmit: SubmitHandler<GetConclusionOpinionListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: pagination.pageSize }))
    void refetch()
  }

  return (
    <>
      <MainTitle title="재결관 의견 조회" />
      <ContainerCenter>
        <ReferenceConclusionOpinionSearchFilter onSubmit={handleSearchSubmit} />
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'deliberationDate',
              header: '심의일',
              size: 100,
            },
            {
              accessorKey: 'caseNo',
              header: '사건번호',
              size: 100,
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
              size: 470,
              cell: ({ row }) => {
                const conclusionOpinionSeq = row.original.seq ?? 0
                return (
                  <PlatformDataGridV2LinkButton
                    link={`/references/conclusionOpinion/application/${conclusionOpinionSeq}`}
                    title={row.getValue('caseTitle')}
                  ></PlatformDataGridV2LinkButton>
                )
              },
            },
            {
              accessorKey: 'templateName',
              header: '쟁점의견',
              size: 300,
            },
            {
              accessorKey: 'chargeNm',
              header: '담당자',
              size: 200,
            },
            {
              accessorKey: 'viewCount',
              header: '조회수',
              size: 50,
            },
          ]}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'seq'} // grid unique
          loading={isLoading}
        />
      </ContainerCenter>
    </>
  )
}
export default ReferenceConclusionOpinionApplication
