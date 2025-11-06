import BoardContent from '@components/board/basic/BoardContent'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReferenceGridBody from '@components/references/basic/ReferenceGridBody'
import ReferenceGridCell from '@components/references/basic/ReferenceGridCell'
import ReferenceGridRow from '@components/references/basic/ReferenceGridRow'
import React, { useEffect } from 'react'

import {
  useGetPrecedentDetail,
  useUpdatePrecedentViewCount,
} from '@/api/references-precedent-api/references-precedent-api'

interface ReferencePrecedentViewBodyProps {
  precedentSeq: number
}

const ReferencePrecedentViewBody: React.FC<ReferencePrecedentViewBodyProps> = ({
  precedentSeq,
}) => {
  const { data, isLoading } = useGetPrecedentDetail(precedentSeq)
  const { mutate } = useUpdatePrecedentViewCount()

  useEffect(() => {
    if (isLoading) return

    mutate({ precedentSeq })
  }, [precedentSeq, isLoading])

  if (isLoading) return <SkeletonLoading />

  return (
    <>
      <div className="py-4">
        {/* 제목 */}
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-gray-900 min-w-20">개요</h3>
        </div>
      </div>

      {/* 관련 개요 테이블 */}
      <ReferenceGridBody>
        <ReferenceGridRow columnCount={2}>
          <ReferenceGridCell
            firstColumn={true}
            lastColumn={false}
            label={'재결사건번호'}
            text={data?.caseNo}
          ></ReferenceGridCell>
          <ReferenceGridCell
            firstColumn={false}
            lastColumn={true}
            label={'법원사건번호'}
            text={data?.precedentCaseNo}
          ></ReferenceGridCell>
        </ReferenceGridRow>
        <ReferenceGridRow columnCount={3}>
          <ReferenceGridCell
            firstColumn={true}
            lastColumn={false}
            label={'법원'}
            text={data?.courtName}
          ></ReferenceGridCell>
          <ReferenceGridCell
            firstColumn={false}
            lastColumn={false}
            label={'쟁점의견'}
            text={data?.templateName}
          ></ReferenceGridCell>{' '}
          <ReferenceGridCell
            firstColumn={false}
            lastColumn={true}
            label={'사업명'}
            text={data?.caseTitle}
          ></ReferenceGridCell>
        </ReferenceGridRow>
      </ReferenceGridBody>

      {/* 본문 영역 */}
      <BoardContent title={'본문'}>{data?.precedentContent ?? ''}</BoardContent>
    </>
  )
}
export default ReferencePrecedentViewBody
