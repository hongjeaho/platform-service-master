import React from 'react'

const SkeletonLoading: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        {/* 제목 */}
        <div className="h-10 bg-gray-300 rounded-md w-4/5"></div>

        {/* 메타 정보 */}
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>

        {/* 이미지 */}
        <div className="h-64 bg-gray-300 rounded-lg"></div>

        {/* 본문 */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoading
