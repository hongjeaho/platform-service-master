import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetLTISImplementerInfo } from '@/api/ltis-api/ltis-api'

interface EtcInfoProps {
  judgSeq: number
}

const LTISImplementerInfo: React.FC<EtcInfoProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetLTISImplementerInfo(judgSeq)
  return (
    <TableBaseContainer title={'담당자 정보'} isLoading={isLoading}>
      <TableBaseBody>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>사업시행자 담당자(연락처)</TableBaseHeadCell>
          <TableBaseCell align={'left'}>
            {data?.implementerNm} {data?.implementerPhone && <>({data.implementerPhone})</>}
          </TableBaseCell>
        </TableBaseRow>
      </TableBaseBody>
    </TableBaseContainer>
  )
}
export default LTISImplementerInfo
