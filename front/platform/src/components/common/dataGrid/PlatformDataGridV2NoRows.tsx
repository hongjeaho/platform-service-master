import { SearchX } from 'lucide-react'
import React from 'react'

const PlatformDataGridV2NoRows: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {/* 배경 그라디언트 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-indigo-50/30 dark:from-slate-900/30 dark:via-transparent dark:to-indigo-900/20 pointer-events-none" />

      {/* 아이콘 컨테이너 with 애니메이션 */}
      <div className="relative mb-6 group">
        {/* 배경 원형 장식 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-2xl scale-150 animate-pulse" />

        {/* 메인 아이콘 */}
        <div className="relative z-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-indigo-500/20">
          <SearchX className="w-16 h-16 text-indigo-500 dark:text-indigo-400 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
        </div>
      </div>

      {/* 텍스트 섹션 */}
      <div className="text-center space-y-2 relative z-10">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
          데이터가 없습니다
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          표시할 데이터가 없습니다. 새로운 항목을 추가하거나 검색 조건을 확인해보세요.
        </p>
      </div>
    </div>
  )
}
export default PlatformDataGridV2NoRows
