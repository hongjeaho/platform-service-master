import React from 'react'

interface FilterOption {
  value: string
  label: string
}

interface CheckboxFilterGroupProps {
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  colorTheme: 'blue' | 'green' | 'purple'
}

const KakaoMapCheckboxConditionGroup: React.FC<CheckboxFilterGroupProps> = ({
  options,
  selectedValues,
  onChange,
  colorTheme,
}) => {
  const getThemeClasses = () => {
    switch (colorTheme) {
      case 'blue':
        return {
          checkbox:
            'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
        }
      case 'green':
        return {
          checkbox:
            'w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
        }
      case 'purple':
        return {
          checkbox:
            'w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
        }
      default:
        return {
          checkbox:
            'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
        }
    }
  }

  const themeClasses = getThemeClasses()

  const handleCheckboxChange = (optionValue: string) => {
    const currentValues = selectedValues || []
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue]
    onChange(newValues)
  }

  return (
    <div className="flex flex-wrap gap-4">
      {options.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            type="checkbox"
            id={option.value}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className={themeClasses.checkbox}
          />
          <label
            htmlFor={option.value}
            className="ml-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export default KakaoMapCheckboxConditionGroup
