import { useForm } from 'react-hook-form'

export interface LoginFromProps {
  id: string
  password: string
}

const useLoginForm = () => {
  return useForm<LoginFromProps>({
    defaultValues: {
      id: '',
      password: '',
    },
  })
}
export default useLoginForm
