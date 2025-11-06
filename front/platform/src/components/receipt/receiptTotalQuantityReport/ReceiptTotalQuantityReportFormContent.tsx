import InputNumberBox from '@components/common/input/inputBox/InputNumberBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseFooter from '@components/common/ui/tableBase/TableBaseFooter'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import useReceiptTotalQuantityReportSubmit from '@components/receipt/receiptTotalQuantityReport/hook/UseReceiptTotalQuantityReportSubmit'
import useSumCalculator from '@components/receipt/receiptTotalQuantityReport/hook/useSumCalculator'
import React from 'react'
import { useForm } from 'react-hook-form'

import { totalQuantityReportLabels } from '@/constants/receipt/receiptTotalQuantityReport'
import type { ReceiptQuantityReportEntity } from '@/model'

interface ReceiptTotalQuantityReportFormContentProps {
  formId: string
  judgSeq: number
  defaultData?: ReceiptQuantityReportEntity
  handleNextStep: () => void
}

const ReceiptTotalQuantityReportFormContent: React.FC<
  ReceiptTotalQuantityReportFormContentProps
> = ({ formId, judgSeq, handleNextStep, defaultData }) => {
  const { handleSubmit, control } = useForm<ReceiptQuantityReportEntity>({
    defaultValues: defaultData,
  })

  const sumCalculate = useSumCalculator({ control })
  const { onSubmit } = useReceiptTotalQuantityReportSubmit({
    judgSeq,
    sumCalculate,
    handleNextStep,
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <TableBaseContainer title={'총 물량조서'} paddingTop={0}>
        <TableBaseHead>
          <TableBaseRow>
            <TableBaseHeadCell width={100} rowSpan={2}>
              구분
            </TableBaseHeadCell>
            <TableBaseHeadCell colSpan={3}>총 보상대상</TableBaseHeadCell>
            <TableBaseHeadCell colSpan={3}>협의취득</TableBaseHeadCell>
            <TableBaseHeadCell colSpan={3}>재결신청</TableBaseHeadCell>
          </TableBaseRow>
          <TableBaseRow>
            {[...Array(3)].map((_, index) =>
              ['필,건', '면적(m²)', '금액(천 원)'].map((text, subIndex) => (
                <TableBaseHeadCell width={40} key={`${index}-${subIndex}`}>
                  {text}
                </TableBaseHeadCell>
              )),
            )}
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {totalQuantityReportLabels.map((row, index) => (
            <TableBaseRow key={index}>
              <TableBaseCell align={'center'}>{row.label}</TableBaseCell>
              {row.list.map((label, subIndex) => (
                <TableBaseCell key={subIndex} width={40} align={'center'}>
                  {label.id !== '' ? (
                    <InputNumberBox
                      id={label.id}
                      disabled={label.disabled}
                      fixedDecimalScale={label.fixedDecimalScale}
                      control={control}
                      value={sumCalculate[label.id]}
                      maxLength={8}
                    />
                  ) : (
                    '-'
                  )}
                </TableBaseCell>
              ))}
            </TableBaseRow>
          ))}
        </TableBaseBody>
        <TableBaseFooter>
          <TableBaseRow>
            <TableBaseCell align={'center'}>합계</TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumTotalCnt.toLocaleString()} {/* 필건 총 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumTotalArea.toLocaleString()} {/* 면적 총 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumTotalPrice.toLocaleString()} {/* 금액 총 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumCnt.toLocaleString()} {/* 협의 취득 필건 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumArea.toLocaleString()} {/* 협의 취득 면적 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumPrice.toLocaleString()} {/* 협의 취득 금액 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumDecisionCnt.toLocaleString()} {/* 재결 신청 필건 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumDecisionArea.toLocaleString()} {/* 재결 신청 면적 합계 */}
            </TableBaseCell>
            <TableBaseCell align={'center'}>
              {sumCalculate.sumDecisionPrice.toLocaleString()}
            </TableBaseCell>
          </TableBaseRow>
        </TableBaseFooter>
      </TableBaseContainer>
    </form>
  )
}
export default ReceiptTotalQuantityReportFormContent
