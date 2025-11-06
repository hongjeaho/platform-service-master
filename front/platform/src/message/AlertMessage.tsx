import BasicButton from '@components/common/button/BasicButton'
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import React, { useCallback } from 'react'

import { useAlertMessage } from '@/message/hook/useAlertMessage'

const AlertMessage: React.FC = () => {
  const { isOpen, setOpen, alertMessage, setAlertMessage } = useAlertMessage()

  const onClose = useCallback(() => {
    setOpen(false)

    // 1. 콜백 저장 (클로저 문제 방지)
    const callback = alertMessage.onCallBack

    // 2. 즉시 상태 초기화 (콜백 실행 전에 초기화하여 재노출 방지)
    setAlertMessage({ message: null, onCallBack: undefined })

    // 3. 콜백 실행 (상태 업데이트 완료 후 실행)
    if (typeof callback === 'function') {
      setTimeout(() => {
        callback()
      }, 0)
    }
  }, [alertMessage, setAlertMessage])

  // 메시지 타입에 따른 아이콘과 색상 결정
  const getAlertType = () => {
    const message = alertMessage.message?.toLowerCase() || ''
    if (message.includes('성공') || message.includes('완료') || message.includes('저장')) {
      return 'success'
    }
    if (message.includes('오류') || message.includes('실패') || message.includes('에러')) {
      return 'error'
    }
    if (message.includes('경고') || message.includes('주의')) {
      return 'warning'
    }
    return 'info'
  }

  const alertType = getAlertType()

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200',
      buttonVariant: 'primary' as const,
      buttonClassName: '!bg-green-600 hover:!bg-green-700 focus:!ring-green-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      borderColor: 'border-red-200',
      buttonVariant: 'primary' as const,
      buttonClassName: '!bg-red-600 hover:!bg-red-700 focus:!ring-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-200',
      buttonVariant: 'primary' as const,
      buttonClassName: '!bg-amber-600 hover:!bg-amber-700 focus:!ring-amber-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200',
      buttonVariant: 'primary' as const,
      buttonClassName: '',
    },
  }

  const config = typeConfig[alertType]
  const IconComponent = config.icon

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 알림 다이얼로그 */}
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
            <h2 className="text-xl font-semibold text-gray-800">알림</h2>
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="px-6 py-8">
          <p className="text-gray-700 text-center whitespace-pre-line leading-relaxed text-base">
            {alertMessage.message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-center">
            <BasicButton
              onClick={onClose}
              variant={config.buttonVariant}
              size="lg"
              className={`px-6 py-2.5 rounded-lg focus:ring-4 transition-all duration-200 shadow-sm hover:shadow-md ${config.buttonClassName}`}
            >
              확인
            </BasicButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertMessage
