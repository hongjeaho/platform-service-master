import InputSelectBox from '@components/common/input/selectBox/InputSelectBox'
import React, { useMemo } from 'react'
import type { Control } from 'react-hook-form'

import { useGetOpinionTemplateList } from '@/api/common-application-api/common-application-api'

interface OpinionTemplateSelectBoxProps {
  control: Control<any>
  className?: string | undefined
}

const OpinionTemplateSelectBox: React.FC<OpinionTemplateSelectBoxProps> = ({
  control,
  className,
}) => {
  const { data } = useGetOpinionTemplateList()
  const inputClassName = className === undefined || className === null ? 'w-80' : className
  const options = useMemo(() => {
    return (
      data
        ?.filter(it => it?.seq !== 9999)
        ?.map(it => ({ value: it?.seq ?? 9999, label: it?.templateName ?? '' })) ?? []
    )
  }, [data])

  return (
    <>
      <InputSelectBox
        placeholder={'전체'}
        className={inputClassName}
        id={'opinionTemplateSeq'}
        control={control}
        options={[{ value: undefined, label: '전체' }, ...options]}
        searchable
      />
    </>
  )
}
export default OpinionTemplateSelectBox
