import InputSelectBoxCore, {
  type InputSelectOption,
} from '@components/common/input/selectBox/InputSelectBoxCore'
import React from 'react'

interface InputBasicSelectBoxProps {
  id?: string
  options: InputSelectOption[]
  value: string
  onChange: (option: InputSelectOption) => void
  disable?: boolean
  placeholder?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
}

const InputBasicSelectBox: React.FC<InputBasicSelectBoxProps> = ({
  options = [],
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  className = '',
  searchable = false,
  searchPlaceholder,
}) => {
  return (
    <InputSelectBoxCore
      options={options}
      value={value}
      onOptionClick={onChange}
      placeholder={placeholder}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled}
      className={className}
    />
  )
}
export default InputBasicSelectBox
