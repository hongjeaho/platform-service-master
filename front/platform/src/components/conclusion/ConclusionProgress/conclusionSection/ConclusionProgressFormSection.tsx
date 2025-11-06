// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import ContainerTitle from '@components/common/ContainerTitle'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import DownloadFileButton from '@components/common/ui/download/DownloadFileButton'
import ConclusionProgressForm from '@components/conclusion/ConclusionProgress/conclusionSection/ConclusionProgressForm'
import type { OpinionCaseTemplateType } from '@components/opinion/template/comment/OpinionCaseTemplateCommentTabSection'
import { useAtomValue } from 'jotai'
import React from 'react'

// 3. API 및 타입
import { useGetConclusionContent } from '@/api/conclusion-base-api/conclusion-base-api'
import useGetJudgSeq from '@/hooks/useGetJudgSeq'
import { activeTabSelector } from '@/store/opinionTemplateTab'

// 4. 스타일
import styles from './ConclusionProgressFormSection.module.css'

interface ConclusionProgressFormSectionProps {
  type: OpinionCaseTemplateType
}

const ConclusionProgressFormSection: React.FC<ConclusionProgressFormSectionProps> = ({ type }) => {
  const judgSeq = useGetJudgSeq()
  const activeTab = useAtomValue(activeTabSelector)

  const { data, isLoading, isRefetching } = useGetConclusionContent(judgSeq, activeTab, {
    query: {
      staleTime: 0, // 0분 동안 fresh 상태 유지
    },
  })

  if (isLoading || isRefetching) {
    return <SkeletonLoading />
  }

  if (type !== 'read') {
    return (
      <ConclusionProgressForm
        judgSeq={judgSeq}
        opinionTemplateSeq={activeTab}
        conclusionContent={data}
      />
    )
  }

  return (
    <div className={styles.container}>
      <ContainerTitle title={'검토의견'} />
      <p className={styles.readOnlyTextBox}>{data?.opinionContent || '-'}</p>
      <ContainerTitle title={'법령'} className={'pt-3'} />
      <p className={styles.readOnlyTextBox}>{data?.decreeContent || '-'}</p>
      <ContainerTitle title={'판례'} className={'pt-3'} />
      <p className={styles.readOnlyTextBox}>{data?.precedentContent || '-'}</p>

      {data?.conclusionFileSeq && (
        <div>
          <ContainerTitle title={'재결관 첨부파일'} className={'pt-3'} />
          <DownloadFileButton
            fileSeq={data?.conclusionFileSeq}
            originalFileName={data?.originalFileName}
          />
        </div>
      )}
    </div>
  )
}

export default ConclusionProgressFormSection
