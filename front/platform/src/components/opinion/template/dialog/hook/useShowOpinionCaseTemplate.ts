import { useAtom } from 'jotai/index'
import { useCallback } from 'react'

import type { OpinionCaseCommentEntity, OpinionCaseTemplate } from '@/model'
import { opinionCaseTemplateDialogState } from '@/store/dialog'

/**
 * 의견  템플릿 다이얼로그를 열기 위한 Props
 */
interface Props {
  opinionCaseTemplate?: OpinionCaseTemplate
  opinionCaseCommentList?: OpinionCaseCommentEntity[]
}

const useShowOpinionCaseTemplate = () => {
  const [opinionCaseTemplateDialog, setOpinionCaseTemplateDialog] = useAtom(
    opinionCaseTemplateDialogState,
  )

  const { isOpen, opinionCaseTemplate, opinionCaseCommentList } = opinionCaseTemplateDialog ?? {}

  /**
   * 의견 등록 템플릿 다이얼로그를 닫습니다
   */
  const onClickTemplateDialogClose = useCallback(() => {
    setOpinionCaseTemplateDialog({ isOpen: false })
  }, [isOpen])

  /**
   * 의견 등록 템플릿 다이얼로그를 엽니다
   */
  const onClickTemplateDialogOpen = useCallback(
    ({ opinionCaseTemplate, opinionCaseCommentList }: Props) => {
      setOpinionCaseTemplateDialog({
        isOpen: true,
        opinionCaseTemplate,
        opinionCaseCommentList,
      })
    },
    [isOpen],
  )

  return {
    isOpen,
    opinionCaseTemplate,
    opinionCaseCommentList,
    onClickTemplateDialogOpen,
    onClickTemplateDialogClose,
  }
}

export default useShowOpinionCaseTemplate
