import { type BoardAnnouncementWriteForm } from '@components/board/announcement/hook/useBoardAnnouncementWriteForm'
import BoardAttachmentUpload from '@components/board/basic/BoardAttachmentUpload'
import InputTextareaBox from '@components/common/input/inputBox/InputTextareaBox'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import React from 'react'
import { useFormContext } from 'react-hook-form'

export interface BoardAnnouncementWriteProps {
  needToSubmitFile: boolean
}

const BoardContentWrite: React.FC<BoardAnnouncementWriteProps> = ({ needToSubmitFile }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<BoardAnnouncementWriteForm>()
  console.log('needToSubmitFile,', needToSubmitFile === false)
  return (
    <>
      {/*<div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">*/}
      <div className="py-3 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {'제목'}
          <InputTextBox
            id="boardContentEntity.title"
            placeholder="제목을 입력해 주세요."
            type="text"
            register={register}
            error={errors?.boardContentEntity?.title}
            rules={{
              required: '제목을 입력해 주세요.',
            }}
          />
        </h3>
      </div>
      {/*</div>*/}
      {needToSubmitFile && <BoardAttachmentUpload />}
      <div className="py-3 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{'내용'}</h3>
      </div>
      <div className="py-1 text-left text-gray-500">
        <InputTextareaBox
          id="boardContentEntity.content"
          placeholder="내용을 입력해 주세요."
          register={register}
          error={errors?.boardContentEntity?.content}
          rules={{
            required: '내용을 입력해 주세요.',
          }}
        />
      </div>
    </>
  )
}
export default BoardContentWrite
