import { useCallback, useMemo, useState } from 'react'

export interface SearchFilters {
  keyword: string
  landCategory: string[]
  usageStatus: string[]
  zoneType: string[]
}

const initialFilters: SearchFilters = {
  keyword: '',
  landCategory: [],
  usageStatus: [],
  zoneType: [],
}

export const useSearchFilters = () => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(filterType: K, value: SearchFilters[K]) => {
      setFilters(prev => ({
        ...prev,
        [filterType]: value,
      }))
    },
    [],
  )

  const removeFilterItem = useCallback((filterType: keyof SearchFilters, itemToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType] as string[]).filter(item => item !== itemToRemove),
    }))
  }, [])

  const clearFilter = useCallback((filterType: keyof SearchFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: filterType === 'keyword' ? '' : [],
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  return useMemo(
    () => ({
      filters,
      updateFilter,
      removeFilterItem,
      clearFilter,
      clearAllFilters,
    }),
    [filters, updateFilter, removeFilterItem, clearFilter, clearAllFilters],
  )
}
