import InputDatePickerBox from '@components/common/input/datePickerBox/InputDatePickerBox'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ReceiptCaseInfo } from '@/model'

interface ReceiptAgreementDateFormProps {}

const ReceiptAgreementDateForm: React.FC<ReceiptAgreementDateFormProps> = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ReceiptCaseInfo>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'agreementDateList',
  })

  return (
    <TableBaseContainer title={'협의  정보'}>
      <TableBaseHead>
        <TableBaseRow>
          <TableBaseHeadCell width={250}> 협의 날짜</TableBaseHeadCell>
          <TableBaseHeadCell>협의 내용</TableBaseHeadCell>
          <TableBaseHeadCell width={100}>-</TableBaseHeadCell>
        </TableBaseRow>
      </TableBaseHead>
      <TableBaseBody>
        {fields.map((_, index) => (
          <TableBaseRow key={index}>
            <TableBaseCell align={'center'}>
              <InputDatePickerBox
                control={control}
                id={`agreementDateList.${index}.agreedDate`}
                error={errors?.agreementDateList?.[index]?.agreedDate}
                rules={{
                  required: '협의 날짜를 입력해 주세요',
                }}
              />
            </TableBaseCell>
            <TableBaseCell>
              <InputTextBox
                id={`agreementDateList.${index}.agreedDesc`}
                register={register}
                type={'text'}
                error={errors?.agreementDateList?.[index]?.agreedDesc}
                rules={{
                  required: '협의 날짜 내용을 입력해 주세요',
                }}
              />
            </TableBaseCell>
            <TableBaseCell>
              {index === 0 ? (
                <button
                  type={'button'}
                  onClick={() => {
                    append({})
                  }}
                  className="px-6 py-2 rounded-md font-medium transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                >
                  추가
                </button>
              ) : (
                <button
                  type={'button'}
                  onClick={() => {
                    remove(index)
                  }}
                  className="px-6 py-2 rounded-md font-medium transition-all  cursor-pointer bg-green-600 text-white hover:bg-green-700"
                >
                  삭제
                </button>
              )}
            </TableBaseCell>
          </TableBaseRow>
        ))}
      </TableBaseBody>
    </TableBaseContainer>
  )
}

export default ReceiptAgreementDateForm
