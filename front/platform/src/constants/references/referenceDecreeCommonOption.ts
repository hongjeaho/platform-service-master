import type { SelectOption } from '@/types/options'

export const decreeTypeOptions: SelectOption[] = [
  { value: undefined, label: '전체' },
  { value: 'CD001001', label: '법률' },
  { value: 'CD001002', label: '시행령' },
  { value: 'CD001003', label: '시행규칙' },
]
