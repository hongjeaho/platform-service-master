import { useSetAtom } from 'jotai/index'
import type { SubmitHandler } from 'react-hook-form'

import { useLogin } from '@/api/public-authority-api/public-authority-api'
import { useShowAlertMessage } from '@/store/message'
import { userState } from '@/store/user'
import type { LoginFromProps } from '@/views/login/hook/useLoginForm'

const useLoginSubmit = () => {
  const showAlertMessage = useShowAlertMessage()
  const setCustomer = useSetAtom(userState)

  const { mutate, isPending } = useLogin({
    mutation: {
      onSuccess: data => {
        setCustomer({ ...data })
        window.location.href = '/'
      },
      onError: error => {
        const { code } = error
        if (code === 'ERR_NETWORK') {
          showAlertMessage('서버 연결이 불안전 합니다. 나중에 다시 시도해 주세요')
          return
        }

        showAlertMessage('아이디 또는 비밀번호를 확인해 주세요')
      },
    },
  })

  const onSubmit: SubmitHandler<LoginFromProps> = async (data, event) => {
    event?.preventDefault()

    const { id, password } = data
    mutate({
      data: {
        id,
        password,
      },
    })
  }

  return {
    onSubmit,
    isPending,
  }
}
export default useLoginSubmit
