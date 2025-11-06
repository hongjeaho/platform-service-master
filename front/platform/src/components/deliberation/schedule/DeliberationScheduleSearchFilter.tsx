import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import type { GetDeliberationScheduleListParams } from '@/model'

interface DeliberationSearchFilterProps {
  onSubmit: SubmitHandler<GetDeliberationScheduleListParams>
}

const DeliberationScheduleSearchFilter: React.FC<DeliberationSearchFilterProps> = ({
  onSubmit,
}) => {
  const { handleSubmit, register, reset } = useForm<GetDeliberationScheduleListParams>({
    defaultValues: {
      keyword: undefined,
      chargeNm: undefined,
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
                사건번호 또는 사업명
              </label>
              <InputTextBox
                id="keyword"
                placeholder="사건번호 혹은 사업명"
                type="text"
                register={register}
              />
            </div>
            {/* 담당자 */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">담당자</label>
              <InputTextBox
                id="chargeNm"
                placeholder="담당자 이름"
                type="text"
                register={register}
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

export default DeliberationScheduleSearchFilter
