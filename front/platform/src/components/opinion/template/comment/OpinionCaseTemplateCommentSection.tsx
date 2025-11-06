import type { OpinionCaseTemplateType } from '@components/opinion/template/comment/OpinionCaseTemplateCommentTabSection'
import useShowOpinionCaseTemplate from '@components/opinion/template/dialog/hook/useShowOpinionCaseTemplate'
import { Edit3, Paperclip } from 'lucide-react'
import React from 'react'

import { useFileDownload } from '@/api/file-base-api/file-base-api'
import type { OpinionTemplateOpinionCommit } from '@/model'
import { useShowAlertMessage } from '@/store/message'

interface OpinionCaseTemplateCommentSectionProps {
  opinion: OpinionTemplateOpinionCommit
  activeTab: number
  type: OpinionCaseTemplateType
}

const OpinionCaseTemplateCommentSection: React.FC<OpinionCaseTemplateCommentSectionProps> = ({
  opinion,
  activeTab,
  type,
}) => {
  const showAlertMessage = useShowAlertMessage()
  const { onClickTemplateDialogOpen } = useShowOpinionCaseTemplate()

  const { refetch } = useFileDownload(opinion.opinionCaseTemplate?.opinionFileSeq, {
    query: {
      enabled: false,
    },
  })

  const handleEditOpinion = () => {
    onClickTemplateDialogOpen({
      opinionCaseTemplate: opinion.opinionCaseTemplate,
      opinionCaseCommentList: opinion.opinionCaseCommentList,
    })
  }

  const handleFileDownload = () => {
    try {
      void refetch()
    } catch {
      showAlertMessage('파일 다운로드에 실폐하였습니다.')
    }
  }

  if (activeTab !== opinion.opinionCaseTemplate.seq) return null

  return (
    <div
      key={opinion.opinionCaseTemplate.seq}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* 첨부파일 영역 */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-end">
          <div className="gap-4 text-sm text-gray-600">
            {opinion.opinionCaseTemplate.opinionFileSeq && (
              <span
                onClick={handleFileDownload}
                className="flex items-center gap-1 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
              >
                <Paperclip size={16} />
                {opinion.opinionCaseTemplate?.originalFileName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-1">
        {/* 전체 수정 버튼 */}
        {type !== 'read' && (
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={handleEditOpinion}
              className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
            >
              <Edit3 size={16} />
              의견 수정
            </button>
          </div>
        )}
        {/* 컨텐츠 영역 */}
        <div className="space-y-4">
          {opinion?.opinionCaseCommentList?.map((comment, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 pb-4 border-b last:border-0">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  소유자
                </h4>
                <div className="bg-blue-50 border border-green-100 rounded-lg p-3  h-32 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap">{comment.judgTarget || '-'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  소유자 의견
                </h4>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3  h-32 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                    {comment.ownerComment || '-'}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2  ">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  시행자 의견
                </h4>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 h-32 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                    {comment.implementerComment || '-'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default OpinionCaseTemplateCommentSection
