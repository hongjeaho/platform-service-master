import type { BeforeAppraisalFormRequest } from '@components/receipt/receiptPreviousAppraisal/hook/useReceiptPreviousAppraisalForm'
import { useCallback } from 'react'
import { type Control, useFieldArray } from 'react-hook-form'

const useReceiptPreviousAppraisalCallBack = (control: Control<BeforeAppraisalFormRequest>) => {
  const { fields, update } = useFieldArray({
    control,
    name: `receiptPreviousAppraisalRecommendList`,
  })

  /**
   * useClearCallBack 변수는 useCallback 훅을 사용하여 선언된 함수이다.
   * 이 함수는 특정 필드 인덱스를 기반으로 해당 필드 데이터를 초기 상태로 설정한다.
   */
  const clearCallBack = useCallback((fieldIndex: number) => {
    update(fieldIndex, {
      ...fields[fieldIndex],
      recommendCorporationName: '',
      recommendPrice: 0,
      originalFileName: undefined,
      recommendFileSeq: undefined,
    })
  }, [])

  return {
    clearCallBack,
  }
}

export default useReceiptPreviousAppraisalCallBack
