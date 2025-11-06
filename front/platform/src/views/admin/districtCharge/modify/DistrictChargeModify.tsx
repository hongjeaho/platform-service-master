import DistrictChargeForm from '@components/admin/districtCharge/DistrictChargeForm'
import DistrictChargeSkeleton from '@components/admin/districtCharge/DistrictChargeSkeleton'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'
import { useParams } from 'react-router-dom'

import { useGetAdminDistrictCharge } from '@/api/district-charge-api/district-charge-api'

interface Params {
  seq: number
}

const DistrictChargeModify: React.FC = () => {
  const { seq } = useParams() as unknown as Readonly<Params>
  const { data: editData, isLoading } = useGetAdminDistrictCharge(seq)

  // 로딩 중일 때 스켈리톤 표시
  if (isLoading) {
    return (
      <>
        <MainTitle title="구별 담당자 수정" />
        <ContainerCenter>
          <DistrictChargeSkeleton />
        </ContainerCenter>
      </>
    )
  }

  return (
    <>
      <MainTitle title="구별 담당자 수정" />
      <ContainerCenter>
        <DistrictChargeForm isEdit={true} seq={seq} editData={editData} />
      </ContainerCenter>
    </>
  )
}

export default DistrictChargeModify
