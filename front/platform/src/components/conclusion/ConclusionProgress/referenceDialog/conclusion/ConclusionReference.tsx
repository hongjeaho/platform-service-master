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

import { useGetConclusionOpinionList } from '@/api/references-conclusion-opinion-precedent-api/references-conclusion-opinion-precedent-api'
import type { ConclusionOpinionPrecedentResult, GetConclusionOpinionListParams } from '@/model'

interface ConclusionReferenceProps {
  onGridRowClick: (seq?: number) => void
  gridRowId?: number
}

const ConclusionReference: React.FC<ConclusionReferenceProps> = ({ onGridRowClick, gridRowId }) => {
  const [searchParam, setSearchParam] = useState<GetConclusionOpinionListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const { handleSubmit, register, control, reset } = useForm<GetConclusionOpinionListParams>({
    defaultValues: {
      opinionTemplateSeq: undefined,
      keyword: undefined,
    },
  })

  const onSubmitCallback: SubmitHandler<GetConclusionOpinionListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: pagination.pageSize }))
    void listRefetch()
  }

  const onRowClick = (item: Row<ConclusionOpinionPrecedentResult>) => {
    const clickedRowData: ConclusionOpinionPrecedentResult | undefined = item.original ?? {}
    onGridRowClick(clickedRowData?.seq)
  }

  const {
    data,
    isLoading,
    refetch: listRefetch,
  } = useGetConclusionOpinionList({
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
          <OpinionTemplateSelectBox control={control} />
          <InputTextBox id="keyword" placeholder="" type="text" register={register} />
          <div className="flex gap-4 items-center">
            <BasicButton type="submit" size={'lg'}>
              <Search className="w-4 h-4" />
            </BasicButton>
            <BasicButton variant={'outline'} type="button" size={'lg'} onClick={onReset}>
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
              accessorKey: 'deliberationDate',
              header: '심의일',
              size: 100,
            },
            {
              accessorKey: 'templateName',
              header: '쟁점의견',
              size: 150,
            },
            {
              accessorKey: 'caseNo',
              header: '사건번호',
              size: 100,
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
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
          hideHorizontalScrollbar // 가로 스크롤 숨김처리
          rowCursor
        />
      </div>
    </>
  )
}
export default ConclusionReference
