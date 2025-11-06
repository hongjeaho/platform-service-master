import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import React from 'react'

import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseHead from '@/components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'
import type { ReceiptAgreementDateEntity } from '@/model'

interface ReceiptAgreementDateViewProps {
  data: ReceiptAgreementDateEntity[]
}

const ReceiptAgreementDateView: React.FC<ReceiptAgreementDateViewProps> = ({ data }) => {
  return (
    <>
      <TableBaseContainer title={'협의 날짜'}>
        <TableBaseHead>
          <TableBaseRow>
            <TableBaseHeadCell width={150}>협의 날짜</TableBaseHeadCell>
            <TableBaseHeadCell>협의 내용</TableBaseHeadCell>
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {data.map((item, index) => (
            <TableBaseRow key={index}>
              <TableBaseCell width={150} align={'center'}>
                {item.agreedDate ?? '-'}
              </TableBaseCell>
              <TableBaseCell>{item.agreedDesc ?? '-'}</TableBaseCell>
            </TableBaseRow>
          ))}
        </TableBaseBody>
      </TableBaseContainer>
    </>
  )
}
export default ReceiptAgreementDateView
