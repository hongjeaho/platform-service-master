import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseFooter from '@components/common/ui/tableBase/TableBaseFooter'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetReceiptQuantityReportByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@/components/common/ui/tableBase/TableBaseHead'
import { totalQuantityReportLabels } from '@/constants/receipt/receiptTotalQuantityReport'

interface ReceiptTotalQuantityReportProps {
  judgSeq: number
}

const ReceiptTotalQuantityReportView: React.FC<ReceiptTotalQuantityReportProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetReceiptQuantityReportByJudgSeq(judgSeq)

  if (isLoading || data === undefined) {
    return <SkeletonLoading />
  }

  return (
    <TableBaseContainer title={`총 물량조서`}>
      <TableBaseHead>
        <TableBaseRow>
          <TableBaseHeadCell rowSpan={2}>구분</TableBaseHeadCell>
          <TableBaseHeadCell colSpan={3}>총보상대상</TableBaseHeadCell>
          <TableBaseHeadCell colSpan={3}>협의취득 등</TableBaseHeadCell>
          <TableBaseHeadCell colSpan={3}>재결 신청</TableBaseHeadCell>
        </TableBaseRow>
        <TableBaseRow>
          {[...Array(3)].map((_, index) =>
            ['필,건', '면적(m²)', '금액(천 원)'].map((text, subIndex) => (
              <TableBaseHeadCell key={`${index}-${subIndex}`}>{text}</TableBaseHeadCell>
            )),
          )}
        </TableBaseRow>
      </TableBaseHead>
      <TableBaseBody>
        {totalQuantityReportLabels.map((row, index) => (
          <TableBaseRow key={index}>
            <TableBaseHeadCell key={index}>{row.label}</TableBaseHeadCell>
            {row.list.map((label, subIndex) => (
              <TableBaseCell align={'center'} key={subIndex}>
                {label.id === '' ? '-' : data[label.id]}
              </TableBaseCell>
            ))}
          </TableBaseRow>
        ))}
      </TableBaseBody>
      <TableBaseFooter>
        <TableBaseRow>
          <TableBaseHeadCell>합계</TableBaseHeadCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumTotalCnt}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumTotalArea}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumTotalPrice}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumCnt}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumArea}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumPrice}{' '}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumPrice}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumDecisionArea}
          </TableBaseCell>
          <TableBaseCell align={'center'} className={'bg-blue-100'}>
            {data.sumDecisionPrice}
          </TableBaseCell>
        </TableBaseRow>
      </TableBaseFooter>
    </TableBaseContainer>
  )
}
export default ReceiptTotalQuantityReportView
