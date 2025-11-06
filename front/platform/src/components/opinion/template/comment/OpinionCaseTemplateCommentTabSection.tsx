import ContainerTitle from '@components/common/ContainerTitle'
import TabContent from '@components/common/ui/navigation/tab/TabContent'
import useOpinionTemplateTabRemove from '@components/opinion/template/comment/hook/useOpinionTemplateTabRemove'
import OpinionCaseTemplateCommentSection from '@components/opinion/template/comment/OpinionCaseTemplateCommentSection'
import { useAtom, useSetAtom } from 'jotai'
import { MessageSquare } from 'lucide-react'
import React, { useEffect, useMemo } from 'react'

import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import type { OpinionTemplateOpinionCommit } from '@/model'
import {
  initializeTabsState,
  opinionTemplateTabState,
  setActiveTabState,
} from '@/store/opinionTemplateTab'

export type OpinionCaseTemplateType = 'write' | 'read' | 'edit'

interface OpinionCaseTemplateListProps {
  opinionCaseTemplateCommitList?: OpinionTemplateOpinionCommit[]
  onCommitListRefetch?: () => void
  type?: OpinionCaseTemplateType
}

const OpinionCaseTemplateCommentTabSection: React.FC<OpinionCaseTemplateListProps> = ({
  opinionCaseTemplateCommitList,
  onCommitListRefetch = () => {},
  type = 'write',
}) => {
  const judgSeq = useGetJudgSeq()

  // Jotai 상태 사용
  const [tabState] = useAtom(opinionTemplateTabState)
  const setActiveTab = useSetAtom(setActiveTabState)
  const initializeTabs = useSetAtom(initializeTabsState)

  const tabs = useMemo(() => {
    return (
      opinionCaseTemplateCommitList?.map(opinion => ({
        label: opinion?.opinionCaseTemplate?.templateName ?? '',
        id: opinion?.opinionCaseTemplate?.seq ?? 1,
      })) ?? []
    )
  }, [opinionCaseTemplateCommitList])

  const { onOpinionTabRemoveButton } = useOpinionTemplateTabRemove({
    judgSeq,
    onCommitListRefetch,
  })

  // 탭 초기화
  useEffect(() => {
    if (tabs.length > 0) {
      initializeTabs(tabs)
    }
  }, [tabs, initializeTabs])

  if (!opinionCaseTemplateCommitList || opinionCaseTemplateCommitList.length === 0) {
    return (
      <>
        <ContainerTitle title={'의견 목록'} />
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>등록된 의견이 없습니다.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-1">
      <TabContent
        tabs={tabState.tabs}
        activeTab={tabState.activeTab}
        setActiveTab={id => setActiveTab(Number(id))}
        onRemoveButton={onOpinionTabRemoveButton}
        showRemoveButton={type !== 'read'}
      >
        {opinionCaseTemplateCommitList.map(opinion => (
          <OpinionCaseTemplateCommentSection
            key={opinion.opinionCaseTemplate.seq}
            opinion={opinion}
            activeTab={tabState.activeTab}
            type={type}
          />
        ))}
      </TabContent>
    </div>
  )
}

export default OpinionCaseTemplateCommentTabSection
