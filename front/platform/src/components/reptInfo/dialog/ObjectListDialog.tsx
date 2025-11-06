import BasicDialog from '@components/common/ui/dialog/BasicDialog'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetLtisReptObject } from '@/api/ltis-rept-api/ltis-rept-api'
import { objectColumns } from '@/constants/reptInfo/objectColumn'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import { formatWithCommas } from '@/util/numberUtils'

interface ObjectListDialogProps {
  open: boolean
  onClose: () => void
}

const ObjectListDialog: React.FC<ObjectListDialogProps> = ({ open, onClose }) => {
  const judgSeq = useGetJudgSeq()
  const { data, isLoading } = useGetLtisReptObject(judgSeq)

  return (
    <BasicDialog
      className={`min-h-[700px] min-w-[1000px]`}
      isOpen={open}
      onClose={onClose}
      title={'지장물 상세보기'}
      hideFooter
    >
      <TableBaseContainer isLoading={isLoading} paddingTop={0}>
        <TableBaseHead>
          <TableBaseRow>
            {objectColumns.map(column => (
              <TableBaseHeadCell width={column.width}>{column.headerName}</TableBaseHeadCell>
            ))}
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {data?.map(object => (
            <TableBaseRow>
              <TableBaseCell>{object.reptAddr}</TableBaseCell>
              <TableBaseCell align={'center'}>{object.mainStrtNo}</TableBaseCell>
              <TableBaseCell align={'center'}>{object.subStrtNo}</TableBaseCell>
              <TableBaseCell align={'center'}>{object.obstStuc1Nm}</TableBaseCell>
              <TableBaseCell align={'center'}>{object.obstStuc2Nm}</TableBaseCell>
              <TableBaseCell align={'center'}>{object.areaAmot}</TableBaseCell>
              <TableBaseCell align={'center'}>{formatWithCommas(object.befUnitCost)}</TableBaseCell>
            </TableBaseRow>
          ))}
        </TableBaseBody>
      </TableBaseContainer>
    </BasicDialog>
  )
}

export default ObjectListDialog
