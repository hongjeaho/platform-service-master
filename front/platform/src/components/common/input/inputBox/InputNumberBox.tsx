import InputErrorMessage from '@components/common/input/InputErrorMessage'
import React from 'react'
import { type Control, Controller, type FieldError } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

interface InputNumberBoxProps {
  id: string
  control: Control<any>
  error?: FieldError
  rules?: Record<string, any>
  prefix?: string
  disabled?: boolean
  fixedDecimalScale?: boolean // 소수점 고정
  value?: string | number
  maxLength?: number
}

const InputNumberBox: React.FC<InputNumberBoxProps> = ({
  prefix = '',
  id,
  control,
  disabled = false,
  fixedDecimalScale = false,
  value,
  error,
  rules,
  maxLength = 99,
}) => {
  const MAX_LIMIT = 99999999999

  return (
    <div className="flex-1 w-full">
      <Controller
        name={id}
        rules={rules}
        control={control}
        render={({ field }) => (
          <>
            <NumericFormat
              id={id}
              className={
                'w-full px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 disabled:bg-gray-200 text-right '
              }
              prefix={prefix}
              value={value ?? field?.value}
              disabled={disabled}
              thousandSeparator
              decimalScale={fixedDecimalScale ? 2 : 0}
              valueIsNumericString
              fixedDecimalScale
              getInputRef={field.ref}
              maxLength={maxLength}
              onValueChange={value => {
                field.onChange({
                  target: {
                    name: id,
                    value: value.floatValue,
                  },
                })
              }}
              isAllowed={values => {
                const { floatValue } = values
                return (floatValue ?? 0) < MAX_LIMIT
              }}
            />
            {error && <InputErrorMessage message={error?.message} />}
          </>
        )}
      />
    </div>
  )
}
export default InputNumberBox
