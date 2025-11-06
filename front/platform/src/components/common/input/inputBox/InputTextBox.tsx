import InputErrorMessage from '@components/common/input/InputErrorMessage'
import React from 'react'
import type { FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputTextBoxProps<T extends FieldValues> {
  id: string
  type?: 'text' | 'password' | 'hidden'
  disabled?: boolean
  register: UseFormRegister<T>
  rules?: Record<string, any>
  error?: FieldError
  placeholder?: string
  value?: string | number
  hidden?: boolean
  width?: number
}

const InputTextBox: React.FC<InputTextBoxProps<any>> = ({
  id,
  type = 'text',
  placeholder,
  register,
  error,
  rules,
  value,
  disabled = false,
}) => {
  return (
    <div className="flex-1 w-full">
      <div className="flex items-center justify-center min-h-[40px]">
        <input
          type={type}
          id={id}
          value={value}
          {...register(id, rules)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
      </div>
      {error && (
        <div className="text-left">
          <InputErrorMessage message={error?.message} />
        </div>
      )}
    </div>
  )
}

export default InputTextBox
