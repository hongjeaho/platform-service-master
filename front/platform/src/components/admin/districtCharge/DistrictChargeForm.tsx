import React from 'react'
import { useNavigate } from 'react-router-dom'

import BasicButton from '@/components/common/button/BasicButton'
import CancelButton from '@/components/common/button/CancelButton'
import InputTextBox from '@/components/common/input/inputBox/InputTextBox'
import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@/components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'
import type { AdminDistrictManagerEntity } from '@/model/adminDistrictManagerEntity'

import styles from './DistrictChargeForm.module.css'
import useDistrictChargeForm from './hook/useDistrictChargeForm'
import useDistrictChargeSubmit from './hook/useDistrictChargeSubmit'

interface DistrictChargeFormProps {
  isEdit?: boolean
  seq?: number
  editData?: AdminDistrictManagerEntity
}

const DistrictChargeForm: React.FC<DistrictChargeFormProps> = ({
  isEdit = false,
  editData,
  seq,
}) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useDistrictChargeForm(editData)
  const { onSubmit } = useDistrictChargeSubmit({ isEdit, seq })

  const handleCancel = () => {
    navigate('/admin/districtCharge/application')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <TableBaseContainer title="구별 담당자 정보" paddingTop={0}>
        <TableBaseBody>
          <TableBaseRow>
            <TableBaseHeadCell width={250}>이름</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <InputTextBox
                id="managerName"
                placeholder="담당자 이름을 입력해주세요"
                type="text"
                register={register}
                error={errors?.managerName}
                rules={{
                  required: '이름을 입력해 주세요.',
                }}
              />
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow>
            <TableBaseHeadCell>담당 구</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <InputTextBox
                id="district"
                placeholder="예) 영등포구, 성북구, 양천구"
                type="text"
                register={register}
                error={errors?.district}
                rules={{
                  required: '담당 구를 입력해 주세요.',
                }}
              />
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow>
            <TableBaseHeadCell>전화번호</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <InputTextBox
                id="phoneNumber"
                placeholder="예) 02-2133-4688"
                type="text"
                register={register}
                error={errors?.phoneNumber}
                rules={{
                  required: '전화번호를 입력해 주세요.',
                }}
              />
            </TableBaseCell>
          </TableBaseRow>
        </TableBaseBody>
      </TableBaseContainer>

      <div className={styles.buttonContainer}>
        <BasicButton type="submit" variant="primary" size="md">
          {isEdit ? '수정' : '등록'}
        </BasicButton>
        <CancelButton onClick={handleCancel} size="md">
          취소
        </CancelButton>
      </div>
    </form>
  )
}

export default DistrictChargeForm
