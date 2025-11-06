import React, { type PropsWithChildren } from 'react'

import styles from './ContainerCenter.module.css'

const ContainerCenter: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}
export default ContainerCenter
