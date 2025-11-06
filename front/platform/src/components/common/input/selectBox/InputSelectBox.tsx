import InputErrorMessage from '@components/common/input/InputErrorMessage'
import InputSelectBoxCore, {
  type InputSelectOption,
} from '@components/common/input/selectBox/InputSelectBoxCore'
import React from 'react'
import { type Control, useController } from 'react-hook-form'

interface InputSelectBoxProps {
  id: string
  options: InputSelectOption[]
  control: Control<any>
  rules?: Record<string, any>
  placeholder?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
}

const InputSelectBox: React.FC<InputSelectBoxProps> = ({
  id,
  control,
  rules,
  options = [],
  placeholder = '',
  disabled = false,
  className = '',
  searchable = false,
  searchPlaceholder,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: id,
    control,
    rules,
    defaultValue: [] as any,
  })

  const handleOptionClick = (option: InputSelectOption): void => {
    field.onChange(option.value)
  }

  return (
    <>
      <InputSelectBoxCore
        options={options}
        value={field.value || ''}
        onOptionClick={handleOptionClick}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        error={error}
      />
      {error && <InputErrorMessage message={error?.message} />}
    </>
  )
}

export default InputSelectBox
