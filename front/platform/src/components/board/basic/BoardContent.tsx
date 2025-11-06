import React, { type PropsWithChildren } from 'react'

interface BoardQuestionContentProps extends PropsWithChildren {
  title?: string
}

const BoardContent: React.FC<BoardQuestionContentProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
      <div className="px-6 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-6 py-8 text-left text-gray-500">{children}</div>
    </div>
  )
}
export default BoardContent
