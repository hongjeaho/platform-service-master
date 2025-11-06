import { FILTER_OPTIONS } from '@constants/map/filterOptions'
import React from 'react'

import KakaoMapCheckboxConditionGroup from './KakaoMapCheckboxConditionGroup'

interface LandCategoryFilterProps {
  selectedValues: string[]
  onChange: (values: string[]) => void
}

const KakaoMapLandCategoryCondition: React.FC<LandCategoryFilterProps> = ({
  selectedValues,
  onChange,
}) => {
  return (
    <KakaoMapCheckboxConditionGroup
      options={FILTER_OPTIONS.landCategory}
      selectedValues={selectedValues}
      onChange={onChange}
      colorTheme="blue"
    />
  )
}

export default KakaoMapLandCategoryCondition
