import { Loader2 } from 'lucide-react'
import React from 'react'

interface BasicSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'green' | 'purple' | 'red'
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const BasicSpinner: React.FC<BasicSpinnerProps> = ({ size = 'md', color = 'blue', text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-${color}-500`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export default BasicSpinner
