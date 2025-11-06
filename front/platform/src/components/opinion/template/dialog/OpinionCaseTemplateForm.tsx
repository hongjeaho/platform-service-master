import InputTextareaBox from '@components/common/input/inputBox/InputTextareaBox'
import InputSingleFileUploadBox from '@components/common/input/uploadBox/InputSingleFileUploadBox'
import useOpinionCaseTemplateForm from '@components/opinion/template/dialog/hook/useOpinionCaseTemplateForm'
import useOpinionCaseTemplateSubmit from '@components/opinion/template/dialog/hook/useOpinionCaseTemplateSubmit'
import { Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useFieldArray } from 'react-hook-form'

import type { OpinionCaseCommentEntity, OpinionCaseTemplate } from '@/model'

interface OpinionTemplateFormProps {
  formId: string
  judgSeq: number
  opinionCaseTemplate?: OpinionCaseTemplate
  opinionCaseCommentList?: OpinionCaseCommentEntity[]
  onClose: () => void
}

const OpinionCaseTemplateForm: React.FC<OpinionTemplateFormProps> = ({
  formId,
  judgSeq,
  opinionCaseTemplate,
  opinionCaseCommentList,
  onClose: onClose,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useOpinionCaseTemplateForm({ opinionCaseTemplate, opinionCaseCommentList })

  const opinionTemplateSeq = opinionCaseTemplate?.opinionTemplateSeq ?? 9999
  const { onSubmit } = useOpinionCaseTemplateSubmit({ judgSeq, opinionTemplateSeq, onClose })

  const addButtonRef = useRef<HTMLDivElement>(null)

  const { fields, append, remove } = useFieldArray({
    control,
    name: `opinionCaseCommentList`,
  })

  /**
   * 새행 추가 버튼의 위치를 확인해서 스크롤 이동
   */
  useEffect(() => {
    setTimeout(() => {
      if (addButtonRef.current) {
        addButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }, [fields.length])

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {/* 스크롤 가능한 본문 영역 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <InputSingleFileUploadBox
            id={'opinionCaseTemplate.attachment'}
            name={'첨부파일'}
            control={control}
            rules={{
              required: opinionCaseTemplate?.templateRequired ? '첨부파일은 필수 입니다.' : false,
            }}
          />
        </div>

        {/* 헤더 라벨 */}
        <div className="grid grid-cols-3 gap-4 px-4 py-2">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">소유자</div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            소유자 의견
          </div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            시행자 의견
          </div>
        </div>

        {/* 입력 행들 */}
        <div className="space-y-3">
          {fields.map((row, index) => (
            <div key={row.id} className="relative bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <InputTextareaBox
                    id={`opinionCaseCommentList.${index}.judgTarget`}
                    register={register}
                    rows={4}
                    placeholder="소유자 정보를 입력하세요"
                    rules={{ required: '소유자 정보를 입력해 주세요.' }}
                    error={errors.opinionCaseCommentList?.[index]?.judgTarget}
                  />
                </div>
                <div>
                  <InputTextareaBox
                    id={`opinionCaseCommentList.${index}.ownerComment`}
                    register={register}
                    rows={4}
                    placeholder="시행자의 의견을 입력하세요"
                  />
                </div>
                <div>
                  <InputTextareaBox
                    id={`opinionCaseCommentList.${index}.implementerComment`}
                    register={register}
                    rows={4}
                    placeholder="소유자의 의견을 입력하세요"
                  />
                </div>
              </div>

              {/* 행 번호 표시 */}
              <div className="absolute -left-3 top-0 bg-blue-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {index + 1}
              </div>

              {/* 삭제 버튼 */}
              {fields.length > 1 && (
                <button
                  onClick={() => remove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 추가 버튼 */}
        <div className="mt-6 flex justify-center" ref={addButtonRef}>
          <button
            type="button"
            onClick={() => append({})}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md cursor-pointer"
          >
            <Plus size={24} />
            <span className="font-medium">새 행 추가</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default OpinionCaseTemplateForm
