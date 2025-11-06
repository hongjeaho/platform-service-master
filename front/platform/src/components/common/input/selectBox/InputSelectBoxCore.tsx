import useInputSelectBox from '@components/common/input/selectBox/hook/useInputSelectBox'
import useInputSelectSearch from '@components/common/input/selectBox/hook/useInputSelectSearch'
import React, { useEffect } from 'react'
import type { FieldError } from 'react-hook-form'

export interface InputSelectOption {
  value: string | number | undefined
  label: string
}

interface InputSelectBoxCoreProps {
  options: InputSelectOption[]
  value: string
  onOptionClick: (option: InputSelectOption) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: FieldError
  searchable?: boolean
  searchPlaceholder?: string
}

const InputSelectBoxCore: React.FC<InputSelectBoxCoreProps> = ({
  options = [],
  value,
  onOptionClick,
  placeholder = '선택해주세요',
  disabled = false,
  className = '',
  error,
  searchable = false,
  searchPlaceholder = '검색...',
}) => {
  const { isOpen, selectRef, setOpen, handleToggle } = useInputSelectBox({ disabled })
  const {
    filteredOptions,
    searchTerm,
    setSearchTerm,
    highlightedIndex,
    setHighlightedIndex,
    inputRef,
  } = useInputSelectSearch({
    options,
    isOpen,
    searchable,
  })

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setOpen(false)
          setSearchTerm('')
          setHighlightedIndex(-1)
          break
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            onOptionClick(filteredOptions[highlightedIndex])
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, filteredOptions, highlightedIndex])

  const handleOptionSelect = (option: InputSelectOption): void => {
    onOptionClick(option)
    setOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  const selectedOption: InputSelectOption | undefined = options.find(
    option => String(option.value) === String(value),
  )
  const displayText: string = selectedOption ? selectedOption.label : placeholder

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)
    setHighlightedIndex(-1)
  }

  const handleInputClick = (): void => {
    if (!isOpen) {
      setOpen(true)
    }
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* 선택 박스 */}
      {isOpen && searchable ? (
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={handleInputClick}
          placeholder={searchPlaceholder}
          className="w-full px-4 py-2 bg-white border border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
          w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
           ${
             error
               ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
               : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
           }
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'hover:border-gray-400 cursor-pointer'
          }
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}
        `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {displayText}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      )}

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">선택 가능한 옵션이 없습니다</div>
          ) : (
            filteredOptions.map((option: InputSelectOption, index: number) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`
                  w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-50 focus:outline-none cursor-pointer
                  hover:text-blue-600 focus:text-blue-600
                  ${
                    option.value === value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-900'
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                `}
              >
                {searchable && searchTerm.trim()
                  ? highlightSearchTerm(option.label, searchTerm)
                  : option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// 검색어 하이라이팅 함수
const highlightSearchTerm = (text: string, term: string): React.ReactNode => {
  if (!term.trim()) return text

  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-gray-900">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default InputSelectBoxCore
