import React from 'react'
import { type Control, Controller, useController } from 'react-hook-form'

interface CheckboxOption {
  value: string
  label: string
}

interface InputCheckBoxProps {
  id: string
  options: ReadonlyArray<CheckboxOption>
  control: Control<any>
  rules?: Record<string, any>
}

const InputCheckBox: React.FC<InputCheckBoxProps> = ({ id, control, options, rules }) => {
  const { field, fieldState } = useController({
    name: id,
    control,
    rules,
    defaultValue: [] as any,
  })

  const handleChange = (value: string) => {
    const currentValues = field.value || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value]

    field.onChange(newValues)
  }

  return (
    <div>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <>
            <div className="flex flex-wrap gap-4">
              {options.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.value}
                    value={option.value}
                    checked={(field.value || []).includes(option.value)}
                    onChange={() => handleChange(option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor={option.value}
                    className={`ml-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      />

      {fieldState.error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}

export default InputCheckBox
