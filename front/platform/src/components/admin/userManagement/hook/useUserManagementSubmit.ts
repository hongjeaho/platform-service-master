import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  useInsertAdminUserManagement,
  useUpdateAdminUserManagement,
} from '@/api/admin-user-management-api/admin-user-management-api.ts'
import type { AdminUserManagementCreateRequest } from '@/model/adminUserManagementCreateRequest.ts'
import { useShowAlertMessageCallBack } from '@/store/message'

interface UserSubmitProps {
  isEdit?: boolean
  seq?: number
}

const useUserManagementSubmit = ({ isEdit, seq }: UserSubmitProps) => {
  const navigate = useNavigate()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()

  const { mutate: insertAdminUserManagement } = useInsertAdminUserManagement({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('회원 등록 되었습니다.', () => {
          navigate('/admin/userManagement/application')
        })
      },
      onError: () => {
        showAlertMessageCallBack('회원 저장 실패', () => {})
      },
    },
  })
  const { mutate: updateAdminUserManagement } = useUpdateAdminUserManagement({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('회원 수정 되었습니다', () => {
          navigate('/admin/userManagement/application')
        })
      },
      onError: () => {
        showAlertMessageCallBack('회원 저장 실패', () => {})
      },
    },
  })

  const onSubmit: SubmitHandler<AdminUserManagementCreateRequest> = async data => {
    try {
      // 수정 시 비밀번호가 비어있으면 기존 비밀번호 유지
      if (isEdit && !data.userPassword) {
        delete data.userPassword
      }

      // 비밀번호 확인 필드는 제거 (실제 전송 데이터에서 제외)
      delete data.userPasswordConfirm

      if (isEdit) {
        updateAdminUserManagement({ seq, data })
      } else {
        insertAdminUserManagement({ data: data })
      }
    } catch (error) {
      console.error('회원 저장 실패:', error)
    }
  }

  return { onSubmit }
}

export default useUserManagementSubmit
