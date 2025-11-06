import { FILTER_OPTIONS } from '@constants/map/filterOptions'
import React from 'react'

import KakaoMapCheckboxConditionGroup from './KakaoMapCheckboxConditionGroup'

interface UsageStatusFilterProps {
  selectedValues: string[]
  onChange: (values: string[]) => void
}

const KakaoMapUsageStatusCondition: React.FC<UsageStatusFilterProps> = ({
  selectedValues,
  onChange,
}) => {
  return (
    <KakaoMapCheckboxConditionGroup
      options={FILTER_OPTIONS.usageStatus}
      selectedValues={selectedValues}
      onChange={onChange}
      colorTheme="green"
    />
  )
}

export default KakaoMapUsageStatusCondition
