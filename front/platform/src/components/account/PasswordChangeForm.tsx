import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import { Loader2 } from 'lucide-react'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useUpdatePassword } from '@/api/account-security-api/account-security-api'
import type { PasswordUpdateRequest } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface PasswordForm extends PasswordUpdateRequest {
  confirmPassword: string
}

interface PasswordChangeFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * 비밀번호 변경 폼 컴포넌트
 * - React.memo()로 불필요한 재렌더링 방지
 * - useCallback으로 이벤트 핸들러 메모이제이션
 * - 글로벌 메시지 상태 관리 (useShowAlertMessage)
 */
const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onSuccess, onCancel }) => {
  const showAlertMessage = useShowAlertMessage()

  // 비밀번호 변경 mutation
  const { mutate: updatePassword, isPending } = useUpdatePassword({
    mutation: {
      onSuccess: () => {
        // 폼 초기화
        reset()

        // 전역 메시지 표시 (codebase 표준 패턴)
        showAlertMessage('비밀번호가 성공적으로 변경되었습니다.')

        // 부모 컴포넌트에 알림
        onSuccess?.()
      },
      onError: error => {
        const errorMessage = error?.message || '비밀번호 변경에 실패했습니다.'

        // 전역 메시지 표시 (codebase 표준 패턴)
        showAlertMessage(errorMessage)
      },
    },
  })

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<PasswordForm>()

  // useCallback으로 이벤트 핸들러 메모이제이션
  const onSubmitPassword = useCallback(
    (data: PasswordForm) => {
      updatePassword({
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      })
    },
    [updatePassword],
  )

  const handleCancelPasswordEdit = useCallback(() => {
    reset()
    onCancel?.()
  }, [reset, onCancel])

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
          <InputTextBox
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
            register={register}
            rules={{
              required: '현재 비밀번호를 입력해주세요',
            }}
            error={errors.currentPassword}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
          <InputTextBox
            id="newPassword"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            register={register}
            rules={{
              required: '새 비밀번호를 입력해주세요',
              minLength: {
                value: 5,
                message: '비밀번호는 최소 5자 이상이어야 합니다',
              },
            }}
            error={errors.newPassword}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
          <InputTextBox
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호를 다시 입력하세요"
            register={register}
            rules={{
              required: '비밀번호 확인을 입력해주세요',
              validate: (value: string) =>
                value === getValues('newPassword') || '비밀번호가 일치하지 않습니다',
            }}
            error={errors.confirmPassword}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancelPasswordEdit}
            disabled={isPending}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                변경 중...
              </>
            ) : (
              '변경'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// React.memo()로 래핑하여 props 변경 시에만 렌더링
export default React.memo(PasswordChangeForm)
