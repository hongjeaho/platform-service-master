import { useForm } from 'react-hook-form'

import type { AdminDistrictManagerEntity } from '@/model/adminDistrictManagerEntity'

const useDistrictChargeForm = (defaultData?: AdminDistrictManagerEntity) => {
  return useForm<AdminDistrictManagerEntity>({
    defaultValues: {
      managerName: defaultData?.managerName || '',
      district: defaultData?.district || '',
      phoneNumber: defaultData?.phoneNumber || '',
    },
  })
}

export default useDistrictChargeForm
