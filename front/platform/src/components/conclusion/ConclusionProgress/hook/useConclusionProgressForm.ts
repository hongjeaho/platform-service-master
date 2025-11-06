import type { UseFormProps, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'

/**
 * 재결관 검토 진행 폼 관리 훅 (범용)
 * @param options - React Hook Form 옵션
 * @returns React Hook Form 인스턴스
 */
const useConclusionProgressForm = <
  TFieldValues extends Record<string, unknown> = Record<string, unknown>,
>(
  options?: UseFormProps<TFieldValues>,
): UseFormReturn<TFieldValues> => {
  return useForm<TFieldValues>(options)
}

export default useConclusionProgressForm
