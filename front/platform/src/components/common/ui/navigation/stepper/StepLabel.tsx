import type { StepItem } from '@components/common/ui/navigation/stepper/Stepper'
import React from 'react'

interface StepLabelProps {
  stepData: StepItem
}

const StepLabel: React.FC<StepLabelProps> = ({ stepData }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold flex items-center gap-3">
        <span className="text-blue-600">
          <stepData.icon className="w-7 h-7" />
        </span>
        {stepData.label}
      </h2>
      <div className="flex items-center gap-3">
        {stepData.completed && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            완료됨
          </span>
        )}
      </div>
    </div>
  )
}

export default StepLabel
