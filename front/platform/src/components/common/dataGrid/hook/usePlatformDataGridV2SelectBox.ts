import { useCallback, useState } from 'react'

const usePlatformDataGridV2SelectBox = () => {
  const [platformDataGridV2Selected, setPlatformDataGridV2Selected] = useState<number[]>([])

  const onChangeCheckBox = useCallback((ids: number[]) => {
    setPlatformDataGridV2Selected(ids)
  }, [])

  return {
    platformDataGridV2Selected,
    onChangeCheckBox,
  }
}
export default usePlatformDataGridV2SelectBox
