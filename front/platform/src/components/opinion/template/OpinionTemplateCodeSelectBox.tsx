import InputBasicSelectBox from '@components/common/input/selectBox/InputBasicSelectBox'
import type { InputSelectOption } from '@components/common/input/selectBox/InputSelectBoxCore'
import useShowOpinionCaseTemplate from '@components/opinion/template/dialog/hook/useShowOpinionCaseTemplate'
import OpinionCaseTemplateFormDialog from '@components/opinion/template/dialog/OpinionCaseTemplateFormDialog'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'

import { useGetSelectOpinionTemplateList } from '@/api/opinion-base-api/opinion-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import type { OpinionTemplateEntity } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface OpinionTemplateCodeSelectBoxProps {
  onCommitListRefetch: () => void
}

const OpinionTemplateCodeSelectBox: React.FC<OpinionTemplateCodeSelectBoxProps> = ({
  onCommitListRefetch,
}) => {
  const judgSeq = useGetJudgSeq()

  /**
   * 알림 메시지 표시 훅
   * 사용자에게 알림 메시지를 표시하는 데 사용됩니다.
   */
  const showAlertMessage = useShowAlertMessage()

  /**
   * 템플릿 목록 API 호출
   * 사용자가 선택할 수 있는 케이스 템플릿 목록을 가져옵니다.
   */
  const { data: selectOpinionTemplateList } = useGetSelectOpinionTemplateList(judgSeq)

  /**
   * 선택한 템플릿 상태
   * 드롭다운에서 사용자가 선택한 템플릿을 저장합니다.
   */
  const [selectedTemplate, setSelectedTemplate] = useState<OpinionTemplateEntity>()

  /**
   * 다이얼로그 상태
   * onClickTemplateDialogOpen 다이얼로그가 열려 있는상태,
   * onClickTemplateDialogClose 다이얼로그가 닫혀 있상태.
   */
  const { onClickTemplateDialogClose, onClickTemplateDialogOpen } = useShowOpinionCaseTemplate()

  /**
   * 템플릿 SelectBox 선택 이벤트 핸들러
   * 사용자가 드롭다운에서 템플릿을 선택했을 때 호출됩니다.
   * 선택된 템플릿을 찾아 상태에 저장합니다.
   *
   */
  const handleSelectedTemplateChange = (option: InputSelectOption) => {
    const caseTemplate = selectOpinionTemplateList?.find(
      template => template.seq === Number(option.value),
    )
    setSelectedTemplate(caseTemplate)
  }

  /**
   * 템플릿 추가 이벤트 핸들러
   * 사용자가 '추가' 버튼을 클릭했을 때 호출됩니다.
   * 템플릿이 선택되지 않은 경우 알림 메시지를 표시하고,
   * 선택된 경우 템플릿 다이얼로그를 열어 추가 작업을 진행합니다.
   */
  const onAddTemplateOpinion = () => {
    if (selectedTemplate === undefined) {
      showAlertMessage('템플릿을 선택해 주세요')
      return
    }

    if (selectedTemplate.seq === 9999) {
      showAlertMessage('의견 없음으로 등록됩니다.\n 기존에 등록된 의견은 삭제됩니다.')
      return
    }

    onClickTemplateDialogOpen({
      opinionCaseTemplate: {
        judgSeq: judgSeq,
        templateName: selectedTemplate.templateName,
        templateRequired: selectedTemplate.templateRequired,
        opinionTemplateSeq: selectedTemplate.seq,
      },
    })
  }

  /**
   * dialogHandleClose 변수는 리액트 컴포넌트에서 사용하는 함수입니다.
   * 다이얼로그를 닫기 위해 dialogOpen 상태를 'false'로 설정합니다.
   */
  const dialogHandleClose = () => {
    onClickTemplateDialogClose()
    onCommitListRefetch()
  }

  const options =
    selectOpinionTemplateList
      ?.filter(template => template.seq !== 9999)
      ?.map(template => ({
        value: template.seq ?? 9999,
        label: template.templateName ?? '의견 없음',
      })) ?? []

  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-t mb-6 mt-6">
      <OpinionCaseTemplateFormDialog judgSeq={judgSeq} onClose={dialogHandleClose} />
      <div className={'flex justify-between items-center'}>
        <InputBasicSelectBox
          className={`w-100`}
          value={String(selectedTemplate?.seq)}
          onChange={handleSelectedTemplateChange}
          options={options}
          searchable
          searchPlaceholder={'쟁점명을 입력해 주세요'}
        />
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={onAddTemplateOpinion}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md cursor-pointer"
          >
            <Plus size={24} />
            <span className="font-medium">쟁점 추가 하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
export default OpinionTemplateCodeSelectBox
