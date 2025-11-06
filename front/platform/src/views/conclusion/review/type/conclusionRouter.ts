/**
 * Conclusion (결론서) React Router 관련 타입 정의
 */

/**
 * 결론서(Conclusion) 관련 라우터 위치 상태
 * - progress, start, complete 등의 페이지에서 사용
 */
export interface ConclusionLocationState {
  /**
   * 심의서 상태 코드
   * - CC001001: 재결관 검토 진행중
   * - CC001002: 재결관 검토 완료
   * - 등등...
   */
  statusCode: string | undefined | null
}
