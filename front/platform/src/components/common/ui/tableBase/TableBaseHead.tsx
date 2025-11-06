import React, { type PropsWithChildren } from 'react'

import styles from './TableBase.module.css'

interface TableBaseHeadProps extends PropsWithChildren {}

const TableBaseHead: React.FC<TableBaseHeadProps> = ({ children }) => {
  return <thead className={styles.thead}>{children}</thead>
}
export default TableBaseHead
