import { atom } from 'jotai'

import { type OpinionCaseCommentEntity, type OpinionCaseTemplate } from '@/model'

interface OpinionTemplateDialog {
  isOpen: boolean
  opinionCaseTemplate?: OpinionCaseTemplate
  opinionCaseCommentList?: OpinionCaseCommentEntity[]
}

export const opinionCaseTemplateDialogState = atom<OpinionTemplateDialog>({
  isOpen: false,
  opinionCaseTemplate: undefined,
  opinionCaseCommentList: undefined,
})
