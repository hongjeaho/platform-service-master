import InputErrorMessage from '@components/common/input/InputErrorMessage'
import React from 'react'
import { type Control, type FieldError, useController } from 'react-hook-form'

interface InputDatePickerBoxProps {
  control: Control<any>
  id: string
  error?: FieldError
  rules?: Record<string, any>
}

const InputDatePickerBox: React.FC<InputDatePickerBoxProps> = ({ control, error, id, rules }) => {
  // useController를 사용하여 필드 값을 제어
  const { field: startField } = useController({
    name: id,
    control,
    rules,
  })

  return (
    <div className="items-center gap-3">
      <input
        type="date"
        id="startDate"
        min="2000-01-01"
        max="9999-12-31"
        {...startField}
        className="w-50 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      />
      {error && <InputErrorMessage message={error.message} />}
    </div>
  )
}
export default InputDatePickerBox
