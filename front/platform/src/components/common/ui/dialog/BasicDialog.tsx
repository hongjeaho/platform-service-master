import { X } from 'lucide-react'
import React, { type PropsWithChildren, useEffect } from 'react'

interface BasicDialogProps extends PropsWithChildren {
  formId?: string
  isOpen: boolean
  onClose: () => void
  title: string
  hideFooter?: boolean
  className?: string
}

const BasicDialog: React.FC<BasicDialogProps> = ({
  formId,
  isOpen,
  onClose,
  title,
  children,
  hideFooter = false,
  className = 'w-full',
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }, [isOpen])

  if (isOpen === false) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
      {/* 배경 오버레이 - 배경이 비치도록 */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      {/* 다이얼로그 박스 */}
      <div
        className={`relative bg-white rounded-2xl max-w-4xl max-h-[90vh] border border-gray-200 shadow-2xl flex flex-col ${className}`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shadow-sm rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full p-6">{children}</div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-white shadow-sm rounded-b-2xl">
          {!hideFooter && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                form={formId}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium shadow-sm cursor-pointer"
              >
                저장
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicDialog
