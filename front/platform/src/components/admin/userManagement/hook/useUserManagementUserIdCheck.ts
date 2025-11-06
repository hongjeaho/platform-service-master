import { useEffect, useState } from 'react'

import { useHasAdminUserManagementUserIdCheck } from '@/api/admin-user-management-api/admin-user-management-api'

const useUserManagementUserIdCheck = (userId?: string) => {
  const [isChecked, setIsChecked] = useState(false)
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null)

  const { data, refetch, isLoading } = useHasAdminUserManagementUserIdCheck(
    userId ? { userId } : undefined,
    { query: { enabled: false } }, // 수동으로만 실행
  )

  const handleUserIdCheck = async () => {
    if (!userId?.trim()) return

    try {
      const result = await refetch()
      setIsChecked(true)
      setCheckedUserId(userId)
      return result.data
    } catch (error) {
      setIsChecked(false)
      setCheckedUserId(null)
      throw error
    }
  }

  // 아이디가 변경되면 체크 상태 초기화
  useEffect(() => {
    if (checkedUserId && checkedUserId !== userId) {
      setIsChecked(false)
      setCheckedUserId(null)
    }
  }, [userId, checkedUserId])

  const isCurrentUserIdChecked = isChecked && checkedUserId === userId
  const isDuplicate = data === true // true면 중복(사용중), false면 사용가능

  return {
    handleUserIdCheck,
    isLoading,
    isChecked: isCurrentUserIdChecked,
    isDuplicate,
    data,
  }
}

export default useUserManagementUserIdCheck
