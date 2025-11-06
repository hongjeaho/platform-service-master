import { BasicButton } from '@components/common/button'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import useReferenceDialog from '@components/conclusion/ConclusionProgress/referenceDialog/hook/useReferenceDialog'
import OpinionTemplateSelectBox from '@components/references/basic/OpinionTemplateSelectBox'
import type { Row } from '@tanstack/react-table'
import { RotateCcw, Search } from 'lucide-react'
import React, { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { useGetPrecedentList } from '@/api/references-precedent-api/references-precedent-api'
import type { GetPrecedentListParams, PrecedentResult } from '@/model'

interface PrecedentReferenceProps {
  onGridRowClick: (seq?: number) => void
  gridRowId?: number
}

const PrecedentReference: React.FC<PrecedentReferenceProps> = ({ onGridRowClick, gridRowId }) => {
  const [searchParam, setSearchParam] = useState<GetPrecedentListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const { handleSubmit, register, control, reset } = useForm<GetPrecedentListParams>({
    defaultValues: {
      templateNameSeq: undefined,
      keyword: undefined,
    },
  })

  const onSubmitCallback: SubmitHandler<GetPrecedentListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: pagination.pageSize }))
    void listRefetch()
  }

  const onRowClick = (item: Row<PrecedentResult>) => {
    const clickedRowData: PrecedentResult | undefined = item.original ?? {}
    onGridRowClick(clickedRowData?.seq)
  }

  const {
    data,
    isLoading,
    refetch: listRefetch,
  } = useGetPrecedentList({
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
          <OpinionTemplateSelectBox control={control} className={'w-50 relative z-50'} />
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
              accessorKey: 'caseNo',
              header: '사건',
              size: 100,
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
              size: 150,
            },
            {
              accessorKey: 'precedentCaseNo',
              header: '법원사건번호',
              size: 100,
            },
            {
              accessorKey: 'templateName',
              header: '쟁점의견',
              size: 350,
            },
          ]}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          onRowClick={onRowClick}
          clickedRowId={gridRowId}
          rowId={'seq'} // grid unique
          loading={isLoading}
          rowCursor
        />
      </div>
    </>
  )
}
export default PrecedentReference
