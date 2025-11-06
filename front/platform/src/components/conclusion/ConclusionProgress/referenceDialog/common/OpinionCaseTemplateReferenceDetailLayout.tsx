import { BasicButton } from '@components/common/button'
import BasicSpinner from '@components/common/loading/BasicSpinner'
import OpinionCaseTemplateEmptySelectionMessage from '@components/conclusion/ConclusionProgress/referenceDialog/common/OpinionCaseTemplateEmptySelectionMessage'
import React from 'react'

interface ReferenceDetailLayoutProps {
  /** 선택된 항목의 ID (없으면 빈 선택 메시지 표시) */
  selectedId: number | undefined
  /** 로딩 상태 */
  isLoading: boolean
  /** 로딩 메시지 (기본값: "상세 정보를 불러오는 중...") */
  loadingMessage?: string
  /** 콘텐츠 영역 */
  children: React.ReactNode
  /** 닫기 버튼 클릭 핸들러 */
  onClose: () => void
  /** 선택 버튼 클릭 핸들러 */
  onSelect: () => void
  /** 선택 버튼 텍스트 (기본값: "선택하기") */
  selectButtonText?: string
  /** 선택 버튼 색상 클래스 */
  selectButtonClassName?: string
}

const OpinionCaseTemplateReferenceDetailLayout: React.FC<ReferenceDetailLayoutProps> = ({
  selectedId,
  isLoading,
  loadingMessage = '상세 정보를 불러오는 중...',
  children,
  onClose,
  onSelect,
  selectButtonText = '선택하기',
  selectButtonClassName = 'px-6 py-2.5 font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
}) => {
  // 선택된 항목이 없는 경우
  if (!selectedId) {
    return <OpinionCaseTemplateEmptySelectionMessage />
  }

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <BasicSpinner size="lg" />
          <p className="text-gray-500 mt-4">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col p-6 space-y-6 min-h-0">{children}</div>

      {/* 푸터 버튼 영역 */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg">
        <div className="flex justify-end gap-3">
          <BasicButton variant="outline" onClick={onClose} className="px-6 py-2.5 font-medium">
            돌아가기
          </BasicButton>
          <BasicButton onClick={onSelect} className={selectButtonClassName}>
            {selectButtonText}
          </BasicButton>
        </div>
      </div>
    </div>
  )
}

export default OpinionCaseTemplateReferenceDetailLayout
