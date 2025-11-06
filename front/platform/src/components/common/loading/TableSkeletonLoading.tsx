import React from 'react'

import TableBaseBody from '../ui/tableBase/TableBaseBody'
import TableBaseCell from '../ui/tableBase/TableBaseCell'
import TableBaseHead from '../ui/tableBase/TableBaseHead'
import TableBaseRow from '../ui/tableBase/TableBaseRow'

interface TableSkeletonLoadingProps {
  rows?: number
  columns?: number
}

const TableSkeletonLoading: React.FC<TableSkeletonLoadingProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse [&_th]:border-r [&_th]:border-[#005dab] [&_td]:border-r [&_td]:border-[#005dab] [&_tr>th:last-child]:border-r-0 [&_tr>td:last-child]:border-r-0 [&_tr>th:last-child[rowspan]]:border-l [&_tr>th:last-child[rowspan]]:border-[#005dab]">
        <TableBaseHead>
          <TableBaseRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableBaseCell key={index} className="px-4 py-2 border text-center">
                <div className="animate-pulse bg-gray-300 h-4 rounded"></div>
              </TableBaseCell>
            ))}
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableBaseRow key={rowIndex} className="hover:bg-gray-50">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableBaseCell key={colIndex} className="px-4 py-2 border text-center">
                  <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                </TableBaseCell>
              ))}
            </TableBaseRow>
          ))}
        </TableBaseBody>
      </table>
    </div>
  )
}

export default TableSkeletonLoading
