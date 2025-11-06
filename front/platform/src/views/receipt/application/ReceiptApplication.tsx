import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import ReceiptSearchFilter from '@components/receipt/ReceiptSearchFilter'
import React, { useState } from 'react'
import { type SubmitHandler } from 'react-hook-form'

import { useGetReceiptCaseInfoList } from '@/api/receipt-base-api/receipt-base-api'
import { type GetReceiptCaseInfoListParams } from '@/model'

const ReceiptApplication: React.FC = () => {
  const [searchParam, setSearchParam] = useState<GetReceiptCaseInfoListParams>({})
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()

  const {
    data: receiptCaseInfoData,
    isLoading,
    refetch,
  } = useGetReceiptCaseInfoList({ ...searchParam, ...pagination })

  const handleSearchSubmit: SubmitHandler<GetReceiptCaseInfoListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: pagination.pageSize }))
    void refetch()
  }

  return (
    <>
      <MainTitle title="재결 접수" />
      <ContainerCenter>
        <ReceiptSearchFilter onSubmit={handleSearchSubmit} />
        <PlatformDataGridV2
          data={receiptCaseInfoData?.resultList ?? []}
          columns={[
            {
              accessorKey: 'judgSeq',
              header: '재결일련번호',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'recepDt',
              header: '접수일',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'chargeNm',
              header: '담당자',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'implementerNm',
              header: '사업시행자',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'caseNo',
              header: '사건번호',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
              size: 400,
              meta: { type: 'text', align: 'left' },
              cell: ({ row }) => {
                const fullTitle = row.getValue('caseTitle') as string
                const truncatedTitle =
                  fullTitle && fullTitle.length > 30
                    ? `${fullTitle.substring(0, 30)}...`
                    : fullTitle

                return (
                  <div
                    title={fullTitle}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '400px',
                      width: '100%',
                    }}
                  >
                    <PlatformDataGridV2LinkButton
                      link={`/receipt/application/${row.getValue('judgSeq')}`}
                      title={truncatedTitle}
                    ></PlatformDataGridV2LinkButton>
                  </div>
                )
              },
            },
            {
              accessorKey: 'statusName',
              header: '심의 진행상황',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'ltisStateName',
              header: 'LTIS 진행상황',
              size: 100,
              meta: { type: 'text' },
            },
          ]}
          totalPageSize={receiptCaseInfoData?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'judgSeq'} // grid unique
          loading={isLoading}
        />
      </ContainerCenter>
    </>
  )
}

export default ReceiptApplication
