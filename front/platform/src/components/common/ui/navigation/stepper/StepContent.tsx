import React, { type PropsWithChildren } from 'react'

interface StepContentProps extends PropsWithChildren {}

const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return <div className="bg-white rounded-lg shadow-lg p-8 mb-8">{children}</div>
}

export default StepContent
