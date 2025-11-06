/**
 * 플랫폼 전체에서 사용하는 간격/여백 디자인 토큰
 *
 * 사용 예시:
 * import { SPACING } from '@/constants/design'
 * const padding = SPACING.md
 */

export const SPACING = {
  // 기본 간격 (px 단위)
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',

  // Table 전용 간격
  table: {
    cellPadding: '8px 12px', // 셀 내부 여백
    headerPadding: '8px 12px', // 헤더 내부 여백
    cellPaddingCompact: '4px 8px', // 압축 모드 셀 여백
    rowGap: '0px', // 행 간격 (border로 처리)
  },

  // Container 전용 간격
  container: {
    paddingTop: '30px', // 컨테이너 상단 여백
    marginBottom: '4px', // 제목 하단 여백
  },
} as const

// 타입 추출
export type SpacingKey = keyof typeof SPACING
export type TableSpacingKey = keyof typeof SPACING.table
