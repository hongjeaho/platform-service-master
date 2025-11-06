import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import React from 'react'
import type { UseFormRegister } from 'react-hook-form'

interface BoardCommonSearchBoxProps {
  register: UseFormRegister<any>
}

const BoardCommonSearchBox: React.FC<BoardCommonSearchBoxProps> = ({ register }) => {
  return (
    <>
      <InputTextBox id="keyword" placeholder="" type="text" register={register} />
    </>
  )
}
export default BoardCommonSearchBox
