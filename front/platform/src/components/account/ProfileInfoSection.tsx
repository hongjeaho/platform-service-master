import { Loader2, Mail, Shield, User } from 'lucide-react'
import React from 'react'

import type { ProfileResponse } from '@/model'

interface ProfileInfoSectionProps {
  profile: ProfileResponse | undefined
  isLoading: boolean
  error: Error | null
}

/**
 * 프로필 정보 섹션 컴포넌트
 * - React.memo()로 불필요한 재렌더링 방지
 * - profile, isLoading, error props가 변경될 때만 렌더링
 */
const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ profile, isLoading, error }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        프로필 정보
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">프로필 정보를 불러오는데 실패했습니다.</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">이름</div>
              <div className="text-base font-medium text-gray-800">{profile?.userName || '-'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">이메일</div>
              <div className="text-base font-medium text-gray-800">{profile?.userEmail || '-'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">아이디</div>
              <div className="text-base font-medium text-gray-800">{profile?.userId || '-'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">권한</div>
              <div className="flex flex-wrap gap-2">
                {profile?.roleNames && profile.roleNames.length > 0 ? (
                  profile.roleNames.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">권한 없음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// React.memo()로 래핑하여 props 변경 시에만 렌더링
export default React.memo(ProfileInfoSection)
