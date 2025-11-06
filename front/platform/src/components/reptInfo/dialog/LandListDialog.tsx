import BasicDialog from '@components/common/ui/dialog/BasicDialog'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetLtisReptLand } from '@/api/ltis-rept-api/ltis-rept-api'
import { landColumns } from '@/constants/reptInfo/landColumn'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import { formatWithCommas } from '@/util/numberUtils'

interface LandListDialogLandListDialogProps {
  open: boolean
  onClose: () => void
}

const LandListDialogLandListDialog: React.FC<LandListDialogLandListDialogProps> = ({
  open,
  onClose,
}) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading } = useGetLtisReptLand(judgSeq)

  return (
    <BasicDialog
      className={`min-h-[700px] min-w-[1000px]`}
      isOpen={open}
      onClose={onClose}
      title={'필지 상세보기'}
      hideFooter
    >
      <TableBaseContainer isLoading={isLoading} paddingTop={0}>
        <TableBaseHead>
          <TableBaseRow>
            {landColumns.map(column => (
              <TableBaseHeadCell width={column.width}>{column.headerName}</TableBaseHeadCell>
            ))}
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {data?.map(land => (
            <TableBaseRow>
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
export default LandListDialogLandListDialog
