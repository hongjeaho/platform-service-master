import OpinionCaseTemplateReferenceDetailLayout from '@components/conclusion/ConclusionProgress/referenceDialog/common/OpinionCaseTemplateReferenceDetailLayout'
import React from 'react'

import {
  useGetPrecedentDetail,
  useUpdatePrecedentRefCount,
} from '@/api/references-precedent-api/references-precedent-api'

interface PrecedentReferenceDetailProps {
  precedentSeq: number | undefined
  onClose: () => void
  onSelect: (content: string) => void
}

const PrecedentReferenceDetail: React.FC<PrecedentReferenceDetailProps> = ({
  precedentSeq,
  onClose,
  onSelect,
}) => {
  const { data: detailData, isLoading } = useGetPrecedentDetail(precedentSeq, {
    query: {
      enabled: !!precedentSeq,
    },
  })

  const { mutate } = useUpdatePrecedentRefCount()

  return (
    <OpinionCaseTemplateReferenceDetailLayout
      selectedId={precedentSeq}
      isLoading={isLoading}
      onClose={onClose}
      onSelect={() => {
        mutate({ precedentSeq })
        onSelect(detailData?.precedentContent ?? '')
      }}
      selectButtonClassName="px-6 py-2.5 font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
    >
      {/* 기본 정보  */}
      <div className="flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-1 h-6 bg-emerald-500 rounded mr-3"></div>
          기본 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">쟁점의견</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[2.5rem] flex items-center">
              <p className="text-gray-900 text-sm font-medium">
                {detailData?.templateName || '정보 없음'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">사업명</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[2.5rem] flex items-center">
              <p className="text-gray-900 text-sm font-medium">
                {detailData?.caseTitle || '정보 없음'}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">인용횟수</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[2.5rem] flex items-center">
              <p className="text-gray-900 text-sm font-medium">{detailData?.refCount ?? 0}회</p>
            </div>
          </div>
        </div>
      </div>

      {/* 판례 본문 */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center flex-shrink-0">
          <div className="w-1 h-6 bg-teal-500 rounded mr-3"></div>
          판례 본문
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 min-h-0 overflow-auto">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {detailData?.precedentContent || ''}
          </p>
        </div>
      </div>
    </OpinionCaseTemplateReferenceDetailLayout>
  )
}
export default PrecedentReferenceDetail
