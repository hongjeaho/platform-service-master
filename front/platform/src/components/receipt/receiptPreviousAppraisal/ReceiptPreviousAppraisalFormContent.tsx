import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import InputRadioBox from '@components/common/input/radioBox/InputRadioBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import ReceiptPreviousAppraisalRecommendSection from '@components/receipt/receiptPreviousAppraisal/form/ReceiptPreviousAppraisalRecommendSection'
import ReceiptPreviousAppraisalUploadCategorySection from '@components/receipt/receiptPreviousAppraisal/form/ReceiptPreviousAppraisalUploadCategorySection'
import useReceiptPreviousAppraisalForm from '@components/receipt/receiptPreviousAppraisal/hook/useReceiptPreviousAppraisalForm'
import useReceiptPreviousAppraisalSubmit from '@components/receipt/receiptPreviousAppraisal/hook/useReceiptPreviousAppraisalSubmit'
import React from 'react'
import { useWatch } from 'react-hook-form'

import previousAppraisalUploadCategories from '@/constants/receipt/previousAppraisalUploadCategories'
import type { ReceiptAppraisalResponse } from '@/model'

interface ReceiptPreviousAppraisalFormContentProps {
  judgSeq: number
  formId: string
  defaultData: ReceiptAppraisalResponse
  handleNextStep: () => void
}

const ReceiptPreviousAppraisalFormContent: React.FC<ReceiptPreviousAppraisalFormContentProps> = ({
  judgSeq,
  handleNextStep,
  formId,
  defaultData,
}) => {
  /** 폼 관리를 위한 react-hook-form 설정 */
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useReceiptPreviousAppraisalForm(defaultData)

  /** 협의 감정평가 정브롤 저장하는 react-hook-form submit  이벤트 */
  const { onSubmit } = useReceiptPreviousAppraisalSubmit({ judgSeq, handleNextStep })

  /** 시도지사 추천 여부 감시 */
  const isGovernorRecommendation = useWatch({
    control,
    name: 'receiptPreviousAppraisal.governorRecommendation',
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
      <TableBaseContainer title={'시도지사 추천'} paddingTop={0}>
        <TableBaseBody>
          <TableBaseRow>
            <TableBaseHeadCell width={250}>시도지사 추천 여부</TableBaseHeadCell>
            <TableBaseCell>
              <InputRadioBox
                id={'receiptPreviousAppraisal.governorRecommendation'}
                control={control}
                rules={{
                  validate: (value: boolean | null) =>
                    value === null ? '시도지사 추천여부 선택은 필수 입니다.' : true,
                }}
                options={[
                  { value: 'true', label: '네' },
                  { value: 'false', label: '아니오' },
                ]}
                returnTypeBoolean
              />
            </TableBaseCell>
          </TableBaseRow>
          {isGovernorRecommendation === false && (
            <TableBaseRow>
              <TableBaseHeadCell>
                시·도지사 추천
                <br /> 요청을 하지 않은 이유
              </TableBaseHeadCell>
              <TableBaseCell>
                <InputTextBox
                  id={'receiptPreviousAppraisal.governorNotRecommendation'}
                  error={errors?.receiptPreviousAppraisal?.governorNotRecommendation}
                  rules={{
                    required: !isGovernorRecommendation
                      ? '시도지사 추천  하지 않는 이유 작성은 필수 입니다..'
                      : false,
                  }}
                  register={register}
                />
              </TableBaseCell>
            </TableBaseRow>
          )}
        </TableBaseBody>
      </TableBaseContainer>

      {/*  협의 공고 파일 컴포넌트  ( 시도지사 추천 여부를 선택해야 노출됨 ) */}
      <div className="mt-2">
        {(isGovernorRecommendation === true || isGovernorRecommendation === false) &&
          previousAppraisalUploadCategories.map((category, index) => (
            <ReceiptPreviousAppraisalUploadCategorySection
              key={category.name}
              control={control}
              category={category}
              errors={errors}
              index={index}
              recommendation={isGovernorRecommendation}
            />
          ))}
      </div>

      {/* 협의 감졍평가 추천  ( 시도지사 추천 여부를 선택해야 노출됨 ) */}
      {(isGovernorRecommendation === true || isGovernorRecommendation === false) && (
        <ReceiptPreviousAppraisalRecommendSection
          register={register}
          control={control}
          errors={errors}
          isGovernorRecommendation={isGovernorRecommendation}
          isOptionalImplementerRecommendation={
            defaultData?.receiptPreviousAppraisal?.optionalImplementerRecommendation
          }
          isOptionalLandOwnerRecommendation={
            defaultData?.receiptPreviousAppraisal?.optionalLandOwnerRecommendation
          }
        />
      )}
    </form>
  )
}
export default ReceiptPreviousAppraisalFormContent
