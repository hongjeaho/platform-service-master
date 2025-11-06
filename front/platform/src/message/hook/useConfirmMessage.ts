import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import { confirmMessageState } from '@/store/message'

export const useConfirmMessage = () => {
  const [message, setMessage] = useAtom(confirmMessageState)
  const [isOpen, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (message.message !== null) {
      setOpen(true)
    }
  }, [message])

  return {
    isOpen,
    setOpen,
    message,
    setMessage,
  }
}
