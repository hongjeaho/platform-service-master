import FileUploadField from '@components/common/input/uploadBox/FileUploadField'
import React from 'react'
import { type Control, Controller } from 'react-hook-form'

interface InputSingleFileUploadBoxProps {
  id: string
  name?: string
  control: Control<any>
  rules?: Record<string, any>
  simple?: boolean
}

const InputSingleFileUploadBox: React.FC<InputSingleFileUploadBoxProps> = ({
  id,
  name,
  rules,
  control,
  simple = false,
}) => {
  return (
    <div className="space-y-2  text-left">
      <label className="text-sm font-medium text-gray-700">
        {!simple && rules?.required && <span className="text-red-500">* </span>}
        {name}
      </label>

      <Controller
        control={control}
        name={id}
        rules={{
          validate: value => {
            if (!rules?.required) return true
            const validValue = Array.isArray(value) ? value[0] : value
            return validValue?.file || validValue?.fileSeq ? true : rules?.required
          },
        }}
        render={({ field: controllerField, fieldState }) => (
          <FileUploadField
            document={{
              name: name,
            }}
            field={controllerField}
            error={fieldState.error}
            simple={simple}
          />
        )}
      />
    </div>
  )
}
export default InputSingleFileUploadBox
