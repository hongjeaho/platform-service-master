import type { SearchFilters } from '@components/references/map/kakaoMapSearchLayer/hooks/useSearchFilters'
import { FILTER_LABELS, getFilterLabel } from '@constants/map/filterOptions'
import { X } from 'lucide-react'
import React from 'react'

interface FilterItemsProps {
  filterType: keyof SearchFilters
  items: string[]
  onRemoveItem: (filterType: keyof SearchFilters, item: string) => void
  onClearFilter: (filterType: keyof SearchFilters) => void
}

const KakaoMapFilterItems: React.FC<FilterItemsProps> = ({
  filterType,
  items,
  onRemoveItem,
  onClearFilter,
}) => {
  if (items.length === 0) return null

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600 uppercase">
          {FILTER_LABELS[filterType as keyof typeof FILTER_LABELS]}
        </span>
        <button
          onClick={() => onClearFilter(filterType)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          전체 해제
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {getFilterLabel(filterType as string, item)}
            <button
              onClick={() => onRemoveItem(filterType, item)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default React.memo(KakaoMapFilterItems)
