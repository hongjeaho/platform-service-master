import { useCallback } from 'react'

import { useGetOpinionCaseTemplateCommitList } from '@/api/opinion-base-api/opinion-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'

const useOpinionCaseTemplateCommitList = () => {
  /**
   * 현재 재결일련번호(judgSeq)를 가져오는 커스텀 훅
   * 이 값은 API 호출 및 컴포넌트 렌더링에 필요한 핵심 식별자입니다.
   */
  const judgSeq = useGetJudgSeq()

  /**
   * 의견 목록 조회 API 호출
   * judgSeq를 기반으로 현재 케이스에 등록된 사업시행자 의견 목록을 가져옵니다.
   * staleTime을 0으로 설정하여 항상 최신 데이터를 조회합니다.
   */
  const {
    data: opinionCaseTemplateCommitList, // 의견 목록 데이터
    isLoading: isLoadingOpinion, // 로딩 상태
    isRefetching: isRefetchingOpinion, // 재조회 상태
    refetch,
  } = useGetOpinionCaseTemplateCommitList(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지 (항상 최신 데이터 조회)
    },
  })

  /**
   * onCommitListRefetch는 재결 목록 데이터를 갱신하기 위해 사용되는 함수입니다.
   * refetch 함수를 의존성으로 하여 useCallback으로 생성됩니다.
   * 이 함수는 재결일련번호(juseSeq)와 관련된 리스트를 다시 불러오는 역할을 합니다.
   */
  const onCommitListRefetch = useCallback(() => {
    void refetch()
  }, [refetch])

  return {
    opinionCaseTemplateCommitList,
    isLoadingOpinion,
    isRefetchingOpinion,
    onCommitListRefetch,
  }
}

export default useOpinionCaseTemplateCommitList
