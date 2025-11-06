import type { InputSelectOption } from '@components/common/input/selectBox/InputSelectBoxCore'
import { useEffect, useMemo, useRef, useState } from 'react'

interface IUseInputSelectSearch {
  options: InputSelectOption[]
  isOpen: boolean
  searchable?: boolean
}

const useInputSelectSearch = ({ options, isOpen, searchable }: IUseInputSelectSearch) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // 검색어에 따라 옵션 필터링
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options
    }
    return options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [options, searchTerm])

  // 드롭다운이 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, searchable])

  // 필터된 옵션이 변경될 때 하이라이트 인덱스 리셋
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [filteredOptions])

  return {
    searchTerm,
    setSearchTerm,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    inputRef,
  }
}
export default useInputSelectSearch
