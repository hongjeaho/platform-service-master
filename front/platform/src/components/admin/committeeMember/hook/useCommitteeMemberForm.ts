import { useForm } from 'react-hook-form'

import type { AdminCommitteeMemberEntity } from '@/model/adminCommitteeMemberEntity'

const useCommitteeMemberForm = (defaultData?: AdminCommitteeMemberEntity) => {
  return useForm<AdminCommitteeMemberEntity>({
    defaultValues: defaultData,
  })
}

export default useCommitteeMemberForm
