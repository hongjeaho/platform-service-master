import type { BoardAnnouncementWriteForm } from '@components/board/announcement/hook/useBoardAnnouncementWriteForm'
import { defaultAttachmentInfoForUploadFile } from '@components/board/basic/hook/boardAttachmentInfoForUploadFile'
import InputSingleFileUploadBox from '@components/common/input/uploadBox/InputSingleFileUploadBox'
import React from 'react'
import { useFormContext } from 'react-hook-form'

const BoardAttachmentUpload: React.FC = () => {
  const { control } = useFormContext<BoardAnnouncementWriteForm>()
  const { typeCode } = defaultAttachmentInfoForUploadFile.documents ?? {}

  return (
    <div className="px-0 bg-white">
      <InputSingleFileUploadBox
        key={typeCode}
        name={'첨부파일'}
        id={`boardAttachmentInfo.documents.attachments`}
        control={control}
      />
    </div>
  )
}
export default BoardAttachmentUpload
