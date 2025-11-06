import { defaultAttachmentInfoForUploadFile } from '@components/board/basic/hook/boardAttachmentInfoForUploadFile'
import useBoardAttachmentRequestMemo from '@components/board/basic/hook/useBoardAttachmentRequestMemo'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import CategorySection from '@components/common/ui/category/CategorySection'
import DownloadFileButton from '@components/common/ui/download/DownloadFileButton'
import React from 'react'

import { useGetBoardAttachmentByBoardSeq } from '@/api/board-api/board-api.ts'

interface BoardAttachmentViewProps {
  boardSeq: number
}

const BoardAttachmentView: React.FC<BoardAttachmentViewProps> = ({ boardSeq }) => {
  const { data, isLoading } = useGetBoardAttachmentByBoardSeq(boardSeq)
  const { name, documents } = useBoardAttachmentRequestMemo(boardSeq, data) ?? {}
  const { attachments, typeCode } = documents ?? {}
  const { fileSeq, originalFileName } = attachments ?? {}
  const { name: categoryName, required } = defaultAttachmentInfoForUploadFile
  const hasAttachment = fileSeq !== null && fileSeq !== 0

  console.log(hasAttachment)
  if (isLoading) {
    return <SkeletonLoading />
  }

  return (
    <div style={{ paddingTop: `30px` }}>
      <CategorySection name={categoryName} required={required}>
        <div className="bg-white" key={typeCode}>
          {hasAttachment && (
            <DownloadFileButton
              key={fileSeq}
              title={name}
              fileSeq={fileSeq}
              originalFileName={originalFileName}
            />
          )}
        </div>
      </CategorySection>
    </div>
  )
}
export default BoardAttachmentView
