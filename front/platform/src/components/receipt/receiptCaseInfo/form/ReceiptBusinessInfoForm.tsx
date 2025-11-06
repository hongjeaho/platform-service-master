import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import type { ReceiptCaseInfo } from '@/model'

interface ReceiptBusinessInfoFormProps {}

const ReceiptBusinessInfoForm: React.FC<ReceiptBusinessInfoFormProps> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReceiptCaseInfo>()

  return (
    <TableBaseContainer title={'사업  정보'} paddingTop={0}>
      <TableBaseBody>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>규모(단위)</TableBaseHeadCell>
          <TableBaseCell>
            <InputTextBox
              id="businessInfo.scale"
              placeholder="예) 1.234㎡"
              type="text"
              register={register}
              error={errors?.businessInfo?.scale}
              rules={{
                required: '규모 단위를 입력해 주세요.',
              }}
            />
          </TableBaseCell>
          <TableBaseHeadCell width={250}>사업 기간</TableBaseHeadCell>
          <TableBaseCell>
            <InputTextBox
              id="businessInfo.businessPeriod"
              type="text"
              register={register}
              error={errors?.businessInfo?.businessPeriod}
              rules={{
                required: '사업 기간을 입력해 주세요.',
              }}
            />
          </TableBaseCell>
        </TableBaseRow>
        <TableBaseRow>
          <TableBaseHeadCell>재결신청 사유</TableBaseHeadCell>
          <TableBaseCell colSpan={3}>
            <InputTextBox
              id="businessInfo.requestReason"
              placeholder=""
              type="text"
              register={register}
              error={errors?.businessInfo?.requestReason}
              rules={{
                required: '재결신청 사유를 입력해 주세요.',
              }}
            />
          </TableBaseCell>
        </TableBaseRow>
      </TableBaseBody>
    </TableBaseContainer>
  )
}

export default ReceiptBusinessInfoForm
