import { useForm } from 'react-hook-form'

import type { AdminUserManagementCreateRequest } from '@/model/adminUserManagementCreateRequest'

const useUserManagementForm = (defaultData?: AdminUserManagementCreateRequest) => {
  return useForm<AdminUserManagementCreateRequest>({
    defaultValues: {
      userId: defaultData?.userId || '',
      userName: defaultData?.userName || '',
      userEmail: defaultData?.userEmail || '',
      userRole: defaultData?.userRole || '',
    },
  })
}

export default useUserManagementForm
