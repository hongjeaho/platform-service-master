import React from 'react'

const OpinionCaseTemplateEmptySelectionMessage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <p>항목을 선택해주세요</p>
        <p className="text-sm mt-2">
          좌측 그리드에서 행을 클릭하면
          <br />
          상세 정보를 확인할 수 있습니다.
        </p>
      </div>
    </div>
  )
}

export default OpinionCaseTemplateEmptySelectionMessage
