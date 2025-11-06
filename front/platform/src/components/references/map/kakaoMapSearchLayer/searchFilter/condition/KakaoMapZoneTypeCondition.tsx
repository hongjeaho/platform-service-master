import { FILTER_OPTIONS } from '@constants/map/filterOptions'
import React from 'react'

import KakaoMapCheckboxConditionGroup from './KakaoMapCheckboxConditionGroup'

interface ZoneTypeFilterProps {
  selectedValues: string[]
  onChange: (values: string[]) => void
}

const KakaoMapZoneTypeCondition: React.FC<ZoneTypeFilterProps> = ({ selectedValues, onChange }) => {
  return (
    <KakaoMapCheckboxConditionGroup
      options={FILTER_OPTIONS.zoneType}
      selectedValues={selectedValues}
      onChange={onChange}
      colorTheme="purple"
    />
  )
}

export default KakaoMapZoneTypeCondition
