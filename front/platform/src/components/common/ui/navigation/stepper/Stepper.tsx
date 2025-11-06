import { Check, type LucideIcon } from 'lucide-react'
import React from 'react'

export interface StepItem {
  label: string
  code: string
  icon: LucideIcon
  completed: boolean
}

export interface StepperProps {
  steps: StepItem[]
  currentStep: number
  onStepClick?: (index: number) => void
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full px-4 py-8">
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = step.completed
          const isActive = index === currentStep
          const isClickable = step.completed // 완료된 스텝만 클릭 가능

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative flex items-center w-full">
                {/* Left Line */}
                {index > 0 && (
                  <div className="absolute left-0 w-1/2 h-1 top-1/2 transform -translate-y-1/2">
                    <div
                      className={`h-full ${
                        (steps[index - 1].completed && steps[index].completed) ||
                        (steps[index - 1].completed && index === currentStep)
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    />
                  </div>
                )}

                {/* Right Line */}
                {index < steps.length - 1 && (
                  <div className="absolute right-0 w-1/2 h-1 top-1/2 transform -translate-y-1/2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        (steps[index].completed && steps[index + 1].completed) ||
                        (steps[index].completed && index + 1 === currentStep)
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick && onStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-14 h-14 rounded-full 
                    transition-all duration-200 font-semibold z-10 mx-auto
                    ${isClickable ? 'cursor-pointer transform hover:scale-110' : 'cursor-not-allowed'}
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                        : isCompleted
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon
                      className={`w-6 h-6 ${isActive || isCompleted ? '' : 'opacity-50'}`}
                    />
                  )}
                </button>
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={`text-sm font-medium leading-tight ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper
