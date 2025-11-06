/**
 * 위원회 구성원 역할 코드
 */
export const CommitteeMemberRole = {
  /** 위원장 */
  CHAIRMAN: 'CA001001',
  /** 위원 */
  MEMBER: 'CA001002',
} as const

/**
 * 위원회 구성원 역할 라벨 매핑
 */
export const CommitteeMemberRoleLabel = {
  [CommitteeMemberRole.CHAIRMAN]: '위원장',
  [CommitteeMemberRole.MEMBER]: '위원',
} as const
