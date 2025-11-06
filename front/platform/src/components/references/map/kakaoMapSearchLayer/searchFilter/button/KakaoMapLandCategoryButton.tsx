import React from 'react'

export interface LandCategoryButtonProps {
  active?: boolean
  count?: number
  onClick?: () => void
  className?: string
}

const KakaoMapLandCategoryButton: React.FC<LandCategoryButtonProps> = ({
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
          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
          : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
      } flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 active:scale-95 ${className}`}
    >
      지목
      {count > 0 && (
        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </button>
  )
}
export default KakaoMapLandCategoryButton
