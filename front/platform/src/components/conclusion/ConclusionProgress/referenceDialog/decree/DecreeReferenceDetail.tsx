import OpinionCaseTemplateReferenceDetailLayout from '@components/conclusion/ConclusionProgress/referenceDialog/common/OpinionCaseTemplateReferenceDetailLayout'
import React from 'react'

import { useGetDecreeDetail } from '@/api/references-decree-api/references-decree-api'
import { useUpdateDecreeRefCnt } from '@/api/references-decree-api/references-decree-api'

interface DecreeReferenceDetailProps {
  decreeDetailSeq: number | undefined
  onClose: () => void
  onSelect: (content: string) => void
}

const DecreeReferenceDetail: React.FC<DecreeReferenceDetailProps> = ({
  decreeDetailSeq,
  onClose,
  onSelect,
}) => {
  const { data: detailData, isLoading } = useGetDecreeDetail(decreeDetailSeq, {
    query: {
      enabled: !!decreeDetailSeq,
    },
  })

  const { mutate } = useUpdateDecreeRefCnt()

  return (
    <OpinionCaseTemplateReferenceDetailLayout
      selectedId={decreeDetailSeq}
      isLoading={isLoading}
      onClose={onClose}
      onSelect={() => {
        mutate({ decreeDetailSeq })
        onSelect(detailData?.decreeContent ?? '')
      }}
      selectButtonClassName="px-6 py-2.5 font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      {/* 기본 정보  */}
      <div className="flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-1 h-6 bg-emerald-500 rounded mr-3"></div>
          기본 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">법령 및 시행규칙</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[2.5rem] flex items-center">
              <p className="text-gray-900 text-sm font-medium">
                {detailData?.decreeName || '정보 없음'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">조</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[2.5rem] flex items-center">
              <p className="text-gray-900 text-sm font-medium">
                {detailData?.articleNo || '정보 없음'}
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

      {/* 법령 및 시행규칙 내용 */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center flex-shrink-0">
          <div className="w-1 h-6 bg-teal-500 rounded mr-3"></div>
          법령 및 시행규칙 내용
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 min-h-0 overflow-auto">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {detailData?.decreeContent || ''}
          </p>
        </div>
      </div>
    </OpinionCaseTemplateReferenceDetailLayout>
  )
}
export default DecreeReferenceDetail
