import { Search } from 'lucide-react'
import React from 'react'

interface SearchButtonProps {
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  children = '검색',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Search className="w-4 h-4 mr-2" />
      {children}
    </button>
  )
}

export default SearchButton
