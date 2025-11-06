/**
 * 플랫폼 전체에서 사용하는 색상 디자인 토큰
 *
 * 사용 예시:
 * import { COLORS } from '@/constants/design'
 * const bgColor = COLORS.primary.main
 */

export const COLORS = {
  // Primary 색상 - 정부/공공 블루
  primary: {
    main: '#274ba9', // 메인 블루
    dark: '#005dab', // 진한 블루
    light: '#0663b2', // 밝은 블루
    lighter: '#e7f3ff', // 매우 밝은 블루 (배경용)
  },

  // Secondary 색상 - 회색 계열
  secondary: {
    main: '#e7e8ea', // 메인 회색
    dark: '#9f9f9f', // 진한 회색
    light: '#f3f4f6', // 밝은 회색
    lighter: '#f9fafb', // 매우 밝은 회색
  },

  // Table 전용 색상
  table: {
    // 헤더
    headerBg: '#e7e8ea', // 헤더 배경
    headerText: '#0663b2', // 헤더 텍스트
    headerBorder: '#9f9f9f', // 헤더 하단 테두리

    // 테두리
    borderPrimary: '#005dab', // 주요 테두리
    borderSecondary: '#9f9f9f', // 보조 테두리
    borderLight: '#f3f4f6', // 연한 테두리

    // 셀 배경
    cellBg: '#ffffff', // 기본 셀 배경
    cellBgEven: '#f9fafb', // 짝수 행 배경
    cellBgHover: '#eff6ff', // 호버 배경
    cellBgSelected: '#dbeafe', // 선택된 행 배경
    cellBgClicked: '#bfdbfe', // 클릭된 행 배경

    // 텍스트
    cellText: '#374151', // 셀 텍스트
  },

  // Semantic 색상
  semantic: {
    success: '#10b981', // 성공
    warning: '#f59e0b', // 경고
    error: '#ef4444', // 에러
    info: '#3b82f6', // 정보
  },

  // Neutral 색상 (Gray Scale)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // 배경 색상
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // 모던 블루 그라데이션 (DataGrid용)
  gradient: {
    blue: {
      from: '#3b82f6',
      to: '#1e3a8a',
    },
    blueLight: {
      from: '#eff6ff',
      to: '#e0f2fe',
    },
  },
} as const

// 타입 추출
export type ColorKey = keyof typeof COLORS
export type PrimaryColorKey = keyof typeof COLORS.primary
export type TableColorKey = keyof typeof COLORS.table
