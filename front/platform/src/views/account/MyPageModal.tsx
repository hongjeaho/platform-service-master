import PasswordChangeSection from '@components/account/PasswordChangeSection'
import ProfileInfoSection from '@components/account/ProfileInfoSection'
import BasicDialog from '@components/common/ui/dialog/BasicDialog'
import React, { useCallback, useState } from 'react'

import { useGetProfile } from '@/api/account-profile-api/account-profile-api'
import { useAuth } from '@/hooks/useAuth'

interface MyPageModalProps {
  isOpen: boolean
  onClose: () => void
}

const MyPageModal: React.FC<MyPageModalProps> = ({ isOpen, onClose }) => {
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  // 프로필 조회
  const { userData, isReady, isHydrated } = useAuth()
  const userSeq = userData.user?.seq

  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfile({
    query: {
      enabled: isOpen && isReady && isHydrated && !!userSeq,
    },
  })

  // 비밀번호 변경 성공 시 편집 모드 종료
  const handlePasswordChangeSuccess = useCallback(() => {
    setIsEditingPassword(false)
  }, [])

  // 비밀번호 변경 취소 시 편집 모드 종료
  const handlePasswordChangeCancel = useCallback(() => {
    setIsEditingPassword(false)
  }, [])

  // 모달 닫을 때 scroll 복원
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <BasicDialog isOpen={isOpen} onClose={handleClose} title="마이페이지" hideFooter={true}>
      <div className="space-y-6">
        {/* 프로필 정보 섹션 */}
        <ProfileInfoSection profile={profile} isLoading={isLoading} error={error} />

        {/* 비밀번호 변경 섹션 */}
        <PasswordChangeSection
          isEditing={isEditingPassword}
          onEditToggle={() => setIsEditingPassword(true)}
          onSuccess={handlePasswordChangeSuccess}
          onCancel={handlePasswordChangeCancel}
        />
      </div>
    </BasicDialog>
  )
}

export default MyPageModal
