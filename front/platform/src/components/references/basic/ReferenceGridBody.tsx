import React, { type PropsWithChildren } from 'react'

interface ReferenceGridProps extends PropsWithChildren {}

const ReferenceGridBody: React.FC<ReferenceGridProps> = ({ children }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="overflow-hidden">{children}</div>
      </div>
    </>
  )
}
export default ReferenceGridBody
