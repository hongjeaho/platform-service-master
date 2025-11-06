import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ReceiptCaseInfo } from '@/model'

interface ReceiptBusinessRecognitionFormProps {}

const ReceiptBusinessRecognitionForm: React.FC<ReceiptBusinessRecognitionFormProps> = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ReceiptCaseInfo>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'businessRecognitionList',
  })

  return (
    <TableBaseContainer title={'도시계획 [사업인정]관계'}>
      <TableBaseHead>
        <TableBaseRow>
          <TableBaseHeadCell width={250}>제목</TableBaseHeadCell>
          <TableBaseHeadCell>내용</TableBaseHeadCell>
          <TableBaseHeadCell width={100}>-</TableBaseHeadCell>
        </TableBaseRow>
      </TableBaseHead>
      <TableBaseBody>
        {fields.map((_, index) => (
          <TableBaseRow key={index}>
            <TableBaseCell width={100}>
              <InputTextBox
                id={`businessRecognitionList.${index}.title`}
                register={register}
                type={'text'}
                error={errors?.businessRecognitionList?.[index]?.title}
                rules={{
                  required: '사업인정 관계 제목을 입력해 주세요',
                }}
              />
            </TableBaseCell>
            <TableBaseCell>
              <InputTextBox
                id={`businessRecognitionList.${index}.content`}
                register={register}
                type={'text'}
                error={errors?.businessRecognitionList?.[index]?.content}
                rules={{
                  required: '사업인정 관계 내요을 입력해 주세요',
                }}
              />
            </TableBaseCell>
            <TableBaseCell width={50}>
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

export default ReceiptBusinessRecognitionForm
