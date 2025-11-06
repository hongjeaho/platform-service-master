import { type Attachment } from '@/model'

export interface NoticeResultAttachmentCategory {
  name: string
  required: boolean
  message?: string
  documents: NoticeResultDocument[]
}

export interface NoticeResultDocument {
  name: string
  required: boolean
  multiple: boolean
  message?: string
  typeCode: string
  attachments?: Attachment | Attachment[]
}

export const noticeResultAttachmentsCategories: NoticeResultAttachmentCategory[] = [
  {
    name: '열람공고 결과 첨부파일 ',
    required: true,
    documents: [
      {
        name: '회보공문',
        typeCode: 'CN001001',
        required: true,
        multiple: true,
      },
      {
        name: '공고문',
        typeCode: 'CN001002',
        required: true,
        multiple: true,
      },
      {
        name: '등기송달증빙',
        typeCode: 'CN001003',
        required: true,
        multiple: true,
      },
      {
        name: '소유자 의견',
        typeCode: 'CN001004',
        required: true,
        multiple: true,
      },
    ],
  },
]
