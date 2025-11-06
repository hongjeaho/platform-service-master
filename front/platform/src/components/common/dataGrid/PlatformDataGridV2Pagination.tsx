import { type Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react'

interface PlatformDataGridV2PaginationProps<TData> {
  table: Table<TData>
  pageSize: number
  totalCount: number
  showPageSizeSelector?: boolean
  pageSizeOptions?: number[]
}

const PlatformDataGridV2Pagination = <TData extends Record<string, any>>({
  table,
  pageSize,
  totalCount,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100],
}: PlatformDataGridV2PaginationProps<TData>) => {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const startRow = (currentPage - 1) * pageSize + 1
  const endRow = Math.min(currentPage * pageSize, totalCount)

  // 페이지 번호 배열 생성 (생략 표시 포함)
  const getPageNumbers = () => {
    const delta = 2 // 현재 페이지 앞뒤로 보여줄 페이지 수
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // 총 페이지가 7개 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 첫 페이지는 항상 표시
      pages.push(1)

      if (currentPage - delta > 2) {
        pages.push('...')
      }

      // 현재 페이지 주변 페이지들
      const start = Math.max(2, currentPage - delta)
      const end = Math.min(totalPages - 1, currentPage + delta)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage + delta < totalPages - 1) {
        pages.push('...')
      }

      // 마지막 페이지는 항상 표시
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-gray-50 border-t border-gray-200 min-h-[52px] gap-3 sm:gap-0">
      <div className="text-sm text-gray-600 font-medium order-2 sm:order-1">
        <span>
          {startRow}-{endRow} of {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-4 order-1 sm:order-2">
        {/* 페이지 사이즈 선택기 */}
        {showPageSizeSelector && (
          <select
            className="px-3 py-1.5 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[length:16px] bg-[position:right_8px_center]"
            value={pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value)) // 페이지 사이즈 변경
              table.setPageIndex(0) // 페이지 사이즈 변경 시 첫 페이지로 이동
              window.scrollTo(0, 0)
            }}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        )}

        {/* 페이지네이션 버튼들 */}
        <div className="flex items-center gap-1">
          {/* 첫 페이지로 */}
          <button
            className="flex items-center justify-center w-8 h-8 p-0 bg-white border border-gray-300 rounded-md text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:shadow-none focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="첫 페이지로"
            title="첫 페이지로"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* 이전 페이지 */}
          <button
            className="flex items-center justify-center w-8 h-8 p-0 bg-white border border-gray-300 rounded-md text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:shadow-none focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="이전 페이지"
            title="이전 페이지"
          >
            <ChevronLeft size={16} />
          </button>

          {/* 페이지 번호들 */}
          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex items-center justify-center w-8 h-8 text-gray-500"
                    aria-label="더 많은 페이지"
                  >
                    <MoreHorizontal size={16} />
                  </div>
                )
              }

              const pageNumber = page as number
              const isCurrentPage = pageNumber === currentPage

              return (
                <button
                  key={pageNumber}
                  className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:shadow-none cursor-pointer'
                  }`}
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  aria-label={`${pageNumber}페이지로`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          {/* 다음 페이지 */}
          <button
            className="flex items-center justify-center w-8 h-8 p-0 bg-white border border-gray-300 rounded-md text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:shadow-none focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="다음 페이지"
            title="다음 페이지"
          >
            <ChevronRight size={16} />
          </button>

          {/* 마지막 페이지로 */}
          <button
            className="flex items-center justify-center w-8 h-8 p-0 bg-white border border-gray-300 rounded-md text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:shadow-none focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="마지막 페이지로"
            title="마지막 페이지로"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
export default PlatformDataGridV2Pagination
