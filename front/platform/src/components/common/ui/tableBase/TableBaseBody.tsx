import React, { type PropsWithChildren } from 'react'

interface TableBaseBodyProps extends PropsWithChildren {}

const TableBaseBody: React.FC<TableBaseBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>
}
export default TableBaseBody
