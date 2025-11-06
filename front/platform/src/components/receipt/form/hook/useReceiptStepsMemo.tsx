import { Calculator, Edit3, FileSearch, FileText, MessageSquare, Paperclip } from 'lucide-react'
import { lazy, useMemo, useState } from 'react'

import { RECEIPT_STEP_CODES } from '@/constants/receipt/receiptSteps'

/**
 * 각 단계별 컴포넌트를 지연 로딩(lazy loading)으로 정의
 * 필요한 시점에만 로드되어 초기 로딩 시간을 단축시킵니다.
 */
const ReceiptCaseInfoForm = lazy(
  () => import('@components/receipt/receiptCaseInfo/ReceiptCaseInfoForm'),
)

const ReceiptAttachmentFileForm = lazy(
  () => import('@components/receipt/receiptAttachment/ReceiptAttachmentFileForm'),
)
const ReceiptTotalQuantityReportForm = lazy(
  () => import('@components/receipt/receiptTotalQuantityReport/ReceiptTotalQuantityReportForm'),
)
const ReceiptPreviousAppraisalForm = lazy(
  () => import('@components/receipt/receiptPreviousAppraisal/ReceiptPreviousAppraisalForm'),
)
const ReceiptNoticeResultForm = lazy(
  () => import('@components/receipt/receiptNoticeResult/ReceiptNoticeResultForm'),
)
const ReceiptTemplateOpinionForm = lazy(
  () => import('@components/receipt/receiptTemplateOpinion/ReceiptTemplateOpinionForm'),
)

/**
 * 접수 단계 관리를 위한 커스텀 훅
 *
 * @param completedCode - 완료된 마지막 단계의 코드 (예: 'CR001003')
 * @returns 단계 데이터, 현재 단계 및 단계 설정 함수를 포함하는 객체
 */
const useReceiptStepsMemo = (completedCode: string | undefined) => {
  /**
   * 완료된 마지막 단계의 인덱스를 계산
   * completedCode와 일치하는 단계의 인덱스를 찾음
   */
  const lastCompletedIndex = useMemo(() => {
    return receiptSteps.findIndex(s => s.code === completedCode)
  }, [completedCode])

  /**
   * 초기 단계 데이터 생성
   * 각 단계의 completed 속성을 lastCompletedIndex를 기준으로 설정
   */
  const initialSteps = useMemo(() => {
    return receiptSteps.map((step, index) => {
      return {
        ...step,
        completed:
          completedCode === RECEIPT_STEP_CODES.COMPLETED ? true : index < lastCompletedIndex,
      }
    })
  }, [completedCode, lastCompletedIndex])

  // 단계 데이터 상태 관리
  const [stepsData, setStepData] = useState(initialSteps)

  // 현재 활성화된 단계 상태 관리 (최소값은 0)
  const [currentStep, setCurrentStep] = useState(() => Math.max(lastCompletedIndex, 0))

  const handleComplete = (stepIndex: number) => {
    const newSteps = [...stepsData]
    newSteps[stepIndex].completed = true
    setStepData(newSteps)
  }

  return {
    stepsData, // 모든 단계 데이터 배열
    currentStep, // 현재 활성화된 단계 인덱스
    setCurrentStep, // 현재 단계를 변경하는 함수
    stepComplete: handleComplete, // 완료 처리를 한다.
  }
}

/**
 * 접수 프로세스의 모든 단계 정의
 * 각 단계는 다음 속성을 포함:
 * - label: 단계 이름
 * - code: 단계 식별 코드 (예: 'CR001001')
 * - icon: 단계를 나타내는 아이콘 컴포넌트
 * - completed: 단계 완료 여부 (기본값: false)
 * - formId: 해당 단계의 폼 ID
 * - component: 해당 단계에서 렌더링할 컴포넌트
 */
const receiptSteps = [
  {
    label: '사업 개요',
    code: RECEIPT_STEP_CODES.BUSINESS_OVERVIEW,
    icon: FileText,
    completed: false,
    formId: 'receiptCaseInfoForm',
    component: ReceiptCaseInfoForm,
  },
  {
    label: '총 물량조서',
    code: RECEIPT_STEP_CODES.TOTAL_QUANTITY,
    icon: Calculator,
    completed: false,
    formId: 'receiptTotalQuantityReport',
    component: ReceiptTotalQuantityReportForm,
  },
  {
    label: '협의 감정평가 정보',
    code: RECEIPT_STEP_CODES.PREVIOUS_APPRAISAL,
    icon: FileSearch,
    completed: false,
    formId: 'receiptPreviousAppraisalForm',
    component: ReceiptPreviousAppraisalForm,
  },
  {
    label: '첨부 파일',
    code: RECEIPT_STEP_CODES.ATTACHMENT,
    icon: Paperclip,
    completed: false,
    formId: 'receiptAttachmentFileForm',
    component: ReceiptAttachmentFileForm,
  },
  {
    label: '열람공고 결과 작성',
    code: RECEIPT_STEP_CODES.NOTICE_RESULT,
    icon: Edit3,
    completed: false,
    formId: 'receiptNoticeResultForm',
    component: ReceiptNoticeResultForm,
  },
  {
    label: '의견 작성',
    code: RECEIPT_STEP_CODES.OPINION,
    icon: MessageSquare,
    completed: false,
    formId: 'receiptTemplateOpinionForm',
    component: ReceiptTemplateOpinionForm,
  },
]
export default useReceiptStepsMemo
