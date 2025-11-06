// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import FullScreenDialog from '@components/common/ui/dialog/FullScreenDialog'
import ReferenceDialogSkeleton from '@components/conclusion/ConclusionProgress/referenceDialog/ReferenceDialogSkeleton'
import React, { lazy, Suspense, useMemo, useState } from 'react'

// 3. LAZY 로딩으로 컴포넌트들 import
const ConclusionReference = lazy(() => import('./conclusion/./ConclusionReference'))
const ConclusionReferenceDetail = lazy(() => import('./conclusion/./ConclusionReferenceDetail'))
const DecreeReference = lazy(() => import('./decree/./DecreeReference'))
const DecreeReferenceDetail = lazy(() => import('./decree/DecreeReferenceDetail'))
const PrecedentReference = lazy(() => import('./precedent/./PrecedentReference'))
const PrecedentReferenceDetail = lazy(() => import('./precedent/PrecedentReferenceDetail'))

// 4. 스타일
import styles from './ReferenceDialog.module.css'

interface ReferenceDialogProps {
  open: boolean
  referenceType: 'conclusion' | 'decree' | 'precedent'
  onClose: () => void
  onSelect: (decreeContent: string) => void
}

const ReferenceDialog: React.FC<ReferenceDialogProps> = ({
  open,
  onClose,
  referenceType,
  onSelect,
}) => {
  const [selectedSeq, setSelectedSeq] = useState<number>()
  const formId = 'opinionCaseTemplateForm'

  const referenceTypeName = useMemo(
    () => ({
      conclusion: '검토의견',
      decree: '법령',
      precedent: '판례',
    }),
    [referenceType],
  )

  const renderLeftComponent = () => {
    switch (referenceType) {
      case 'conclusion':
        return <ConclusionReference gridRowId={selectedSeq} onGridRowClick={setSelectedSeq} />
      case 'decree':
        return <DecreeReference gridRowId={selectedSeq} onGridRowClick={setSelectedSeq} />
      case 'precedent':
        return <PrecedentReference gridRowId={selectedSeq} onGridRowClick={setSelectedSeq} />
      default:
        return null
    }
  }

  const renderRightComponent = () => {
    switch (referenceType) {
      case 'conclusion':
        return (
          <ConclusionReferenceDetail
            conclusionOpinionSeq={selectedSeq}
            onClose={onClose}
            onSelect={onSelect}
          />
        )
      case 'decree':
        return (
          <DecreeReferenceDetail
            decreeDetailSeq={selectedSeq}
            onClose={onClose}
            onSelect={onSelect}
          />
        )
      case 'precedent':
        return (
          <PrecedentReferenceDetail
            precedentSeq={selectedSeq}
            onClose={onClose}
            onSelect={onSelect}
          />
        )
      default:
        return null
    }
  }

  return (
    <FullScreenDialog
      formId={formId}
      isOpen={open}
      onClose={onClose}
      title={referenceTypeName[referenceType]}
      submitButtonName={'적용'}
    >
      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        <Suspense fallback={<ReferenceDialogSkeleton />}>
          {/* Left Panel - 검색 필터 + 그리드 */}
          <div className={styles.leftPanel}>{renderLeftComponent()}</div>
          {/* Right Panel - 상세 내용 */}
          <div className={styles.rightPanel}>{renderRightComponent()}</div>
        </Suspense>
      </div>
    </FullScreenDialog>
  )
}
export default ReferenceDialog
