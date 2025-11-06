import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import React, { type PropsWithChildren, useState } from 'react'

interface CategorySectionProps extends PropsWithChildren {
  name: string
  required?: boolean /* 필수 여부 */
  isOpen?: boolean
}

const CategorySection: React.FC<CategorySectionProps> = ({
  required = false,
  name,
  children,
  isOpen = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isOpen)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden ">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between ${
          required ? 'bg-red-50' : 'bg-gray-50'
        } hover:bg-gray-100 transition-colors cursor-pointer`}
      >
        <div className="flex items-center gap-3 ">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium text-gray-800 text-lg">
            {name}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        {required && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            필수 서류 미등록
          </div>
        )}
      </button>
      {isExpanded && children}
    </div>
  )
}
export default CategorySection
