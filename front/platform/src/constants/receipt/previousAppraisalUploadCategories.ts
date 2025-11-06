import type { ReceiptPreviousAppraisalAttachmentUploadFile } from '@/model'

const previousAppraisalUploadCategories: ReceiptPreviousAppraisalCategory[] = [
  {
    name: '협의 공고 첨부파일',
    required: true,
    documents: [
      {
        name: '협의 공고 파일',
        previousAppraisalTypeCode: 'CR004001',
        required: true,
      },
      {
        name: '협의 의뢰 공문',
        previousAppraisalTypeCode: 'CR004002',
        required: true,
      },
      {
        name: '협의 회신 공문',
        previousAppraisalTypeCode: 'CR004003',
        required: true,
      },
    ],
  },
]

export interface ReceiptPreviousAppraisalCategory {
  name: string
  message?: string
  required: boolean
  documents: PreviousAppraisalDocumentAttachment[]
}

export interface PreviousAppraisalDocumentAttachment
  extends ReceiptPreviousAppraisalAttachmentUploadFile {
  name: string
  required: boolean
}

export default previousAppraisalUploadCategories
