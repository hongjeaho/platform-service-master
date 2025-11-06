import BoardCommonSearchBox from '@components/board/basic/BoardCommonSearchBox'
import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputSelectBox from '@components/common/input/selectBox/InputSelectBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import type { GetBoardQuestionAnswerResultListParams } from '@/model'

interface BoardQuestionAnswerSearchFilterProps {
  onSubmit: SubmitHandler<GetBoardQuestionAnswerResultListParams>
}
const BoardQuestionAnswerSearchFilter: React.FC<BoardQuestionAnswerSearchFilterProps> = ({
  onSubmit,
}) => {
  const { handleSubmit, register, control, reset } =
    useForm<GetBoardQuestionAnswerResultListParams>({
      defaultValues: {
        searchConditionType: 0,
        keyword: undefined,
      },
    })
  return (
    <div className="w-full mx-auto pb-6">
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
                options={searchConditionGroup}
              />
              <BoardCommonSearchBox register={register} />
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
const searchConditionGroup = [
  { value: 0, label: '전체' },
  { value: 1, label: '제목' },
  { value: 2, label: '내용' },
]
export default BoardQuestionAnswerSearchFilter
