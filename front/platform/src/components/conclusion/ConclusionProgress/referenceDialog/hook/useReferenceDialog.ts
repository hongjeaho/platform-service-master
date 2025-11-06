import { useCallback, useEffect, useRef } from 'react'

interface UseOpinionCaseTemplateReferenceParams {
  reset: () => void
  onGridRowClick: (value: any) => void
}

interface UseOpinionCaseTemplateReferenceReturn {
  onReset: () => void
  onRowSelect: (rowData: any) => void
  onContentSelect: (content: string) => void
}

const useReferenceDialog = ({
  reset,
  onGridRowClick,
}: UseOpinionCaseTemplateReferenceParams): UseOpinionCaseTemplateReferenceReturn => {
  const isInitialMount = useRef(true)

  // 메모이제이션된 리셋 함수
  const onReset = useCallback(() => {
    reset()
    onGridRowClick(undefined)
  }, [reset, onGridRowClick])

  // 행 선택 핸들러
  const onRowSelect = useCallback(
    (rowData: any) => {
      onGridRowClick(rowData)
    },
    [onGridRowClick],
  )

  // 콘텐츠 선택 핸들러 (향후 확장성을 위해 추가)
  const onContentSelect = useCallback((content: string) => {
    // 선택된 콘텐츠에 대한 추가 처리 로직
    // 예: 로깅, 분석, 사용자 행동 추적 등
    console.log('선택된 콘텐츠:', content.substring(0, 50) + '...')
  }, [])

  // 초기화 시에만 실행되도록 개선
  useEffect(() => {
    if (isInitialMount.current) {
      onReset()
      isInitialMount.current = false
    }
  }, [onReset])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 필요한 경우 정리 작업 수행
    }
  }, [])

  return {
    onReset,
    onRowSelect,
    onContentSelect,
  }
}

export default useReferenceDialog
