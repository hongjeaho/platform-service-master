import BasicButton from '@components/common/button/BasicButton'
import CancelButton from '@components/common/button/CancelButton'
import { AlertTriangle, CheckCircle, HelpCircle, Trash2 } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'

import { useConfirmMessage } from '@/message/hook/useConfirmMessage'

const ConfirmMessage: React.FC = () => {
  const { isOpen, setOpen, message, setMessage } = useConfirmMessage()

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setMessage({ message: null }), 200)
    }
  }, [isOpen])

  const onClose = useCallback(() => {
    setOpen(false)
  }, [isOpen])

  const onConfirm = useCallback(() => {
    setOpen(false)
    if (typeof message.onCallBack === 'function') {
      message.onCallBack()
    }
  }, [isOpen])

  // 메시지 타입에 따른 아이콘과 색상 결정
  const getConfirmType = () => {
    const messageText = message.message?.toLowerCase() || ''
    if (
      messageText.includes('삭제') ||
      messageText.includes('제거') ||
      messageText.includes('삭제하시겠습니까')
    ) {
      return 'danger'
    }
    if (
      messageText.includes('저장') ||
      messageText.includes('등록') ||
      messageText.includes('추가')
    ) {
      return 'success'
    }
    if (
      messageText.includes('경고') ||
      messageText.includes('주의') ||
      messageText.includes('변경')
    ) {
      return 'warning'
    }
    return 'question'
  }

  const confirmType = getConfirmType()

  const typeConfig = {
    danger: {
      icon: Trash2,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      borderColor: 'border-red-200',
      confirmButtonVariant: 'primary' as const,
      confirmButtonClassName: '!bg-red-600 hover:!bg-red-700 focus:!ring-red-500',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200',
      confirmButtonVariant: 'primary' as const,
      confirmButtonClassName: '!bg-green-600 hover:!bg-green-700 focus:!ring-green-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-200',
      confirmButtonVariant: 'primary' as const,
      confirmButtonClassName: '!bg-amber-600 hover:!bg-amber-700 focus:!ring-amber-500',
    },
    question: {
      icon: HelpCircle,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200',
      confirmButtonVariant: 'primary' as const,
      confirmButtonClassName: '',
    },
  }

  const config = typeConfig[confirmType]
  const IconComponent = config.icon

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 확인 다이얼로그 */}
      <div
        className={`
        relative bg-white rounded-2xl w-full max-w-md mx-4 
        border-2 ${config.borderColor} shadow-2xl 
        transform transition-all duration-300 ease-out
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}
      >
        {/* 헤더 영역 */}
        <div className={`${config.bgColor} px-6 py-4 rounded-t-2xl border-b ${config.borderColor}`}>
          <div className="flex items-center gap-3">
            <IconComponent size={28} className={config.iconColor} />
            <h2 className="text-xl font-semibold text-gray-800">확인</h2>
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="px-6 py-8">
          <p className="text-gray-700 text-center whitespace-pre-line leading-relaxed text-base">
            {message.message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-center gap-3">
            <BasicButton
              onClick={onConfirm}
              variant={config.confirmButtonVariant}
              size="md"
              className={`px-6 py-3 rounded-xl transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[80px] ${config.confirmButtonClassName}`}
            >
              확인
            </BasicButton>
            <CancelButton
              onClick={onClose}
              size="md"
              className="px-6 py-3 rounded-xl transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[80px]"
            >
              취소
            </CancelButton>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ConfirmMessage
