import InputNumberBox from '@components/common/input/inputBox/InputNumberBox'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import InputSingleFileUploadBox from '@components/common/input/uploadBox/InputSingleFileUploadBox'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import useReceiptPreviousAppraisalCallBack from '@components/receipt/receiptPreviousAppraisal/form/hook/useReceiptPreviousAppraisalCallBack'
import type { BeforeAppraisalFormRequest } from '@components/receipt/receiptPreviousAppraisal/hook/useReceiptPreviousAppraisalForm'
import React, { useEffect, useState } from 'react'
import {
  type Control,
  type FieldErrors,
  useFieldArray,
  type UseFormRegister,
} from 'react-hook-form'

import { previousAppraisalRecommendList } from '@/constants/receipt/previousAppraisalRecommendList'
import { useShowAlertMessage } from '@/store/message'

interface ReceiptPreviousAppraisalRecommendSectionProps {
  register: UseFormRegister<BeforeAppraisalFormRequest>
  control: Control<BeforeAppraisalFormRequest>
  errors?: FieldErrors<BeforeAppraisalFormRequest>
  isGovernorRecommendation: boolean // 시도지사 추천 여부
  isOptionalImplementerRecommendation?: boolean // 사업시행자 추가 여부
  isOptionalLandOwnerRecommendation?: boolean // 토지소유자 추가 여부
}

const ReceiptPreviousAppraisalRecommendSection: React.FC<
  ReceiptPreviousAppraisalRecommendSectionProps
> = ({
  register,
  control,
  errors,
  isGovernorRecommendation,
  isOptionalImplementerRecommendation = false,
  isOptionalLandOwnerRecommendation = false,
}) => {
  const showAlertMessage = useShowAlertMessage()

  const { fields } = useFieldArray({
    control,
    name: `receiptPreviousAppraisalRecommendList`,
  })

  const { clearCallBack } = useReceiptPreviousAppraisalCallBack(control)

  /** 사업시행자 추가 노출 여부 상태 */
  const [isShowOptionalImplementer, setShowOptionalImplementer] = useState<boolean>(
    isOptionalImplementerRecommendation,
  )

  /** 토지 소유자 노출 여부 상태 */
  const [isShowOptionalLandOwner, setShowOptionalLandOwner] = useState<boolean>(
    isOptionalLandOwnerRecommendation,
  )

  /** 사업시행자 추가 노출   핸들러 */
  const handlerShowOptionalImplementer = (isShow: boolean) => {
    if (isShowOptionalLandOwner) {
      showAlertMessage('이미 토지 소유자가 추가 되어 있습니다.')
      return
    }

    setShowOptionalImplementer(isShow)
    if (!isShow) clearCallBack(3) // 사업시행자 초기화
  }

  /** 토지 소유자 노출   핸들러 */
  const handlerShowOptionalLandOwner = (isShow: boolean) => {
    if (isShowOptionalImplementer) {
      showAlertMessage('이미 사업시행자가 추가 되어 있습니다.')
      return
    }
    setShowOptionalLandOwner(isShow)
    if (!isShow) clearCallBack(2) //  토지 소유자 초기화
  }

  /**
   * 선택적 표시 처리 함수
   *
   * 이 함수는 주어진 추천 유형 코드(recommendTypeCode)에 따라
   * 특정 추가 정보를 표시하거나 숨기는 동작을 수행한다.
   */
  const handlerShowOptional = (recommendTypeCode: string, isShow: boolean) => {
    if (recommendTypeCode === 'CR003003') {
      handlerShowOptionalLandOwner(isShow)
    } else if (recommendTypeCode === 'CR003004') {
      handlerShowOptionalImplementer(isShow)
    }
  }

  // 시도시자 추천을 하지 않는 경우 초기화 한다.
  useEffect(() => {
    if (!isGovernorRecommendation) {
      clearCallBack(1) // 시도지사 초기화
    }
  }, [isGovernorRecommendation])

  return (
    <div>
      <TableBaseContainer title={'협의 감정평가 정보'}>
        <TableBaseHead>
          <TableBaseRow>
            <TableBaseHeadCell width={70}>추천 기관</TableBaseHeadCell>
            <TableBaseHeadCell width={90}>감정평가 법인</TableBaseHeadCell>
            <TableBaseHeadCell width={90}>협의 금액</TableBaseHeadCell>
            <TableBaseHeadCell width={90}>감정평가서</TableBaseHeadCell>
            <TableBaseHeadCell width={20}>-</TableBaseHeadCell>
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {fields.map((field, index) => {
            if (
              (field.recommendTypeCode === 'CR003002' && !isGovernorRecommendation) || // 시도 지사 추천
              (field.recommendTypeCode === 'CR003003' && !isShowOptionalLandOwner) || // 토지 소유자 노출
              (field.recommendTypeCode === 'CR003004' && !isShowOptionalImplementer) // 추가 사업 시행자 노출
            ) {
              return null // 조건에 맞지 않으면 렌더링하지 않음
            }

            // 추천 코드 이름 검색
            const recommendTypeName =
              previousAppraisalRecommendList.find(
                it => it.recommendTypeCode === field.recommendTypeCode,
              )?.recommendTypeName || ''

            return (
              <TableBaseRow key={field.recommendTypeCode}>
                <TableBaseCell align={'center'}>{recommendTypeName}</TableBaseCell>
                <TableBaseCell>
                  <input
                    type="hidden"
                    id={`receiptPreviousAppraisalRecommendList.${index}.recommendTypeCode`}
                    {...register(
                      `receiptPreviousAppraisalRecommendList.${index}.recommendTypeCode`,
                    )}
                  />
                  <InputTextBox
                    id={`receiptPreviousAppraisalRecommendList.${index}.recommendCorporationName`}
                    placeholder="추천 법인을 입력해 주세요."
                    type="text"
                    register={register}
                    error={
                      errors?.receiptPreviousAppraisalRecommendList?.[index]
                        ?.recommendCorporationName
                    }
                    rules={{
                      required: `추천 법인은 필수 입니다.`,
                    }}
                  />
                </TableBaseCell>
                <TableBaseCell>
                  <InputNumberBox
                    id={`receiptPreviousAppraisalRecommendList.${index}.recommendPrice`}
                    control={control}
                    error={errors?.receiptPreviousAppraisalRecommendList?.[index]?.recommendPrice}
                    rules={{
                      required: `법인 금액은 필수입니다.`,
                      min: {
                        value: 1000,
                        message: `법인 금액은 1000보다 크게 입력하세요.`,
                      },
                    }}
                  />
                </TableBaseCell>
                <TableBaseCell>
                  <InputSingleFileUploadBox
                    id={`receiptPreviousAppraisalRecommendList.${index}.attachment`}
                    control={control}
                    rules={{
                      required: `감정평가서를 업로드 하세요.`,
                    }}
                    simple
                  />
                </TableBaseCell>
                <TableBaseCell>
                  {['CR003003', 'CR003004'].includes(String(field.recommendTypeCode)) && (
                    <button
                      type="button"
                      onClick={() => handlerShowOptional(String(field.recommendTypeCode), false)}
                      className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      삭제
                    </button>
                  )}
                </TableBaseCell>
              </TableBaseRow>
            )
          })}
        </TableBaseBody>
      </TableBaseContainer>

      {!(isShowOptionalImplementer || isShowOptionalLandOwner) && (
        <div className="mt-6 flex  p-3 gap-2 justify-center">
          <button
            type={'button'}
            onClick={() => handlerShowOptional('CR003003', true)}
            className="px-6 py-2 rounded-md font-medium transition-all  cursor-pointer bg-green-600 text-white hover:bg-green-700"
          >
            토지 소유자 추가
          </button>
          <button
            type={'button'}
            onClick={() => handlerShowOptional('CR003004', true)}
            className="px-6 py-2 rounded-md font-medium transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
          >
            사업 시행자 추가
          </button>
        </div>
      )}
    </div>
  )
}
export default ReceiptPreviousAppraisalRecommendSection
