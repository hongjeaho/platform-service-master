import {
  type BoardAttachmentInfoForUploadFile,
  defaultAttachmentInfoForUploadFile,
} from '@components/board/basic/hook/boardAttachmentInfoForUploadFile.ts'
import { useMemo } from 'react'

import type { DetailForUploadBoardAttachment } from '@/model'

const useBoardAttachmentRequestMemo = (
  boardSeq: number,
  defaultData?: DetailForUploadBoardAttachment,
) => {
  const fileSeq = defaultData?.attachment?.fileSeq ?? 0
  const originalFileName = defaultData?.attachment?.originalFileName ?? ''

  return useMemo(() => {
    return defaultData === undefined || defaultData === null
      ? defaultAttachmentInfoForUploadFile
      : {
          ...defaultAttachmentInfoForUploadFile,
          documents: {
            attachments: {
              fileSeq: fileSeq,
              originalFileName: originalFileName,
            },
          },
        }
  }, [boardSeq, defaultData]) as BoardAttachmentInfoForUploadFile
}
export default useBoardAttachmentRequestMemo
