import BasicButton from '@components/common/button/BasicButton'
import { GitCompare } from 'lucide-react'
import React from 'react'

interface CompareButtonProps {
  selectedCount: number
  onCompareClick: () => void
}

const KakaoMapCompareButton: React.FC<CompareButtonProps> = ({ selectedCount, onCompareClick }) => {
  const isDisabled = selectedCount < 2

  return (
    <BasicButton
      variant="primary"
      size="sm"
      disabled={isDisabled}
      onClick={onCompareClick}
      className="w-full flex items-center justify-center gap-2"
    >
      <GitCompare className="w-4 h-4" />
      비교하기 ({selectedCount})
    </BasicButton>
  )
}

export default KakaoMapCompareButton
