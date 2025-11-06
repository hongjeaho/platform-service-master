import React from 'react'

interface ContainerTitleProps {
  title?: string
  subTitle?: string
  className?: string
}

const ContainerTitle: React.FC<ContainerTitleProps> = ({ title, subTitle, className }) => {
  return (
    <div className={`mb-1 flex justify-between ${className}`}>
      {title && <span className="text-[22px] font-bold text-[#274ba9]">{title}</span>}
      {subTitle && <span className="text-[16px] text-[#274ba9]">{subTitle}</span>}
    </div>
  )
}

export default ContainerTitle
