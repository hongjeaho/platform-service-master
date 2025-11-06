// Custom query options for Orval-generated API hooks
export const customQueryOptionsFn = (options: any = {}): any => {
  return {
    // 기본 옵션들을 먼저 설정
    staleTime: 1000 * 60 * 5, // 5분간 데이터가 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지 후 가비지 컬렉션
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
    refetchOnReconnect: true, // 네트워크 재연결 시 재요청 활성화
    retry: (failureCount: number, error: any) => {
      // 4xx 에러는 재시도하지 않음
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      // 최대 3번까지 재시도
      return failureCount < 3
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: 'always', // 에러 상태도 stale 처리하여 재요청 허용
    // 사용자 옵션을 마지막에 적용하여 덮어쓰기 허용
    ...options,
  }
}
