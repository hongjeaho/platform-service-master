/**
 * 플랫폼 전체에서 사용하는 타이포그래피 디자인 토큰
 *
 * 사용 예시:
 * import { TYPOGRAPHY } from '@/constants/design'
 * const font = TYPOGRAPHY.fontFamily.body
 */

export const TYPOGRAPHY = {
  // 폰트 패밀리
  fontFamily: {
    // 본문/UI - Noto Sans KR (가독성 우수, 공식 문서 적합)
    body: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // 제목/강조 - Nanum Gothic (한국 공공기관 친화적)
    heading: "'Nanum Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // 숫자 - Roboto (숫자 가독성 우수)
    mono: "'Roboto', 'Noto Sans KR', monospace",
  },

  // 폰트 크기
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  // 폰트 무게
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // 행간
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  },

  // 자간
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // Table 전용 타이포그래피
  table: {
    header: {
      fontSize: '0.875rem', // 14px
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '0.025em',
    },
    cell: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },
} as const

// 타입 추출
export type FontFamilyKey = keyof typeof TYPOGRAPHY.fontFamily
export type FontSizeKey = keyof typeof TYPOGRAPHY.fontSize
export type FontWeightKey = keyof typeof TYPOGRAPHY.fontWeight
