import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'

import { useGetLTISAppraisalInfo } from '@/api/ltis-api/ltis-api'
import { formatWithCommas } from '@/util/numberUtils'

interface AppraisalInfoProps {
  judgSeq: number
}

const LTISAppraisalInfo: React.FC<AppraisalInfoProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetLTISAppraisalInfo(judgSeq)
  return (
    <TableBaseContainer title={'감정평가 정보'} isLoading={isLoading}>
      <TableBaseHead>
        <TableBaseRow>
          <TableBaseHeadCell rowSpan={2} />
          <TableBaseHeadCell colSpan={4}>합의평가</TableBaseHeadCell>
          <TableBaseHeadCell colSpan={5}>경정재결</TableBaseHeadCell>
        </TableBaseRow>
        <TableBaseRow>
          <TableBaseHeadCell>A</TableBaseHeadCell>
          <TableBaseHeadCell>B</TableBaseHeadCell>
          <TableBaseHeadCell>C</TableBaseHeadCell>
          <TableBaseHeadCell>종전</TableBaseHeadCell>
          <TableBaseHeadCell>A</TableBaseHeadCell>
          <TableBaseHeadCell>B</TableBaseHeadCell>
          <TableBaseHeadCell>격차</TableBaseHeadCell>
          <TableBaseHeadCell>상승률</TableBaseHeadCell>
        </TableBaseRow>
      </TableBaseHead>
      <TableBaseBody>
        <TableBaseRow>
          <TableBaseCell>평가금액(원)</TableBaseCell>
          <TableBaseCell>{'-'}</TableBaseCell>
          <TableBaseCell>{'-'}</TableBaseCell>
          <TableBaseCell>{'-'}</TableBaseCell>
          <TableBaseCell>{formatWithCommas(data?.bizOprtPrice)}</TableBaseCell>
          <TableBaseCell>{formatWithCommas(data?.frstCompAmtSum)}</TableBaseCell>
          <TableBaseCell>{formatWithCommas(data?.secdCompAmtSum)}</TableBaseCell>
          <TableBaseCell>{formatWithCommas(data?.avgCompAmtSum)}</TableBaseCell>
          <TableBaseCell>{formatWithCommas(data?.increasedAmtSum)}</TableBaseCell>
          <TableBaseCell>{formatWithCommas(data?.increasedRate)}</TableBaseCell>
        </TableBaseRow>
      </TableBaseBody>
    </TableBaseContainer>
  )
}

export default LTISAppraisalInfo
