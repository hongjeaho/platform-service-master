import ContainerCenter from '@components/common/ContainerCenter'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import usePlatformDataGridV2SelectBox from '@components/common/dataGrid/hook/usePlatformDataGridV2SelectBox'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import DeliberationScheduleSearchFilter from '@components/deliberation/schedule/DeliberationScheduleSearchFilter'
import ScheduleAgendaCreationDialog from '@components/deliberation/schedule/dialog/ScheduleAgendaCreationDialog'
import useDeliberationSchedule from '@views/deliberation/schedule/application/hook/useDeliberationSchedule'
import { CalendarMinus, CalendarPlus } from 'lucide-react'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'

import { useGetDeliberationScheduleList } from '@/api/deliberation-schedule-api/deliberation-schedule-api'
import type { GetConclusionInfoListParams, GetDeliberationScheduleListParams } from '@/model'

const DeliberationScheduledApplication: React.FC = () => {
  const [searchParam, setSearchParam] = useState<GetConclusionInfoListParams>({})
  const [isOpen, setOpen] = useState<boolean>(false)
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const { data, isLoading, refetch } = useGetDeliberationScheduleList({
    ...searchParam,
    ...pagination,
  })

  const onRefetch = () => void refetch()
  const onOpen = () => setOpen(true)

  // 선택한 정보
  const { platformDataGridV2Selected, onChangeCheckBox } = usePlatformDataGridV2SelectBox()

  // 일정 등록 삭제 이벤트
  const { handleCheckClick, handleDeleteClick } = useDeliberationSchedule({
    onOpen,
    onRefetch,
    platformDataGridV2Selected,
  })

  // SearchForm 제출 시 호출되는 함수
  const handleSearchSubmit: SubmitHandler<GetDeliberationScheduleListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: 10 }))
    onRefetch()
  }

  return (
    <>
      <MainTitle title="안건 등록" />
      <ContainerCenter>
        <ScheduleAgendaCreationDialog
          open={isOpen}
          ides={platformDataGridV2Selected}
          onClose={() => {
            setOpen(false)
            onRefetch()
          }}
        />
        <DeliberationScheduleSearchFilter onSubmit={handleSearchSubmit} />
        <div className={'flex justify-end items-center mt-5 mb-2'}>
          <div className={'flex gap-2'}>
            <button
              type="button"
              onClick={handleCheckClick}
              className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-main focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors duration-200 flex items-center cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              등록
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-6 py-2 bg-semantic-error text-white rounded-lg hover:bg-semantic-error/90 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2 transition-colors duration-200 flex items-center cursor-pointer"
            >
              <CalendarMinus className="w-4 h-4 mr-2" />
              일정 취소
            </button>
          </div>
        </div>
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'judgSeq',
              header: '재결일련번호',
              size: 120,
            },
            {
              accessorKey: 'caseNo',
              header: '사건번호',
              size: 100,
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
              size: 450,
            },
            {
              accessorKey: 'chargeNm',
              header: '담당자',
              size: 120,
            },
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
          ]}
          onChangeCheckBox={onChangeCheckBox}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'judgSeq'} // grid unique
          loading={isLoading}
          checkbox
        />
      </ContainerCenter>
    </>
  )
}
export default DeliberationScheduledApplication
