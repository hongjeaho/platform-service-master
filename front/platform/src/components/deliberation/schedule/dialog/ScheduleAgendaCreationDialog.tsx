import InputSelectBox from '@components/common/input/selectBox/InputSelectBox'
import BasicDialog from '@components/common/ui/dialog/BasicDialog'
import useAgendaCreationDialogForm from '@components/deliberation/schedule/dialog/hook/useAgendaCreationDialogForm'
import useAgendaCreationDialogSubmit from '@components/deliberation/schedule/dialog/hook/useAgendaCreationDialogSubmit'
import React, { useEffect } from 'react'

import {
  useGetSystemDeliberationDateList,
  useGetSystemDeliberationGroupList,
} from '@/api/system-deliberation-api/system-deliberation-api'

interface AgendaCreationDialogProps {
  open: boolean
  onClose: () => void
  ides: number[]
}

const ScheduleAgendaCreationDialog: React.FC<AgendaCreationDialogProps> = ({
  open,
  onClose,
  ides,
}) => {
  const formId = 'opinionCaseTemplateForm'
  const { control, handleSubmit, reset } = useAgendaCreationDialogForm()
  const { submit } = useAgendaCreationDialogSubmit(ides, onClose)
  const { data: deliberationGroupList } = useGetSystemDeliberationGroupList()
  const { data: deliberationDateList } = useGetSystemDeliberationDateList()

  /**
   * 다이얼로그 창으리 상태가 바뀌면 입력값을 초기화 한다.
   */
  useEffect(() => {
    reset()
  }, [open])

  return (
    <BasicDialog title={'안건 등록'} formId={formId} isOpen={open} onClose={onClose}>
      <div className="p-6 space-y-6">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            심의 일자와 심의 그룹을 선택후 저장 버튼을 클릭해 주세요
          </p>
        </div>
        <form
          id={formId}
          onSubmit={handleSubmit(submit)}
          autoComplete={'off'}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">심의 일자</label>
            <InputSelectBox
              id={'deliberationDateSeq'}
              control={control}
              options={
                deliberationDateList?.map(item => ({
                  label: item.scheduledDate ?? '-',
                  value: item.seq,
                })) ?? []
              }
              rules={{ required: '심의 일자를 선택해 주세요' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">심의 그룹</label>
            <InputSelectBox
              id={'deliberationGroupSeq'}
              control={control}
              options={
                deliberationGroupList?.map(item => ({
                  label: item.groupName ?? '-',
                  value: item.seq,
                })) ?? []
              }
              rules={{ required: '심의 그룹을 선택해 주세요' }}
            />
          </div>
        </form>
      </div>
    </BasicDialog>
  )
}
export default ScheduleAgendaCreationDialog
