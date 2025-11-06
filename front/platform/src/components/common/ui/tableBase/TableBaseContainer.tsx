import React, { type PropsWithChildren } from 'react'

import TableSkeletonLoading from '@/components/common/loading/TableSkeletonLoading'
import { SPACING } from '@/constants/design'

import styles from './TableBase.module.css'

interface TableContainerProps extends PropsWithChildren {
  title?: string
  subTitle?: string
  paddingTop?: number
  isLoading?: boolean
}

const TableBaseContainer: React.FC<TableContainerProps> = ({
  title,
  subTitle,
  children,
  paddingTop = 30,
  isLoading = false,
}) => {
  if (isLoading) {
    return <TableSkeletonLoading />
  }

  // paddingTop이 기본값이면 디자인 토큰 사용, 아니면 사용자 지정값 사용
  const topPadding = paddingTop === 30 ? SPACING.container.paddingTop : `${paddingTop}px`

  return (
    <div style={{ paddingTop: topPadding }}>
      {(title || subTitle) && (
        <div className={styles.titleSection}>
          {title && <span className={styles.title}>{title}</span>}
          {subTitle && <span className={styles.subTitle}>{subTitle}</span>}
        </div>
      )}

      <div className={styles.container}>
        <table className={styles.table}>{children}</table>
      </div>
    </div>
  )
}

export default TableBaseContainer
