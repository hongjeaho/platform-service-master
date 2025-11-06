import BasicDialog from '@components/common/ui/dialog/BasicDialog'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetLtisReptLandOwner } from '@/api/ltis-rept-api/ltis-rept-api'
import { LandOwnerColumns } from '@/constants/reptInfo/landColumn'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import { formatWithCommas } from '@/util/numberUtils'

interface LandOwnerListDialogProps {
  open: boolean
  onClose: () => void
}

const LandOwnerListDialog: React.FC<LandOwnerListDialogProps> = ({ open, onClose }) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading } = useGetLtisReptLandOwner(judgSeq)

  return (
    <BasicDialog
      className={`min-h-[700px] min-w-[1000px]`}
      isOpen={open}
      onClose={onClose}
      title={'필지 소유자 상세보기'}
      hideFooter
    >
      <TableBaseContainer isLoading={isLoading} paddingTop={0}>
        <TableBaseHead>
          <TableBaseRow>
            {LandOwnerColumns.map(column => (
              <TableBaseHeadCell width={column.width}>{column.headerName}</TableBaseHeadCell>
            ))}
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {data?.map(land => (
            <TableBaseRow>
              <TableBaseCell align={'center'}>{land.ownrIntrNm}</TableBaseCell>
              <TableBaseCell align={'center'}>{land.landShre}</TableBaseCell>
              <TableBaseCell>{land.reptAddr}</TableBaseCell>
              <TableBaseCell align={'center'}>{land.mainStrtNo}</TableBaseCell>
              <TableBaseCell align={'center'}>{land.subStrtNo}</TableBaseCell>
              <TableBaseCell align={'center'}>{land.obstStuc1Nm}</TableBaseCell>
              <TableBaseCell align={'center'}>{land.obstStuc2Nm}</TableBaseCell>
              <TableBaseCell align={'center'}>{land.areaAmot}</TableBaseCell>
              <TableBaseCell align={'center'}>{formatWithCommas(land.befUnitCost)}</TableBaseCell>
            </TableBaseRow>
          ))}
        </TableBaseBody>
      </TableBaseContainer>
    </BasicDialog>
  )
}
export default LandOwnerListDialog
