import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputDatePickerRangeBox from '@components/common/input/datePickerBox/InputDatePickerRangeBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import type { GetConclusionInfoListParams, GetDeliberationAgendaListParams } from '@/model'

interface DeliberationAgendaSearchFilterProps {
  onSubmit: SubmitHandler<GetConclusionInfoListParams>
}

const DeliberationAgendaSearchFilter: React.FC<DeliberationAgendaSearchFilterProps> = ({
  onSubmit,
}) => {
  const { handleSubmit, control, reset } = useForm<GetDeliberationAgendaListParams>({
    defaultValues: {
      scheduleStartDt: undefined,
      scheduleEndDt: undefined,
    },
  })

  return (
    <div className="w-full mx-auto pb-6">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 space-y-4">
            {/* 검색 키워드 */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="keyword"
                className="text-sm font-medium text-gray-700 w-40 flex-shrink-0 "
              >
                심의 일자
              </label>
              <InputDatePickerRangeBox
                control={control}
                startId="scheduleStartDt"
                endId="scheduleEndDt"
              />
            </div>
            {/* 버튼 영역 */}
            <div className="flex gap-4 pt-4 justify-center">
              <SearchButton type="submit" />
              <ResetButton onClick={() => reset()} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DeliberationAgendaSearchFilter
