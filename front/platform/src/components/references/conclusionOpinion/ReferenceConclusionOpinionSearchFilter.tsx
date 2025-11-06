import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import OpinionTemplateSelectBox from '@components/references/basic/OpinionTemplateSelectBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import type { GetConclusionOpinionListParams } from '@/model'

interface ReferenceConclusionOpinionSearchFilterProps {
  onSubmit: SubmitHandler<GetConclusionOpinionListParams>
  classNameOfOpinionTemplateSelectBox?: string | undefined
}

const ReferenceConclusionOpinionSearchFilter: React.FC<
  ReferenceConclusionOpinionSearchFilterProps
> = ({ onSubmit, classNameOfOpinionTemplateSelectBox }) => {
  const { handleSubmit, register, control, reset } = useForm<GetConclusionOpinionListParams>({
    defaultValues: {
      opinionTemplateSeq: undefined,
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
              <OpinionTemplateSelectBox
                control={control}
                className={classNameOfOpinionTemplateSelectBox}
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

export default ReferenceConclusionOpinionSearchFilter
