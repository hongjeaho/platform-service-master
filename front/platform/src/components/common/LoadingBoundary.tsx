import React from 'react'

interface LoadingBoundaryProps {
  isLoading: boolean
  fallback?: React.ReactNode
  error?: string | null
  children: React.ReactNode
}

/**
 * 로딩 상태와 에러 상태를 처리하는 경계 컴포넌트
 */
const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  isLoading,
  fallback,
  error,
  children,
}) => {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">오류가 발생했습니다</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        {fallback || <DefaultLoadingSpinner />}
      </div>
    )
  }

  return <>{children}</>
}

/**
 * 기본 로딩 스피너 컴포넌트
 */
const DefaultLoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center space-y-3">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <div className="text-sm text-gray-600">로딩 중...</div>
  </div>
)

/**
 * 인증 로딩 컴포넌트
 */
export const AuthLoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center space-y-3">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    <div className="text-xs text-gray-600">인증 정보 확인 중...</div>
  </div>
)

/**
 * 권한 체크 로딩 컴포넌트
 */
export const PermissionLoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center space-y-3">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
    <div className="text-xs text-gray-600">권한 확인 중...</div>
  </div>
)

export default LoadingBoundary
