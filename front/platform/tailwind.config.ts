import type { Config } from 'tailwindcss'

import { COLORS, SPACING, TYPOGRAPHY } from './src/constants/design'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 색상 확장
      colors: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        table: COLORS.table,
        semantic: COLORS.semantic,
        neutral: COLORS.neutral,
        background: COLORS.background,
      },
      // 간격 확장
      spacing: {
        xs: SPACING.xs,
        sm: SPACING.sm,
        md: SPACING.md,
        lg: SPACING.lg,
        xl: SPACING.xl,
        '2xl': SPACING['2xl'],
        '3xl': SPACING['3xl'],
        '4xl': SPACING['4xl'],
      },
      // 폰트 패밀리 확장
      fontFamily: {
        body: TYPOGRAPHY.fontFamily.body.split(','),
        heading: TYPOGRAPHY.fontFamily.heading.split(','),
        mono: TYPOGRAPHY.fontFamily.mono.split(','),
      },
      // 폰트 크기 확장
      fontSize: {
        xs: TYPOGRAPHY.fontSize.xs,
        sm: TYPOGRAPHY.fontSize.sm,
        base: TYPOGRAPHY.fontSize.base,
        lg: TYPOGRAPHY.fontSize.lg,
        xl: TYPOGRAPHY.fontSize.xl,
        '2xl': TYPOGRAPHY.fontSize['2xl'],
        '3xl': TYPOGRAPHY.fontSize['3xl'],
        '4xl': TYPOGRAPHY.fontSize['4xl'],
      },
      // 폰트 무게 확장
      fontWeight: {
        normal: TYPOGRAPHY.fontWeight.normal,
        medium: TYPOGRAPHY.fontWeight.medium,
        semibold: TYPOGRAPHY.fontWeight.semibold,
        bold: TYPOGRAPHY.fontWeight.bold,
        extrabold: TYPOGRAPHY.fontWeight.extrabold,
      },
      // 행간 확장
      lineHeight: {
        tight: TYPOGRAPHY.lineHeight.tight,
        normal: TYPOGRAPHY.lineHeight.normal,
        relaxed: TYPOGRAPHY.lineHeight.relaxed,
        loose: TYPOGRAPHY.lineHeight.loose,
      },
      // 자간 확장
      letterSpacing: {
        tight: TYPOGRAPHY.letterSpacing.tight,
        normal: TYPOGRAPHY.letterSpacing.normal,
        wide: TYPOGRAPHY.letterSpacing.wide,
        wider: TYPOGRAPHY.letterSpacing.wider,
      },
    },
  },
  plugins: [],
}

export default config
