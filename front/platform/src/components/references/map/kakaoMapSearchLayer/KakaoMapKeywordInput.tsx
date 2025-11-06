import React, { useCallback } from 'react'

interface KakaoMapKeywordInputProps {
  value: string
  onChange: (value: string) => void
}

const KakaoMapKeywordInput: React.FC<KakaoMapKeywordInputProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">주소/사건명/사건번호</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="검색어를 입력하세요"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      />
    </div>
  )
}

export default React.memo(KakaoMapKeywordInput)
