import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputCheckBox from '@components/common/input/checkBox/InputCheckBox'
import InputDatePickerRangeBox from '@components/common/input/datePickerBox/InputDatePickerRangeBox'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { RECEIPT_PROGRESS_STATUS_OPTIONS } from '@/constants/receipt/receiptStatusOptions'
import { type GetReceiptCaseInfoListParams } from '@/model'

/**
 * ReceiptSearchFilterProps 인터페이스
 *
 * @interface ReceiptSearchFilterProps
 * @property {SubmitHandler<GetReceiptCaseInfoListParams>} onSubmit - 검색 폼 제출 시 호출되는 함수
 */
interface ReceiptSearchFilterProps {
  onSubmit: SubmitHandler<GetReceiptCaseInfoListParams>
}

/**
 * 접수 검색 필터 컴포넌트
 *
 * 사용자가 접수 목록을 검색할 수 있는 필터 폼을 제공합니다.
 * 검색 키워드, 접수일 범위, 소재지, 시행자명, 심의 진행현황 등의 필터링 옵션을 포함합니다.
 *
 * @component
 * @param {ReceiptSearchFilterProps} props - 컴포넌트 속성
 * @param {SubmitHandler<GetReceiptCaseInfoListParams>} props.onSubmit - 검색 폼 제출 시 호출되는 함수
 */
const ReceiptSearchFilter: React.FC<ReceiptSearchFilterProps> = ({ onSubmit }) => {
  /**
   * react-hook-form 훅을 사용하여 폼 상태 관리
   *
   * @property {Function} handleSubmit - 폼 제출 처리 함수
   * @property {Function} register - 입력 필드 등록 함수
   * @property {Function} reset - 폼 초기화 함수
   * @property {Object} control - 제어 컴포넌트를 위한 컨트롤 객체
   */
  const { handleSubmit, register, reset, control } = useForm<GetReceiptCaseInfoListParams>({
    defaultValues: {
      keyword: undefined,
      startRecepDt: undefined,
      endRecepDt: undefined,
      address: undefined,
      implementerNm: undefined,
      statusCodeList: [],
    },
  })

  return (
    <div className="w-full mx-auto pb-6">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 space-y-4">
            {/* 검색 키워드 */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="keyword"
                className="text-sm font-medium text-gray-700 w-40 flex-shrink-0 "
              >
                사건번호 또는 사업명
              </label>
              <InputTextBox
                id="keyword"
                placeholder="사건번호 혹은 사업명"
                type="text"
                register={register}
              />
            </div>
            {/* 접수일 */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">접수일</label>
              <InputDatePickerRangeBox
                control={control}
                startId="recepStartDt"
                endId="recepEndDt"
              />
            </div>

            {/* 소재지 & 시행자명 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700 w-40 flex-shrink-0"
                >
                  소재지
                </label>
                <InputTextBox id="address" type="text" register={register} />
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label
                  htmlFor="implementerNm"
                  className="text-sm font-medium text-gray-700 w-20 flex-shrink-0"
                >
                  시행자명
                </label>
                <InputTextBox id="implementerNm" type="text" register={register} />
              </div>
            </div>

            {/* 심의 진행현황 */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
                심의진행현황
              </label>
              <div className="flex flex-wrap gap-4">
                <InputCheckBox
                  id="statusCodeList"
                  control={control}
                  options={RECEIPT_PROGRESS_STATUS_OPTIONS}
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-4 pt-4 justify-center">
              <SearchButton type="submit" />
              <ResetButton onClick={() => reset()} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ReceiptSearchFilter
