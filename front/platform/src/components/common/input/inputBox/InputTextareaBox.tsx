import InputErrorMessage from '@components/common/input/InputErrorMessage'
import React from 'react'
import type { FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputTextareaBoxProps<T extends FieldValues> {
  id: string
  rows?: number
  disabled?: boolean
  register: UseFormRegister<T>
  rules?: Record<string, any>
  error?: FieldError
  placeholder?: string
  value?: string | number
  hidden?: boolean
  width?: number
}

const InputTextareaBox: React.FC<InputTextareaBoxProps<any>> = ({
  id,
  rows = 3,
  placeholder,
  register,
  error,
  rules,
  value,
}) => {
  return (
    <div className="flex-1 w-full">
      <textarea
        id={id}
        value={value}
        {...register(id, rules)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
        rows={rows}
        placeholder={placeholder}
      />
      {error && <InputErrorMessage message={error?.message} />}
    </div>
  )
}
export default InputTextareaBox
