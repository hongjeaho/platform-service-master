/**
 * 접수 진행 상태 옵션 (receipt 전용)
 */
export const RECEIPT_PROGRESS_STATUS_OPTIONS = [
  { value: 'CR001000', label: '미접수' },
  { value: 'CR001004', label: '접수' },
  { value: 'CR001006', label: '열람공고결과등록' },
  { value: 'CR001007', label: '의견작성' },
  { value: 'CR001008', label: '심의요청' },
] as const
