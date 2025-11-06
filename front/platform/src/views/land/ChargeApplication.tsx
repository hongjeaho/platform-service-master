import React from 'react'

import { useGetAdminDistrictChargeList } from '@/api/district-charge-api/district-charge-api'
import ContainerCenter from '@/components/common/ContainerCenter'
import MainTitle from '@/components/common/MainTitle'
import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@/components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@/components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'

const ChargeApplication: React.FC = () => {
  const { data: chargeListData, isLoading } = useGetAdminDistrictChargeList()

  return (
    <>
      <MainTitle title="구별 담당현황" />
      <ContainerCenter>
        <section>
          <div className="text-2xl font-bold mb-2 text-sky-700">구별 담당현황</div>
          <div className="text-right text-sm text-neutral-500 mb-4"></div>

          <TableBaseContainer isLoading={isLoading}>
            <TableBaseHead>
              <TableBaseRow>
                <TableBaseHeadCell width="10%">연번</TableBaseHeadCell>
                <TableBaseHeadCell width="25%">이름</TableBaseHeadCell>
                <TableBaseHeadCell width="45%">담당 구역</TableBaseHeadCell>
                <TableBaseHeadCell width="20%">전화번호</TableBaseHeadCell>
              </TableBaseRow>
            </TableBaseHead>
            <TableBaseBody>
              {chargeListData?.resultList?.map((charge, index) => (
                <TableBaseRow key={index} className="hover:bg-table-cellBgHover">
                  <TableBaseCell align="center">{index + 1}</TableBaseCell>
                  <TableBaseCell align="center">{charge.managerName}</TableBaseCell>
                  <TableBaseCell align="left">{charge.district}</TableBaseCell>
                  <TableBaseCell align="center">{charge.phoneNumber}</TableBaseCell>
                </TableBaseRow>
              ))}
            </TableBaseBody>
          </TableBaseContainer>
        </section>
      </ContainerCenter>
    </>
  )
}

export default ChargeApplication
