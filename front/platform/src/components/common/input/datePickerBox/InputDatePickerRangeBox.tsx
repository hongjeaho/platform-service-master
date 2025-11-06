import InputErrorMessage from '@components/common/input/InputErrorMessage'
import React from 'react'
import { type Control, type FieldError, useController } from 'react-hook-form'

interface InputDatePickerRangeBoxProps {
  control: Control<any>
  startId: string
  endId: string
  required?: boolean
  button?: boolean
  errors?: {
    start?: FieldError
    end?: FieldError
  }
}

const InputDatePickerRangeBox: React.FC<InputDatePickerRangeBoxProps> = ({
  control,
  startId,
  endId,
  required,
  errors,
  button = false,
}) => {
  // useController를 사용하여 필드 값을 제어
  const { field: startField } = useController({
    name: startId,
    control,
    defaultValue: '', // 빈 문자열로 초기값 설정
    rules: { required: required ? '시작 일시를 입력해 주세요' : false },
  })

  const { field: endField } = useController({
    name: endId,
    control,
    defaultValue: '', // 빈 문자열로 초기값 설정
    rules: { required: required ? '종료 일시를 입력해 주세요' : false },
  })

  // 날짜를 YYYY-MM-DD 형식으로 포맷팅하는 함수
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // 날짜 프리셋 핸들러
  const handleDatePreset = (months: number) => {
    const today = new Date()
    const endDate = new Date(today)

    // 시작일: 오늘로부터 지정된 개월 수만큼 이전 날짜
    const startDate = new Date(today)
    startDate.setMonth(today.getMonth() - months)

    // useController의 onChange를 사용하여 값 업데이트
    startField.onChange(formatDate(startDate))
    endField.onChange(formatDate(endDate))
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="date"
          id="startDate"
          min="2000-01-01"
          max="9999-12-31"
          {...startField}
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <span className="text-gray-500">~</span>
        <input
          type="date"
          id="endDate"
          min="2000-01-01"
          max="9999-12-31"
          {...endField}
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <div className={`flex gap-2 ml-4 ${button ? '' : 'hidden'}`}>
          <button
            type="button"
            onClick={() => handleDatePreset(1)}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            1개월
          </button>
          <button
            type="button"
            onClick={() => handleDatePreset(3)}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            3개월
          </button>
          <button
            type="button"
            onClick={() => handleDatePreset(6)}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            6개월
          </button>
        </div>
      </div>
      {(errors?.start || errors?.end) && (
        <InputErrorMessage message={errors?.start?.message ?? errors?.end?.message} />
      )}
    </div>
  )
}

export default InputDatePickerRangeBox
