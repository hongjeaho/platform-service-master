import { BasicButton } from '@components/common/button'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import InputSelectBox from '@components/common/input/selectBox/InputSelectBox'
import useReferenceDialog from '@components/conclusion/ConclusionProgress/referenceDialog/hook/useReferenceDialog'
import type { Row } from '@tanstack/react-table'
import { RotateCcw, Search } from 'lucide-react'
import React, { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { useGetDecreeList } from '@/api/references-decree-api/references-decree-api'
import { decreeTypeOptions } from '@/constants/references/referenceDecreeCommonOption'
import type { DecreeResult, GetDecreeListParams } from '@/model'

interface DecreeReferenceProps {
  onGridRowClick: (seq?: number) => void
  gridRowId?: number
}

const DecreeReference: React.FC<DecreeReferenceProps> = ({ onGridRowClick, gridRowId }) => {
  const [searchParam, setSearchParam] = useState<GetDecreeListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const { handleSubmit, register, control, reset } = useForm<GetDecreeListParams>({
    defaultValues: {
      decreeCategoryCode: '',
      keyword: undefined,
    },
  })

  const onSubmitCallback: SubmitHandler<GetDecreeListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: pagination.pageSize }))
    void listRefetch()
  }

  const onRowClick = (item: Row<DecreeResult>) => {
    const clickedRowData: DecreeResult | undefined = item.original ?? {}
    onGridRowClick(clickedRowData?.decreeDetailSeq)
  }

  const {
    data,
    isLoading,
    refetch: listRefetch,
  } = useGetDecreeList({
    ...searchParam,
    ...pagination,
  })

  const { onReset } = useReferenceDialog({
    reset,
    onGridRowClick,
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitCallback)} autoComplete={'off'}>
        <div className="flex items-center gap-4 p-2">
          <InputSelectBox
            placeholder={'전체'}
            className={'w-40 relative z-50'}
            id={'decreeCategoryCode'}
            control={control}
            options={decreeTypeOptions}
          />
          <InputTextBox id="keyword" placeholder="" type="text" register={register} />
          <div className="flex gap-4 items-center">
            <BasicButton type="submit">
              <Search className="w-4 h-4" />
            </BasicButton>
            <BasicButton variant={'outline'} type="button" onClick={onReset}>
              <RotateCcw className="w-4 h-4" />
            </BasicButton>
          </div>
        </div>
      </form>
      <div className="flex-1 overflow-auto p-2">
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'decreeName',
              header: '법령 및 시행규칙',
              size: 100,
            },
            {
              accessorKey: 'articleNo',
              header: '조항',
              size: 150,
            },
          ]}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          onRowClick={onRowClick}
          clickedRowId={gridRowId}
          rowId={'decreeDetailSeq'} // grid unique
          loading={isLoading}
          rowCursor
        />
      </div>
    </>
  )
}
export default DecreeReference
