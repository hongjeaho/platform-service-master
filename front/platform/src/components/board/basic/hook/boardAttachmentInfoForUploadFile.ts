import type { Attachment } from '@/model'

export const defaultAttachmentInfoForUploadFile: BoardAttachmentInfoForUploadFile = {
  name: '공지사항 첨부파일',
  message: '',
  required: false,
  documents: {
    name: '공지사항 첨부파일',
    required: false,
    multiple: false,
    typeCode: 'CB001002',
  },
}

export interface BoardAttachmentInfoForUploadFile {
  name: string
  message?: string
  required: boolean
  documents: DocumentAttachment
}

export interface DocumentAttachment {
  name: string
  required: boolean
  multiple: boolean
  message?: string
  typeCode: string
  attachments?: Attachment
}
