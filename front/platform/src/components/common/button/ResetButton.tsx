import { RotateCcw } from 'lucide-react'
import React from 'react'

interface ResetButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

const ResetButton: React.FC<ResetButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children = '초기화',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      {children}
    </button>
  )
}

export default ResetButton
