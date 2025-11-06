import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  useInsertAdminDistrictCharge,
  useUpdateAdminDistrictCharge,
} from '@/api/district-charge-api/district-charge-api'
import type { AdminDistrictManagerEntity } from '@/model'
import { useShowAlertMessageCallBack, useShowConfirmMessage } from '@/store/message'

type DistrictChargeFormData = AdminDistrictManagerEntity

interface DistrictChargeSubmitProps {
  isEdit?: boolean
  seq?: number
}

const useDistrictChargeSubmit = ({ isEdit, seq }: DistrictChargeSubmitProps) => {
  const navigate = useNavigate()
  const showAlertMessageCallBack = useShowAlertMessageCallBack()
  const showConfirmMessage = useShowConfirmMessage()

  const { mutate: insertAdminDistrictCharge } = useInsertAdminDistrictCharge({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('구별 담당자 등록되었습니다.', () => {
          navigate('/admin/districtCharge/application')
        })
      },
      onError: () => {
        showAlertMessageCallBack('구별 담당자 등록에 실패했습니다.', () => {
          navigate('/admin/districtCharge/application')
        })
      },
    },
  })

  const { mutate: updateAdminDistrictCharge } = useUpdateAdminDistrictCharge({
    mutation: {
      onSuccess: () => {
        showAlertMessageCallBack('구별 담당자 수정되었습니다.', () => {
          navigate('/admin/districtCharge/application')
        })
      },
      onError: () => {
        showAlertMessageCallBack('구별 담당자 수정에 실패했습니다.', () => {
          navigate('/admin/districtCharge/application')
        })
      },
    },
  })

  const onSubmit: SubmitHandler<DistrictChargeFormData> = async data => {
    try {
      showConfirmMessage('구별 담당자 저장 하시겠습니까?', () => {
        if (isEdit) {
          updateAdminDistrictCharge({ seq, data })
        } else {
          insertAdminDistrictCharge({ data })
        }
      })
    } catch (error) {
      console.error('구별 담당자 저장 실패:', error)
    }
  }

  return { onSubmit }
}

export default useDistrictChargeSubmit
