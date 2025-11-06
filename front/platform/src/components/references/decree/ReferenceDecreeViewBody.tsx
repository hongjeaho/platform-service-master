import BoardContent from '@components/board/basic/BoardContent'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import ReferenceGridBody from '@components/references/basic/ReferenceGridBody'
import ReferenceGridCell from '@components/references/basic/ReferenceGridCell'
import ReferenceGridRow from '@components/references/basic/ReferenceGridRow'
import React, { useEffect, useMemo } from 'react'

import {
  useGetDecreeDetail,
  useUpdateDecreeViewCnt,
} from '@/api/references-decree-api/references-decree-api'
import { decreeTypeOptions } from '@/constants/references/referenceDecreeCommonOption'

interface ReferenceDecreeSummaryProps {
  decreeDetailSeq: number
}

const ReferenceDecreeViewBody: React.FC<ReferenceDecreeSummaryProps> = ({ decreeDetailSeq }) => {
  const { data, isLoading } = useGetDecreeDetail(decreeDetailSeq)
  const { mutate } = useUpdateDecreeViewCnt()
  const decreeNameLabel = useMemo(() => {
    const decreeTypeCode: string = data?.decreeCategoryCode ?? ''

    return decreeTypeOptions.find(it => it.value === decreeTypeCode)?.label ?? ''
  }, [data])

  useEffect(() => {
    if (isLoading) return

    mutate({ decreeDetailSeq })
  }, [decreeDetailSeq, isLoading])

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
            label={decreeNameLabel}
            text={data?.decreeName}
          ></ReferenceGridCell>
          <ReferenceGridCell
            firstColumn={false}
            lastColumn={true}
            label={'조항'}
            text={data?.articleNo}
          ></ReferenceGridCell>
        </ReferenceGridRow>
      </ReferenceGridBody>

      {/* 본문 영역 */}
      <BoardContent title={'본문'}>{data?.decreeContent ?? ''}</BoardContent>
    </>
  )
}
export default ReferenceDecreeViewBody
