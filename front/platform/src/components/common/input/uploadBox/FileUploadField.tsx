import InputErrorMessage from '@components/common/input/InputErrorMessage'
import { Upload, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { type ControllerRenderProps, type FieldError, type FieldValues } from 'react-hook-form'

/**
 * 파일 업로드 필드 컴포넌트의 Props 인터페이스
 * @interface InputUploadBoxProps
 */
interface InputUploadBoxProps {
  /** 파일 업로드 필드의 인덱스 (여러 개의 필드가 있을 때 사용) */
  index?: number
  /** React Hook Form의 필드 컨트롤러 */
  field: ControllerRenderProps<FieldValues, any>
  /** 필드 오류 정보 */
  error?: FieldError
  /** 항목 삭제 버튼 클릭 시 호출되는 콜백 함수 */
  onRemove?: () => void
  /** 삭제 버튼 표시 여부 */
  showRemoveButton?: boolean
  /** 다중 파일 업로드 모드 여부 */
  multiple?: boolean
  /** 간단한 표시 모드 여부 */
  simple?: boolean
  document?: {
    name?: string
    placeholder?: string
  }
}

/**
 * 파일 업로드 필드 컴포넌트
 *
 * 파일 선택, 드래그 앤 드롭, 파일 정보 표시 및 삭제 기능을 제공하는 재사용 가능한 컴포넌트입니다.
 * React Hook Form과 통합되어 폼 내에서 파일 업로드 기능을 쉽게 구현할 수 있습니다.
 *
 */
const FileUploadField: React.FC<InputUploadBoxProps> = ({
  index = 0,
  field,
  document,
  error,
  showRemoveButton = false,
  multiple = false,
  simple = false,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null)
  const fieldValue = Array.isArray(field.value) ? field.value[0] : field.value

  // 컴포넌트 마운트 시 field.value 확인
  useEffect(() => {
    if (fieldValue) {
      if (!!fieldValue.file && fieldValue.file instanceof File) {
        setFileInfo({
          name: fieldValue.file.name,
          size: fieldValue.file.size,
        })
      } else if (fieldValue.fileSeq && fieldValue.originalFileName) {
        setFileInfo({
          name: fieldValue.originalFileName,
          size: fieldValue.fileSize || 0,
        })
      }
    }
  }, [fieldValue])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
      })
      field.onChange({
        ...fieldValue,
        file: selectedFile,
        fileSeq: undefined, // 새 파일 업로드 시 기존 fileSeq 제거
        originalFileName: selectedFile.name,
      })
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFileInfo({
        name: droppedFile.name,
        size: droppedFile.size,
      })
      field.onChange({
        ...fieldValue,
        file: droppedFile,
        fileSeq: undefined,
        originalFileName: droppedFile.name,
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileRemove = () => {
    setFileInfo(null)
    field.onChange({
      file: null,
      fileSeq: undefined,
      originalFileName: undefined,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={'pt-1'}>
      <div
        className={`relative flex items-center gap-3 p-3 rounded-lg border ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-gray-50'
        } ${index === 0 && multiple ? 'border-l-4 border-l-blue-500' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {showRemoveButton && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            title="항목 삭제"
          >
            <X className="w-3 h-3 cursor-pointer" />
          </button>
        )}

        {simple ? (
          <div className="flex items-center gap-2 w-full">
            <span className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap w-full overflow-hidden overflow-ellipsis">
              {fileInfo?.name || '파일을 업로드 해주세요.'}
            </span>
            <button
              type="button"
              onClick={fileInfo ? handleFileRemove : () => fileInputRef.current?.click()}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-2"
            >
              {fileInfo ? (
                <>
                  <X size={16} />
                </>
              ) : (
                <>
                  <Upload size={16} />
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <input
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed "
              placeholder={document?.placeholder || document?.name}
              disabled={true}
              value={fileInfo?.name || ''}
              title={index === 0 && multiple ? '기본 항목 (삭제 불가)' : ''}
            />
            <div className="flex items-center gap-2 ">
              {!!fileInfo && (
                <>
                  {fileInfo.size > 0 && (
                    <span className="text-xs text-gray-500">({formatFileSize(fileInfo.size)})</span>
                  )}
                  {fieldValue?.fileSeq && (
                    <span className="text-xs text-green-600 font-medium">[기존파일]</span>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={fileInfo ? handleFileRemove : () => fileInputRef.current?.click()}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {fileInfo ? '초기화' : '선택'}
              </button>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.hwp,.jpg,.jpeg,.png,.zip"
        />
      </div>
      {error && <InputErrorMessage message={error?.message} />}
    </div>
  )
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환하는 유틸리티 함수
 *
 * 바이트 단위의 파일 크기를 B, KB, MB 단위로 변환합니다.
 *
 * @param {number} bytes - 변환할 파일 크기 (바이트 단위)
 * @returns {string} 변환된 파일 크기 문자열 (예: "1.25 MB")
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

export default FileUploadField
