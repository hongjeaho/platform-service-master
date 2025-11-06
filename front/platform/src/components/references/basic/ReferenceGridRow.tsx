import React, { type PropsWithChildren } from 'react'

interface ReferenceBodyProps extends PropsWithChildren {
  columnCount?: number
}

const ReferenceGridRow: React.FC<ReferenceBodyProps> = ({ children, columnCount }) => {
  const className = `grid grid-cols-${columnCount} gap-0 border-b border-gray-200`
  return (
    <>
      <div className={className}>{children}</div>
    </>
  )
}
export default ReferenceGridRow
