import React, { type PropsWithChildren } from 'react'

import styles from './TableBase.module.css'

interface TableBaseCellProps extends PropsWithChildren {
  rowSpan?: number
  colSpan?: number
  width?: string | number
  variant?: 'header' | 'body'
  align?: 'left' | 'center' | 'right'
  className?: string
}

const TableBaseCell: React.FC<TableBaseCellProps> = ({
  children,
  rowSpan,
  colSpan,
  width,
  variant = 'body',
  align = 'left',
  className = '',
}) => {
  const Component = variant === 'header' ? 'th' : 'td'

  const cellStyles = variant === 'header' ? styles.th : styles.td

  const alignStyles = {
    left: styles.textLeft,
    center: styles.textCenter,
    right: styles.textRight,
  }

  return (
    <Component
      rowSpan={rowSpan}
      colSpan={colSpan}
      className={`${cellStyles} ${alignStyles[align]} ${className}`}
      style={{ width }}
    >
      {children}
    </Component>
  )
}

export const TableBaseHeadCell: React.FC<Omit<TableBaseCellProps, 'variant'>> = props => {
  return <TableBaseCell {...props} align={'center'} variant="header" />
}

export default TableBaseCell
