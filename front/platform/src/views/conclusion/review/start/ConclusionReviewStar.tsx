// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import { BasicButton } from '@components/common/button'
import ContainerCenter from '@components/common/ContainerCenter'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import MainTitle from '@components/common/MainTitle'
import useConclusionStartSubmit from '@components/conclusion/conclusionStart/hook/useConclusionStartSubmit'
import OpinionCaseTemplateCommentTabSection from '@components/opinion/template/comment/OpinionCaseTemplateCommentTabSection'
import ReceiptAttachmentFileView from '@components/receipt/receiptAttachment/ReceiptAttachmentFileView'
import ReceiptCaseInfoView from '@components/receipt/receiptCaseInfo/ReceiptCaseInfoView'
import ReceiptPreviousAppraisalView from '@components/receipt/receiptPreviousAppraisal/ReceiptPreviousAppraisalView'
import useOpinionCaseTemplateCommitList from '@components/receipt/receiptTemplateOpinion/hook/useOpinionCaseTemplateCommitList'
import ReceiptTotalQuantityReportView from '@components/receipt/receiptTotalQuantityReport/ReceiptTotalQuantityReportView'
import useGetJudgSeq from '@hooks/useGetJudgSeq'
import { useShowAlertMessageCallBack } from '@store/message'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// 3. API 및 타입
import { useGetConclusionCurrentStatusCode } from '@/api/conclusion-base-api/conclusion-base-api'
import { useGetReceiptCurrentStatusCode } from '@/api/receipt-base-api/receipt-base-api'

// 4. 스타일
import styles from '../conclusionReview.module.css'

/**
 * 심의서 검토 시작 페이지 컴포넌트
 * - URL 파라미터에서 judgSeq 추출
 * - 접수 상태 코드 및 검토 상태 코드 조회
 * - 접수 검토 요청(CR001007) 및 재결관 검토 대기(CC001000) 상태만 접근 가능
 * - 검토 시작 확인 기능 제공
 */
const ConclusionReviewStar: React.FC = () => {
  // URL 파라미터에서 심의서 번호 추출
  const judgSeq = useGetJudgSeq()

  // 접수 상태 코드 조회 (캐싱 없이 항상 최신 데이터 조회)
  const { data: receiptCurrentStatusCode, isLoading: isReceiptCurrentStatusCodeLoading } =
    useGetReceiptCurrentStatusCode(judgSeq, {
      query: {
        staleTime: 0, // 0분 동안 fresh 상태 유지
      },
    })

  // 검토 상태 코드 조회 (캐싱 없이 항상 최신 데이터 조회)
  const { data: conclusionCurrentStatusCode, isLoading: isConclusionCurrentStatusCodeLoading } =
    useGetConclusionCurrentStatusCode(judgSeq, {
      query: {
        staleTime: 0, // 0분 동안 fresh 상태 유지
      },
    })

  // 알림 메시지 및 네비게이션
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const navigate = useNavigate()

  // 폼 제출 (검토 시작)
  const { onSubmit } = useConclusionStartSubmit(judgSeq)

  // 의견 커밋 목록 관리
  const { opinionCaseTemplateCommitList } = useOpinionCaseTemplateCommitList()

  /**
   * 심의서 검토 유효성 검증
   * - 접수 검토 요청 상태(CR001007)가 아니면 접근 불가
   * - 재결관 검토 대기 상태(CC001000)가 아니면 접근 불가
   */
  useEffect(() => {
    const isInvalidStatus =
      receiptCurrentStatusCode !== 'CR001007' || conclusionCurrentStatusCode !== 'CC001000'

    if (isInvalidStatus) {
      showAlertMessageCallBack('잘못된 접근입니다.', () => {
        navigate('/conclusion/application')
      })
    }
  }, [conclusionCurrentStatusCode, receiptCurrentStatusCode, showAlertMessageCallBack, navigate])

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isConclusionCurrentStatusCodeLoading || isReceiptCurrentStatusCodeLoading) {
    return <SkeletonLoading />
  }

  return (
    <>
      <MainTitle title={'심의서 검토 확인'} />
      <ContainerCenter>
        <div>
          {/* 시행자 사건 정보 섹션 */}
          <ReceiptCaseInfoView judgSeq={judgSeq} />

          {/* 사전 협의 평가 정보 섹션 */}
          <ReceiptPreviousAppraisalView judgSeq={judgSeq} />

          {/* 총물량조서 섹션 */}
          <ReceiptTotalQuantityReportView judgSeq={judgSeq} />

          {/* 사건 파일 업로드 정보 섹션 */}
          <ReceiptAttachmentFileView judgSeq={judgSeq} />

          {/* 사업시행자 의견 (읽기 전용) */}
          <div className={styles.sectionSpacing}>
            <OpinionCaseTemplateCommentTabSection
              type={'read'}
              opinionCaseTemplateCommitList={opinionCaseTemplateCommitList}
            />
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          <div className={styles.buttonContainer}>
            <BasicButton variant={'outline'} type={'button'}>
              <Link to={'/conclusion/application'}> 목록 보기</Link>
            </BasicButton>
            <BasicButton type={'submit'}>검토 확인</BasicButton>
          </div>
        </form>
      </ContainerCenter>
    </>
  )
}

export default ConclusionReviewStar
