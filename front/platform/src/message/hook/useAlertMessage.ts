import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import { alertMessageState, type MessageProps } from '@/store/message'

export const useAlertMessage = () => {
  const [alertMessage, setAlertMessageState] = useAtom(alertMessageState)
  const [isOpen, setOpen] = useState<boolean>(false)

  // 메시지가 있으면 모달 열기
  useEffect(() => {
    if (alertMessage.message !== null) {
      setOpen(true)
    }
  }, [alertMessage])

  // isOpen이 false가 된 직후 상태 초기화 (애니메이션 완료 대기)
  useEffect(() => {
    if (!isOpen && alertMessage.message !== null) {
      const timer = setTimeout(() => {
        setAlertMessageState({ message: null, onCallBack: undefined })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isOpen, alertMessage.message, setAlertMessageState])

  const setAlertMessage = (props: MessageProps) => {
    if (props.message !== null) {
      setOpen(true)
    }

    setAlertMessageState(prev => ({ ...prev, ...props }))
  }

  return {
    isOpen,
    setOpen,
    alertMessage,
    setAlertMessage,
  }
}
