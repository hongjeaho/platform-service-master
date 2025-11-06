import { useEffect, useRef, useState } from 'react'

interface InputSelectOptionBoxProps {
  disabled?: boolean
}

const useInputSelectBox = ({ disabled }: InputSelectOptionBoxProps) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (): void => {
    if (!disabled) {
      setOpen(!isOpen)
    }
  }

  return { isOpen, selectRef, setOpen, handleToggle }
}
export default useInputSelectBox
