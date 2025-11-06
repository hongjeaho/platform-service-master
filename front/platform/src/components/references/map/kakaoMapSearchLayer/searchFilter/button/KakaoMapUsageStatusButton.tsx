import React from 'react'

export interface UsageStatusButtonProps {
  active?: boolean
  count?: number
  onClick?: () => void
  className?: string
}

const KakaoMapUsageStatusButton: React.FC<UsageStatusButtonProps> = ({
  active = false,
  count = 0,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        active
          ? 'bg-green-50 border-green-300 text-green-700 shadow-sm'
          : 'bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
      } flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 active:scale-95 ${className}`}
    >
      이용상황
      {count > 0 && (
        <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </button>
  )
}
export default KakaoMapUsageStatusButton
