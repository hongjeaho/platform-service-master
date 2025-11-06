import React, { type PropsWithChildren } from 'react'

interface TableBaseRowProps extends PropsWithChildren {
  className?: string
}

const TableBaseRow: React.FC<TableBaseRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>
}
export default TableBaseRow
