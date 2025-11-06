import React from 'react'

interface LoadingProps {
  message?: string
  isVisible: boolean
}

const ViewLoading: React.FC<LoadingProps> = ({ message, isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-2xl min-w-[200px] border border-gray-200">
        {/* 로딩 스피너 */}
        <div className={`w-12 h-12 mb-4`}>
          <div
            className={`w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
          ></div>
        </div>

        {/* 메시지 */}
        {message && <p className={`text-base text-gray-700 text-center font-medium`}>{message}</p>}
      </div>
    </div>
  )
}
export default ViewLoading
