import FileUploadField from '@components/common/input/uploadBox/FileUploadField'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { type Control, Controller, useFieldArray } from 'react-hook-form'

export interface InputFileUploadBoxProps {
  id: string
  name?: string
  control: Control<any>
  rules?: Record<string, any>
}

const InputMultiFileUploadBox: React.FC<InputFileUploadBoxProps> = ({
  id,
  name,
  control,
  rules,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: id,
  })

  // 초기 필드가 없으면 하나 추가
  useEffect(() => {
    if (fields.length === 0) {
      append({ file: null })
    }
  }, [append, fields.length])

  const handleAddFile = () => {
    append({ file: null })
  }

  // 첫 번째 파일이 업로드되었는지 확인
  const field = fields?.[0] as any

  return (
    <div className="space-y-2 m-2">
      <div className="flex items-start justify-between ">
        <label className="text-sm font-medium text-gray-700">
          {rules?.required && <span className="text-red-500">* </span>}
          {name}
        </label>
        {(!!field?.name || !!field?.fileSeq) && (
          <button
            type="button"
            onClick={handleAddFile}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors  cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            추가
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">※ 첫 번째 파일은 필수이며 삭제할 수 없습니다.</p>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`${id}.${index}`}
            control={control}
            rules={{
              validate: value => {
                if (!rules?.required) return true
                const validValue = Array.isArray(value) ? value[0] : value
                return validValue?.file || validValue?.fileSeq ? true : rules?.required
              },
            }}
            render={({ field: controllerField, fieldState }) => (
              <FileUploadField
                index={index}
                field={controllerField}
                document={{
                  name: name,
                }}
                error={fieldState.error}
                showRemoveButton={fields.length > 1 && index > 0}
                onRemove={() => index > 0 && remove(index)}
                multiple
              />
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default InputMultiFileUploadBox
