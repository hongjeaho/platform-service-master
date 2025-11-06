import React from 'react'

import mainTitleImage from '@/assets/images/title/maintitle.jpg'

import styles from './MainTitle.module.css'

interface MainTitleProps {
  title: string
}

const MainTitle: React.FC<MainTitleProps> = ({ title }) => {
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${mainTitleImage})` }}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  )
}
export default MainTitle
