import PasswordChangeForm from '@components/account/PasswordChangeForm'
import { Key } from 'lucide-react'
import React from 'react'

interface PasswordChangeSectionProps {
  isEditing: boolean
  onEditToggle: () => void
  onSuccess: () => void
  onCancel: () => void
}

/**
 * 비밀번호 변경 섹션 컴포넌트
 * - React.memo()로 불필요한 재렌더링 방지
 * - ProfileInfoSection과 동일한 패턴 적용
 */
const PasswordChangeSection: React.FC<PasswordChangeSectionProps> = ({
  isEditing,
  onEditToggle,
  onSuccess,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Key className="w-5 h-5" />
          비밀번호 변경
        </h3>
        {!isEditing && (
          <button
            onClick={onEditToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium cursor-pointer"
          >
            비밀번호 변경
          </button>
        )}
      </div>

      {isEditing ? (
        <PasswordChangeForm onSuccess={onSuccess} onCancel={onCancel} />
      ) : (
        <p className="text-gray-600 text-sm">
          보안을 위해 주기적으로 비밀번호를 변경하는 것을 권장합니다.
        </p>
      )}
    </div>
  )
}

// React.memo()로 래핑하여 props 변경 시에만 렌더링
export default React.memo(PasswordChangeSection)
