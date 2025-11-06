import React from 'react'

interface OpinionCaseTemplateReferenceDialogSkeletonProps {}

const ReferenceDialogSkeleton: React.FC<OpinionCaseTemplateReferenceDialogSkeletonProps> = () => {
  return (
    <div className="flex flex-1 gap-2 h-full overflow-hidden">
      {/* Left Panel - 검색 필터 + 그리드 Skeleton */}
      <div className="w-1/2 flex flex-col ml-5">
        {/* 검색 폼 Skeleton */}
        <div className="flex items-center gap-4 p-2 animate-pulse">
          {/* 템플릿 선택박스 */}
          <div className="w-50 h-10 bg-gray-300 rounded"></div>
          {/* 키워드 입력 */}
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          {/* 검색 버튼 */}
          <div className="w-20 h-10 bg-gray-300 rounded"></div>
          {/* 초기화 버튼 */}
          <div className="w-20 h-10 bg-gray-300 rounded"></div>
        </div>

        {/* 데이터 그리드 Skeleton */}
        <div className="flex-1 animate-pulse">
          {/* 그리드 헤더 */}
          <div className="flex bg-gray-100 border-b">
            <div className="w-[100px] h-12 bg-gray-300 border-r mx-1 my-1 rounded"></div>
            <div className="w-[150px] h-12 bg-gray-300 border-r mx-1 my-1 rounded"></div>
            <div className="w-[100px] h-12 bg-gray-300 border-r mx-1 my-1 rounded"></div>
            <div className="w-[350px] h-12 bg-gray-300 mx-1 my-1 rounded"></div>
          </div>

          {/* 그리드 행들 */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex border-b">
              <div className="w-[100px] h-10 bg-gray-200 border-r mx-1 my-1 rounded"></div>
              <div className="w-[150px] h-10 bg-gray-200 border-r mx-1 my-1 rounded"></div>
              <div className="w-[100px] h-10 bg-gray-200 border-r mx-1 my-1 rounded"></div>
              <div className="w-[350px] h-10 bg-gray-200 mx-1 my-1 rounded"></div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 Skeleton */}
        <div className="flex justify-center items-center gap-2 p-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Right Panel - 상세 내용 Skeleton */}
      <div className="w-1/2 p-4 bg-gray-50">
        <div className="animate-pulse space-y-4">
          {/* 제목 */}
          <div className="h-7 bg-gray-300 rounded w-32"></div>

          {/* 상세 정보 필드들 */}
          <div className="space-y-3">
            {/* 쟁점의견 */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-10 bg-white border rounded"></div>
            </div>

            {/* 사업명 */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-12 mb-1"></div>
              <div className="h-8 bg-white border rounded p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* 재결관 의견 */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
              <div className="h-70 bg-white border rounded p-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* 인용횟수 */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-8 bg-white border rounded p-2">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>

          {/* 하단 버튼들 */}
          <div className="p-4 flex justify-end gap-2">
            <div className="w-20 h-10 bg-gray-300 rounded"></div>
            <div className="w-16 h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ReferenceDialogSkeleton
