import React from 'react'

export interface ZoneTypeButtonProps {
  active?: boolean
  count?: number
  onClick?: () => void
  className?: string
}

const KakaoMapZoneTypeButton: React.FC<ZoneTypeButtonProps> = ({
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
          ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
          : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm'
      } flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 active:scale-95 ${className}`}
    >
      용도지역
      {count > 0 && (
        <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </button>
  )
}
export default KakaoMapZoneTypeButton
