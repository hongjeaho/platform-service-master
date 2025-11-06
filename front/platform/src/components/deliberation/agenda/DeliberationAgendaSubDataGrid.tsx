import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import React from 'react'

import { useGetDeliberationAgendaSubList } from '@/api/deliberation-agenda-api/deliberation-agenda-api'

interface DeliberationAgendaSubDataGridProps {
  deliberationStatusSeq: number | undefined
}

const DeliberationAgendaSubDataGrid: React.FC<DeliberationAgendaSubDataGridProps> = ({
  deliberationStatusSeq,
}) => {
  const { data, isLoading } = useGetDeliberationAgendaSubList(deliberationStatusSeq)

  return (
    <PlatformDataGridV2
      columns={[
        {
          accessorKey: 'caseNo',
          header: '사건번호',
          size: 100,
        },
        {
          accessorKey: 'caseTitle',
          header: '사건명',
          size: 400,
          meta: {
            align: 'left',
          },
        },
        {
          accessorKey: 'chargeNm',
          header: '담당자명',
          size: 120,
        },
        {
          accessorKey: 'opinionCount',
          header: '쟁점의견',
          size: 100,
          meta: {
            type: 'number',
          },
        },
      ]}
      data={data ?? []}
      rowId={'caseNo'} // grid unique
      loading={isLoading}
      showPagination={false}
    />
  )
}

export default DeliberationAgendaSubDataGrid
