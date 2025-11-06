import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetLTISBusinessSummary } from '@/api/ltis-api/ltis-api'

interface BusinessSummaryProps {
  judgSeq: number
}

const LTISBusinessSummary: React.FC<BusinessSummaryProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetLTISBusinessSummary(judgSeq)

  return (
    <TableBaseContainer
      title={'사업 정보'}
      subTitle={`LTIS 업데이트 일 : ${data?.updatedTime as string} `}
      isLoading={isLoading}
    >
      <TableBaseBody>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>사건번호</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.caseNo}</TableBaseCell>
          <TableBaseHeadCell width={250}>사건명</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.caseTitle}</TableBaseCell>
        </TableBaseRow>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>접수일자</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.recepDt}</TableBaseCell>
          <TableBaseHeadCell width={250}>진행상태</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.statNm}</TableBaseCell>
        </TableBaseRow>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>시행자가격시점</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.implementerDt}</TableBaseCell>
          <TableBaseHeadCell width={250}>재결구분</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.judgDivNm}</TableBaseCell>
        </TableBaseRow>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>수용재결기관</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.dessionCorp}</TableBaseCell>
          <TableBaseHeadCell width={250}>평가법인</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.corpNm}</TableBaseCell>
        </TableBaseRow>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>위치</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.address || '-'}</TableBaseCell>
          <TableBaseHeadCell width={250}>규모</TableBaseHeadCell>
          <TableBaseCell align={'left'}>{data?.scale || '-'}</TableBaseCell>
        </TableBaseRow>
      </TableBaseBody>
    </TableBaseContainer>
  )
}

export default LTISBusinessSummary
