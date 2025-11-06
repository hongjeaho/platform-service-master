import React, { type PropsWithChildren } from 'react'

interface StepBodyProps extends PropsWithChildren {}

const StepBody: React.FC<StepBodyProps> = ({ children }) => {
  return (
    <div className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export default StepBody
