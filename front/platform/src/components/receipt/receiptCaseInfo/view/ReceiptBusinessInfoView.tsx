import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import type { ReceiptBusinessInfoEntity } from '@/model'

interface ReceiptBusinessInfoViewProps {
  data: ReceiptBusinessInfoEntity
}

const ReceiptBusinessInfoView: React.FC<ReceiptBusinessInfoViewProps> = ({ data }) => {
  return (
    <>
      <TableBaseContainer title={'사업 개요'}>
        <TableBaseBody>
          <TableBaseRow>
            <TableBaseHeadCell width={150}>규모(단위)</TableBaseHeadCell>
            <TableBaseCell align={'left'}>{data?.scale ?? '-'}</TableBaseCell>
            <TableBaseHeadCell width={150}>사업 기간</TableBaseHeadCell>
            <TableBaseCell align={'left'}>{data?.businessPeriod ?? '-'}</TableBaseCell>
          </TableBaseRow>
          <TableBaseRow>
            <TableBaseHeadCell width={150}>재결신청 사유</TableBaseHeadCell>
            <TableBaseCell colSpan={3} align={'left'}>
              {data?.requestReason ?? '-'}
            </TableBaseCell>
          </TableBaseRow>
        </TableBaseBody>
      </TableBaseContainer>
    </>
  )
}
export default ReceiptBusinessInfoView
