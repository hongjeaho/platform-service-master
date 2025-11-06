import { Download, FileText } from 'lucide-react'
import React, { useCallback } from 'react'

import { useFileDownload } from '@/api/file-base-api/file-base-api'
import { useShowAlertMessage } from '@/store/message'

interface DownloadFileButtonProps {
  title?: string
  originalFileName: string | undefined
  fileSeq: number | undefined
}

const DownloadFileButton: React.FC<DownloadFileButtonProps> = ({
  title,
  originalFileName,
  fileSeq,
}) => {
  const showAlertMessage = useShowAlertMessage()
  const { refetch } = useFileDownload(fileSeq, { query: { enabled: false } })

  const handlerDownload = useCallback(() => {
    if (fileSeq === undefined) {
      showAlertMessage('파일 일련번호가 없습니다.')
      return
    }

    void refetch()
  }, [fileSeq])

  return (
    <div className="bg-white rounded-lg pt-2">
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-gray-50 hover:from-blue-100 hover:to-gray-100 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {title && `${title} : `} {originalFileName}
              </p>
            </div>
          </div>

          <button
            type={'button'}
            onClick={handlerDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            <Download size={15} />
            <span>다운로드</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DownloadFileButton
