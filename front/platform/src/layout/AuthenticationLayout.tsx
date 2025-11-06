import React from 'react'
import { Outlet } from 'react-router-dom'

import LoadingBoundary, { AuthLoadingSpinner } from '@/components/common/LoadingBoundary'
import { useRouteGuard } from '@/hooks/useRouteGuard'

/**
 * 인증 및 권한이 필요한 페이지를 보호하는 레이아웃 컴포넌트
 * - 하이드레이션 안전한 인증 체크
 * - 자동 권한 검증 및 리다이렉션
 * - 선언적 접근 방식으로 간소화
 */
const AuthenticationLayout: React.FC = () => {
  // 라우트 가드로 모든 권한 체크 처리
  const routeGuard = useRouteGuard({
    requireAuth: true,
    // requiredRoles는 현재 경로에서 자동 결정
    // 사건별 권한 체크는 useRouteGuard 내부에서 자동 처리
  })

  return (
    <LoadingBoundary isLoading={routeGuard.isGuarding} fallback={<AuthLoadingSpinner />}>
      <div
        style={{
          height: '100%',
          margin: 0,
        }}
      >
        <Outlet />
      </div>
    </LoadingBoundary>
  )
}

export default AuthenticationLayout
