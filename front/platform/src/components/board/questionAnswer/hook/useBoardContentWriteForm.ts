import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import type { BoardContentEntity } from '@/model'

export interface BoardQuestionWriteFormProps {
  boardSeq: number | undefined
  boardContentEntity: BoardContentEntity
}

export interface BoardQuestionWriteForm {
  boardSeq: number | undefined
  boardContentEntity: BoardContentEntity
}

const useBoardQuestionWriteForm = ({
  boardSeq,
  boardContentEntity,
}: BoardQuestionWriteFormProps) => {
  const defaultValueForBoardContent: BoardContentEntity = useMemo(() => {
    if (boardContentEntity === undefined || boardSeq === undefined || boardSeq === null)
      return { boardCategoryCode: 'CB001003', content: '', title: '' } as BoardContentEntity
    else {
      return boardContentEntity as BoardContentEntity
    }
  }, [boardSeq])

  return useForm<BoardQuestionWriteForm>({
    defaultValues: {
      boardSeq: boardSeq,
      boardContentEntity: defaultValueForBoardContent,
    },
  })
}
export default useBoardQuestionWriteForm
