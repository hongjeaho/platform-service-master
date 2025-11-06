import BoardContent from '@components/board/basic/BoardContent'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReferenceGridBody from '@components/references/basic/ReferenceGridBody'
import ReferenceGridCell from '@components/references/basic/ReferenceGridCell'
import ReferenceGridRow from '@components/references/basic/ReferenceGridRow'
import React, { useEffect } from 'react'

import { useUpdateConclusionOpinionViewCount } from '@/api/references-conclusion-opinion-api/references-conclusion-opinion-api'
import { useGetConclusionOpinionDetail } from '@/api/references-conclusion-opinion-precedent-api/references-conclusion-opinion-precedent-api'

interface ReferenceConclusionOpinionSummaryProps {
  conclusionOpinionSeq: number
}

const ReferenceConclusionOpinionViewBody: React.FC<ReferenceConclusionOpinionSummaryProps> = ({
  conclusionOpinionSeq,
}) => {
  const { data, isLoading } = useGetConclusionOpinionDetail(conclusionOpinionSeq, {})
  const { mutate } = useUpdateConclusionOpinionViewCount()
  useEffect(() => {
    if (isLoading) return

    mutate({ conclusionOpinionSeq })
  }, [conclusionOpinionSeq, isLoading])

  if (isLoading) return <SkeletonLoading />
  return (
    <>
      {/* 관련 개요 테이블 */}
      <div className="py-4">
        {/* 제목 */}
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-gray-900 min-w-20">개요</h3>
        </div>
      </div>

      <ReferenceGridBody>
        {/* 첫 번째 줄: 쟁점의견, 사업명 */}
        <ReferenceGridRow columnCount={2}>
          <ReferenceGridCell
            firstColumn={true}
            lastColumn={false}
            label={'쟁점의견'}
            text={data?.templateName}
          ></ReferenceGridCell>
          <ReferenceGridCell
            firstColumn={false}
            lastColumn={true}
            label={'사업명'}
            text={data?.caseTitle}
          ></ReferenceGridCell>
        </ReferenceGridRow>
        {/* 두 번째 줄: 심의일, 담당자 */}
        <ReferenceGridRow columnCount={2}>
          <ReferenceGridCell
            firstColumn={true}
            lastColumn={false}
            label={'심의일'}
            text={data?.deliberationDate}
          ></ReferenceGridCell>
          <ReferenceGridCell
            firstColumn={false}
            lastColumn={true}
            label={'담당자'}
            text={data?.chargeNm}
          ></ReferenceGridCell>
        </ReferenceGridRow>
      </ReferenceGridBody>

      {/* 내용 영역 */}
      <BoardContent title={'본문'}>{data?.conclusionOpinionContent}</BoardContent>
    </>
  )
}
export default ReferenceConclusionOpinionViewBody
