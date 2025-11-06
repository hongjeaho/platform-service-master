import type { UserRole } from '@/constants/auth/permissions'
import type { AuthUser } from '@/model/authUser'
import type { BasicAuthority } from '@/model/basicAuthority'

/**
 * 인증 상태 타입 정의
 */

/** 인증 상태 */
export interface AuthStatus {
  isLoading: boolean
  isAuthenticated: boolean
  user: AuthUser | null
  isHydrated: boolean // 하이드레이션 완료 여부
}

/** 권한 체크 결과 */
export interface PermissionResult {
  hasAccess: boolean
  isLoading: boolean
  requiredRoles?: UserRole[]
  userRoles?: UserRole[]
}

/** 라우트 가드 설정 */
export interface RouteGuardConfig {
  requireAuth?: boolean
  requiredRoles?: UserRole[]
  redirectTo?: string
}

/** 하이드레이션 안전한 사용자 데이터 */
export interface HydratedUserData {
  user: AuthUser | null
  roles: BasicAuthority[]
  isHydrated: boolean
}

/** 권한 체크 옵션 */
export interface PermissionCheckOptions {
  requireAuth?: boolean
  requiredRoles?: UserRole[]
  checkCaseAccess?: boolean
  judgSeq?: number
}
