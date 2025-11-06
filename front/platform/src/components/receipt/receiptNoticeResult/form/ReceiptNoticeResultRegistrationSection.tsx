import InputDatePickerBox from '@components/common/input/datePickerBox/InputDatePickerBox'
import InputDatePickerRangeBox from '@components/common/input/datePickerBox/InputDatePickerRangeBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import type { ReceiptNoticeFormParam } from '@components/receipt/receiptNoticeResult/hook/useReceiptNoticeResultForm'
import React from 'react'
import type { Control, FieldErrors } from 'react-hook-form'

interface ReceiptNoticeResultRegistrationSectionProps {
  control: Control<ReceiptNoticeFormParam>
  errors?: FieldErrors<ReceiptNoticeFormParam>
}

const ReceiptNoticeResultRegistrationSection: React.FC<
  ReceiptNoticeResultRegistrationSectionProps
> = ({ control, errors }) => {
  return (
    <TableBaseContainer title={'열람 공고 결과 등록'} paddingTop={0}>
      <TableBaseBody>
        <TableBaseRow>
          <TableBaseHeadCell width={100}>열람기간</TableBaseHeadCell>
          <TableBaseCell align={'left'}>
            <InputDatePickerRangeBox
              control={control}
              startId="noticeInfo.noticeStartDate"
              endId="noticeInfo.noticeEndDate"
              errors={{
                start: errors?.noticeInfo?.noticeStartDate,
                end: errors?.noticeInfo?.noticeEndDate,
              }}
              required
            />
          </TableBaseCell>
          <TableBaseHeadCell width={100}>회보일</TableBaseHeadCell>
          <TableBaseCell align={'left'}>
            <InputDatePickerBox
              control={control}
              error={errors?.noticeInfo?.newsletterDate}
              id="noticeInfo.newsletterDate"
              rules={{ required: '회보일을 입력해 주세요' }}
            />
          </TableBaseCell>
        </TableBaseRow>
      </TableBaseBody>
    </TableBaseContainer>
  )
}
export default ReceiptNoticeResultRegistrationSection
