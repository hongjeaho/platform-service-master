// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import { BasicButton } from '@components/common/button'
import ContainerCenter from '@components/common/ContainerCenter'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import MainTitle from '@components/common/MainTitle'
import ConclusionProgressFormSection from '@components/conclusion/ConclusionProgress/conclusionSection/ConclusionProgressFormSection'
import useConclusionProgressForm from '@components/conclusion/ConclusionProgress/hook/useConclusionProgressForm'
import useConclusionProgressSubmit from '@components/conclusion/ConclusionProgress/hook/useConclusionProgressSubmit'
import OpinionCaseTemplateCommentTabSection from '@components/opinion/template/comment/OpinionCaseTemplateCommentTabSection'
import useOpinionCaseTemplateCommitList from '@components/receipt/receiptTemplateOpinion/hook/useOpinionCaseTemplateCommitList'
import LTISBusinessSummary from '@components/reptInfo/LTISBusinessSummary'
import useGetJudgSeq from '@hooks/useGetJudgSeq'
import { useShowAlertMessageCallBack } from '@store/message'
import type { ConclusionLocationState } from '@views/conclusion/review/type/conclusionRouter'
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// 3. API 및 타입
import { useGetConclusionCurrentStatusCode } from '@/api/conclusion-base-api/conclusion-base-api'

// 4. 스타일
import styles from '../conclusionReview.module.css'

/**
 * 심의서 검토 진행 페이지 컴포넌트
 * - URL 파라미터에서 judgSeq 추출
 * - 현재 심의서 상태 코드 조회
 * - 재결관 검토 진행중(CC001001) 상태만 접근 가능
 * - 검토 의견 작성 및 제출 기능 제공
 */
const ConclusionReviewProgress: React.FC = () => {
  // URL 파라미터에서 심의서 번호 추출
  const judgSeq = useGetJudgSeq()

  // 현재 심의서 상태 코드 조회 (캐싱 없이 항상 최신 데이터 조회)
  const { data: statusCode, isLoading } = useGetConclusionCurrentStatusCode(judgSeq, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  // 폼 제출 관련 훅
  const { handleSubmit } = useConclusionProgressForm()
  const { onSubmit } = useConclusionProgressSubmit(judgSeq)

  // 알림 메시지 및 네비게이션
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as ConclusionLocationState

  // 의견 커밋 목록 관리
  const { opinionCaseTemplateCommitList, onCommitListRefetch } = useOpinionCaseTemplateCommitList()

  /**
   * 심의서 검토 상태 유효성 검증
   * 재결관 검토 진행중(CC001001)이 아니라면 목록 페이지로 이동
   */
  useEffect(() => {
    if (statusCode !== 'CC001001' && locationState?.statusCode !== 'CC001001') {
      showAlertMessageCallBack('잘못된 접근입니다', () => {
        navigate('/conclusion/application')
      })
    }
  }, [statusCode, locationState, showAlertMessageCallBack, navigate])

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoading) {
    return <SkeletonLoading />
  }

  return (
    <div>
      <MainTitle title={'심의서 검토'} />
      <ContainerCenter>
        {/* 사업 요약 정보 */}
        <LTISBusinessSummary judgSeq={judgSeq} />

        <div className={styles.sectionSpacing}>
          {/* 의견 코멘트 탭 섹션 */}
          <OpinionCaseTemplateCommentTabSection
            onCommitListRefetch={onCommitListRefetch}
            opinionCaseTemplateCommitList={opinionCaseTemplateCommitList}
          />

          {/* 재결관 검토 의견 섹션 */}
          <ConclusionProgressFormSection type="write" />
        </div>

        {/* 하단 버튼 영역 */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <div className={styles.buttonContainer}>
            <BasicButton variant={'outline'} type={'button'}>
              <Link to={'/conclusion/application'}> 목록 보기</Link>
            </BasicButton>
            <BasicButton type={'submit'}>검토 완료하기</BasicButton>
          </div>
        </form>
      </ContainerCenter>
    </div>
  )
}

export default ConclusionReviewProgress
