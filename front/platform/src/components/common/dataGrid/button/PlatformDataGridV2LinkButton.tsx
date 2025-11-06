import React from 'react'
import { Link } from 'react-router-dom'

interface PlatformDataGridLinkButtonProps {
  title?: string
  link: string
}

const PlatformDataGridV2LinkButton: React.FC<PlatformDataGridLinkButtonProps> = ({
  title,
  link,
}) => {
  return (
    <Link
      to={link}
      className="text-gray-800 hover:text-red-600 hover:underline underline-offset-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      title={title} // 호버 시 전체 텍스트 표시를 위한 title 속성
      style={{
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        width: '100%',
      }}
    >
      {title}
    </Link>
  )
}

export default PlatformDataGridV2LinkButton
