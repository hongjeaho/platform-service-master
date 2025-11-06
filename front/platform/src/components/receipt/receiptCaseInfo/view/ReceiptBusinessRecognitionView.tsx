import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import type { ReceiptBusinessRecognitionEntity } from '@/model'

interface ReceiptBusinessRecognitionViewProps {
  data: ReceiptBusinessRecognitionEntity[]
}

const ReceiptBusinessRecognitionView: React.FC<ReceiptBusinessRecognitionViewProps> = ({
  data,
}) => {
  return (
    <>
      <TableBaseContainer title={'도시계획 [사업인정]관계'}>
        <TableBaseHead>
          <TableBaseRow>
            <TableBaseHeadCell width={150}>제목</TableBaseHeadCell>
            <TableBaseHeadCell>내용</TableBaseHeadCell>
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {data.map((item, index) => (
            <TableBaseRow key={index}>
              <TableBaseCell width={50} align={'center'}>
                {item.title ?? '-'}
              </TableBaseCell>
              <TableBaseCell>{item.content ?? '-'}</TableBaseCell>
            </TableBaseRow>
          ))}
        </TableBaseBody>
      </TableBaseContainer>
    </>
  )
}
export default ReceiptBusinessRecognitionView
