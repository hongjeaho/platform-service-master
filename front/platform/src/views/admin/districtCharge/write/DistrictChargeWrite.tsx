import DistrictChargeForm from '@components/admin/districtCharge/DistrictChargeForm'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

const DistrictChargeWrite: React.FC = () => {
  return (
    <>
      <MainTitle title="구별 담당자 등록" />
      <ContainerCenter>
        <DistrictChargeForm isEdit={false} />
      </ContainerCenter>
    </>
  )
}

export default DistrictChargeWrite
