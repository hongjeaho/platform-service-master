import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  useInsertAdminCommitteeMember,
  useUpdateAdminCommitteeMember,
} from '@/api/admin-committee-member-api/admin-committee-member-api'
import type { AdminCommitteeMemberEntity } from '@/model/adminCommitteeMemberEntity'
import { useShowAlertMessageCallBack, useShowConfirmMessage } from '@/store/message'

interface CommitteeMemberSubmitProps {
  isEdit?: boolean
  seq?: number
}

const useCommitteeMemberSubmit = ({ isEdit, seq }: CommitteeMemberSubmitProps) => {
  const navigate = useNavigate()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const showConfirmMessage = useShowConfirmMessage()

  const { mutate: insertAdminCommitteeMember } = useInsertAdminCommitteeMember({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('위원회 명단 저장 성공', () => {
          navigate('/admin/committeeMember/application')
        })
      },
      onError: () => {
        showAlertMessageCallBack('위원회 명단 저장 실패', () => {})
      },
    },
  })

  const { mutate: updateAdminCommitteeMember } = useUpdateAdminCommitteeMember({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('위원회 명단 저장 성공', () => {
          navigate('/admin/committeeMember/application')
        })
      },
      onError: () => {
        showAlertMessageCallBack('위원회 명단 저장 실패', () => {})
      },
    },
  })

  const onSubmit: SubmitHandler<AdminCommitteeMemberEntity> = async data => {
    try {
      showConfirmMessage('위원회 명단 저장 하시겠습니까?', () => {
        if (isEdit) {
          updateAdminCommitteeMember({ seq: seq, data: { ...data, seq: data.seq } })
        } else {
          insertAdminCommitteeMember({ data })
        }
      })
    } catch (error) {
      console.error('위원회 명단 저장 실패:', error)
    }
  }

  return {
    onSubmit,
  }
}

export default useCommitteeMemberSubmit
