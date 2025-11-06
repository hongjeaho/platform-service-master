import { BasicButton } from '@components/common/button'
import { X } from 'lucide-react'
import React, { type PropsWithChildren } from 'react'

interface FullScreenDialogProps extends PropsWithChildren {
  formId: string
  isOpen: boolean
  onClose: () => void
  title: string
  hideFooter?: boolean
  closeButtonName?: string
  submitButtonName?: string
}

const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
  formId,
  isOpen,
  onClose,
  title,
  children,
  closeButtonName = '취소',
  submitButtonName = '저장',
  hideFooter = false,
}) => {
  if (isOpen === false) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between py-3 pl-6 border-b bg-white shadow-sm ">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <X size={28} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className={'h-full'}>{children}</div>
      </div>

      {/* 푸터 */}
      {hideFooter && (
        <div className="flex justify-end p-6 border-t bg-white shadow-lg">
          <div className="flex gap-4">
            <BasicButton onClick={onClose} variant={'outline'}>
              {closeButtonName}
            </BasicButton>
            <BasicButton type="submit" formId={formId}>
              {submitButtonName}
            </BasicButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default FullScreenDialog
