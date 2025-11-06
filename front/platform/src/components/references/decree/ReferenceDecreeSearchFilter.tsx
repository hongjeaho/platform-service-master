import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import InputSelectBox from '@components/common/input/selectBox/InputSelectBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { decreeTypeOptions } from '@/constants/references/referenceDecreeCommonOption'
import type { GetDecreeListParams } from '@/model'

interface ReferenceDecreeSearchFilterProps {
  onSubmit: SubmitHandler<GetDecreeListParams>
}

const ReferenceDecreeSearchFilter: React.FC<ReferenceDecreeSearchFilterProps> = ({ onSubmit }) => {
  const { handleSubmit, register, control, reset } = useForm<GetDecreeListParams>({
    defaultValues: {
      decreeCategoryCode: '',
      keyword: undefined,
    },
  })
  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 space-y-4">
            {/* 검색 키워드 */}
            <div className="flex items-center gap-4">
              <InputSelectBox
                placeholder={'전체'}
                className={'w-100'}
                id={'opinionTemplateSeq'}
                control={control}
                options={decreeTypeOptions}
              />
              <InputTextBox id="keyword" placeholder="" type="text" register={register} />
              <div className="flex gap-4 items-center">
                <SearchButton type="submit" />
                <ResetButton onClick={() => reset()} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ReferenceDecreeSearchFilter
