import ContainerCenter from '@components/common/ContainerCenter'
import ContainerTitle from '@components/common/ContainerTitle'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import DeliberationAgendaSearchFilter from '@components/deliberation/agenda/DeliberationAgendaSearchFilter'
import DeliberationAgendaSubDataGrid from '@components/deliberation/agenda/DeliberationAgendaSubDataGrid'
import { format } from 'date-fns'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'

import { useGetDeliberationAgendaList } from '@/api/deliberation-agenda-api/deliberation-agenda-api'
import type { GetConclusionInfoListParams, GetDeliberationScheduleListParams } from '@/model'

const DeliberationAgendaApplication: React.FC = () => {
  const [deliberationStatusSeq, setDeliberationStatusSeq] = useState<number>()
  const [scheduleDate, setScheduleDate] = useState<string>()
  const [searchParam, setSearchParam] = useState<GetConclusionInfoListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const { data, isLoading, refetch } = useGetDeliberationAgendaList({
    ...searchParam,
    ...pagination,
  })

  // SearchForm 제출 시 호출되는 함수
  const handleSearchSubmit: SubmitHandler<GetDeliberationScheduleListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: 10 }))
    void refetch()

    // 심의 차수가 조회되면 상세 그리드 초기화
    setDeliberationStatusSeq(undefined)
  }

  return (
    <>
      <MainTitle title="안건 등록" />
      <ContainerCenter>
        <DeliberationAgendaSearchFilter onSubmit={handleSearchSubmit} />
        <div className={'max-h-[300px] flex flex-col gap-2 overflow-y-auto'}>
          <ContainerTitle title={'심의 차수'} />
          <PlatformDataGridV2
            data={data?.resultList ?? []}
            columns={[
              {
                accessorKey: 'scheduleDate',
                header: '심의 일자',
                size: 120,
              },
              {
                accessorKey: 'scheduleGroup',
                header: '심의 그룹',
                size: 120,
              },
              {
                accessorKey: 'caseTitle',
                header: '사업명',
                size: 450,
                meta: { type: 'text', align: 'left' },
                cell: ({ row }) => {
                  return (
                    <button
                      type={'button'}
                      onClick={() => {
                        setDeliberationStatusSeq(row.original.deliberationStatusSeq)
                        setScheduleDate(row.original.scheduleDate)
                      }}
                      className={
                        'text-table-cellText hover:text-semantic-error hover:underline underline-offset-2 transition-colors duration-200  cursor-pointer'
                      }
                    >
                      {row.getValue('caseTitle')}
                    </button>
                  )
                },
              },
            ]}
            totalPageSize={data?.total ?? 0} // 전체 카운터
            pageSize={searchParam.pageSize ?? 10}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
            rowId={'deliberationStatusSeq'} // grid unique
            loading={isLoading}
          />
        </div>

        {deliberationStatusSeq && scheduleDate && (
          <div className="mt-5">
            <ContainerTitle title={`${format(scheduleDate, 'yyyy-MM')}차`} />
            <DeliberationAgendaSubDataGrid deliberationStatusSeq={deliberationStatusSeq} />
          </div>
        )}
      </ContainerCenter>
    </>
  )
}

export default DeliberationAgendaApplication
