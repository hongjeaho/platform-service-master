import { FileText, MessageSquare } from 'lucide-react'
import React from 'react'

interface ReferenceGridRowProps {
  firstColumn?: boolean
  lastColumn?: boolean
  label?: string
  text?: string
}

const ReferenceGridCell: React.FC<ReferenceGridRowProps> = ({
  firstColumn,
  lastColumn,
  label,
  text,
}) => {
  const centerColumn = !firstColumn && !lastColumn

  return (
    <>
      {firstColumn && (
        <div className="border-r border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 min-w-20">{label ?? ''}</h3>
            <p className="text-gray-600 leading-relaxed text-sm flex-1">{text ?? ''}</p>
          </div>
        </div>
      )}

      {centerColumn && (
        <div className="p-6 border-r border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 min-w-20">{label ?? ''}</h3>
            <p className="text-gray-600 text-sm flex-1">{text ?? ''}</p>
          </div>
        </div>
      )}

      {lastColumn && (
        <div className="p-6">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 min-w-20">{label ?? ''}</h3>
            <p className="text-gray-600 text-sm flex-1">{text ?? ''}</p>
          </div>
        </div>
      )}
    </>
  )
}
export default ReferenceGridCell
