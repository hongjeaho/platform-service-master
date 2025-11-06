import React, { type PropsWithChildren } from 'react'

interface TableBaseFooterProps extends PropsWithChildren {}

const TableBaseFooter: React.FC<TableBaseFooterProps> = ({ children }) => {
  return <tfoot>{children}</tfoot>
}
export default TableBaseFooter
