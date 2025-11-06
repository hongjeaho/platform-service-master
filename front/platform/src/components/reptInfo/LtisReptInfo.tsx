import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import LandListDialog from '@components/reptInfo/dialog/LandListDialog'
import LandOwnerListDialog from '@components/reptInfo/dialog/LandOwnerListDialog'
import ObjectListDialog from '@components/reptInfo/dialog/ObjectListDialog'
import ObjectOwnerListDialog from '@components/reptInfo/dialog/ObjectOwnerListDialog'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

import { useGetLtisReptInfo } from '@/api/ltis-rept-api/ltis-rept-api'
import { formatWithCommas } from '@/util/numberUtils'

const LtisReptInfo: React.FC<ReportInfoProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetLtisReptInfo(judgSeq)

  const [isOpenLand, setOpenLand] = useState(false)
  const [isOpenLandOwner, setOpenLandOwner] = useState(false)
  const [isOpenObject, setOpenObject] = useState(false)
  const [isOpenObjectOwner, setOpenObjectOwner] = useState(false)

  return (
    <>
      <LandListDialog open={isOpenLand} onClose={() => setOpenLand(false)} />
      <LandOwnerListDialog open={isOpenLandOwner} onClose={() => setOpenLandOwner(false)} />
      <ObjectListDialog open={isOpenObject} onClose={() => setOpenObject(false)} />
      <ObjectOwnerListDialog open={isOpenObjectOwner} onClose={() => setOpenObjectOwner(false)} />

      <TableBaseContainer title={'조서 정보'} isLoading={isLoading}>
        <TableBaseBody>
          <TableBaseRow>
            <TableBaseHeadCell width={250}>필지수</TableBaseHeadCell>
            <TableBaseCell align={'left'}>
              <div className="flex items-center">
                {formatWithCommas(data?.landCnt)}{' '}
                <Search
                  onClick={() => setOpenLand(true)}
                  size={16}
                  className="ml-1 cursor-pointer"
                />
              </div>
            </TableBaseCell>
            <TableBaseHeadCell width={250}>지장물수</TableBaseHeadCell>
            <TableBaseCell align={'left'}>
              <div className="flex items-center">
                {formatWithCommas(data?.objectCnt)}{' '}
                <Search
                  onClick={() => setOpenObject(true)}
                  size={16}
                  className="ml-1 cursor-pointer"
                />
              </div>
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow>
            <TableBaseHeadCell width={250}>필지소유자수</TableBaseHeadCell>
            <TableBaseCell align={'left'}>
              <div className="flex items-center">
                {formatWithCommas(data?.landOwnerCnt)}{' '}
                <Search
                  onClick={() => setOpenLandOwner(true)}
                  size={16}
                  className="ml-1 cursor-pointer"
                />
              </div>
            </TableBaseCell>
            <TableBaseHeadCell width={250}>지장물소유자수</TableBaseHeadCell>
            <TableBaseCell align={'left'}>
              <div className="flex items-center">
                {formatWithCommas(data?.objectOwnerCnt)}
                <Search
                  onClick={() => setOpenObjectOwner(true)}
                  size={16}
                  className="ml-1 cursor-pointer"
                />
              </div>
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow>
            <TableBaseHeadCell width={250}>종전금액합계(원)</TableBaseHeadCell>
            <TableBaseCell align={'left'}>{formatWithCommas(data?.bizOprtPrice)}</TableBaseCell>
            <TableBaseHeadCell width={250}>면적</TableBaseHeadCell>
            <TableBaseCell align={'left'}>{formatWithCommas(data?.areaAmot)}</TableBaseCell>
          </TableBaseRow>
        </TableBaseBody>
      </TableBaseContainer>
    </>
  )
}

interface ReportInfoProps {
  judgSeq: number
}
export default LtisReptInfo
