import PlatformDataGridV2NoRows from '@components/common/dataGrid/PlatformDataGridV2NoRows'
import PlatformDataGridV2Pagination from '@components/common/dataGrid/PlatformDataGridV2Pagination'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type GroupingState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'

import { formatWithCommas } from '@/util/numberUtils'

import styles from './PlatformDataGridV2.module.css'

interface PlatformDataGridV2Props<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  totalPageSize?: number
  pageSize?: number
  loading: boolean
  rowId: string
  onChangePage?: (page: number) => void
  onChangePageSize?: (pageSize: number) => void
  onChangeCheckBox?: (selectedRows: number[]) => void
  onRowClick?: (row: Row<TData>) => void
  clickedRowId?: string | number
  hideHorizontalScrollbar?: boolean
  checkbox?: boolean
  rowCursor?: boolean
  showPagination?: boolean
}

// 제네릭 컴포넌트 정의
const PlatformDataGridV2 = <TData extends Record<string, any>>({
  columns: userColumns,
  data,
  loading,
  totalPageSize = 100,
  pageSize = 100,
  hideHorizontalScrollbar = false,
  rowId,
  onChangePage,
  onChangePageSize,
  onChangeCheckBox,
  onRowClick,
  clickedRowId,
  checkbox = false,
  rowCursor = false,
  showPagination = true,
}: PlatformDataGridV2Props<TData>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [{ pageIndex, pageSize: currentPageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: currentPageSize,
    }),
    [pageIndex, currentPageSize],
  )

  // 체크박스 컬럼 추가
  const columns = useMemo(() => {
    const baseColumns = [...userColumns]

    if (checkbox) {
      const checkboxColumn: ColumnDef<TData> = {
        id: 'select',
        header: ({ table }) => (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              className={styles.checkbox}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              className={styles.checkbox}
            />
          </div>
        ),
        size: 50,
      }
      return [checkboxColumn, ...baseColumns]
    }

    return baseColumns
  }, [userColumns, checkbox])

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalPageSize / pageSize),
    state: {
      rowSelection,
      pagination,
      grouping,
    },
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    getRowId: row => String(row[rowId] ?? 0),
  })

  // 선택된 행이 변경될 때 콜백 호출
  useEffect(() => {
    if (onChangeCheckBox) {
      const selectedRowIds = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(Number)
      onChangeCheckBox(selectedRowIds)
    }
  }, [rowSelection, onChangeCheckBox])

  // 페이지 변경 핸들러
  useEffect(() => {
    if (onChangePage) {
      onChangePage(pageIndex)
    }
  }, [pageIndex, onChangePage])

  // 페이지 사이즈 변경 핸들러
  useEffect(() => {
    if (!!onChangePageSize && !!currentPageSize) {
      onChangePageSize(currentPageSize)
    }
  }, [currentPageSize, onChangePageSize, pageSize])

  const containerClasses = [
    'h-full',
    styles.tableContainer,
    styles.tableContainer,
    hideHorizontalScrollbar ? styles.hideHorizontalScrollbar : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="w-full h-full min-h-[600px] rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className={containerClasses}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={styles.th}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={styles.header}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className={styles.tbody}>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className={styles.loadingCell}>
                    <div className={styles.loadingOverlay}>
                      <div className={styles.spinner}></div>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.noDataCell}>
                    <PlatformDataGridV2NoRows />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`
                      ${styles.tr} 
                      ${rowIndex % 2 === 0 ? styles.evenRow : ''} 
                      ${row.getIsSelected() ? styles.selectedRow : ''}
                      ${rowCursor ? styles.clickableRow : ''}
                      ${String(clickedRowId) === row.id ? styles.clickedRow : ''}
                    `}
                    onClick={() => {
                      if (rowCursor && onRowClick) {
                        onRowClick(row)
                      }
                    }}
                  >
                    {row.getVisibleCells().map(cell => {
                      const meta = cell?.column?.columnDef.meta as {
                        type?: string | number
                        align?: 'left' | 'center' | 'right'
                      }

                      return (
                        <td
                          key={cell.id}
                          className={styles.td}
                          style={{ textAlign: meta?.align ?? 'center' }}
                        >
                          {(() => {
                            // meta.type이 'number'인 경우 숫자 포맷팅 적용
                            if (meta?.type === 'number') {
                              return formatWithCommas(cell.getValue() as number)
                            }

                            return flexRender(cell.column.columnDef.cell, cell.getContext())
                          })()}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && (
        <div className="flex-shrink-0">
          <PlatformDataGridV2Pagination
            table={table}
            pageSize={currentPageSize}
            totalCount={totalPageSize}
          />
        </div>
      )}
    </div>
  )
}

export default PlatformDataGridV2
