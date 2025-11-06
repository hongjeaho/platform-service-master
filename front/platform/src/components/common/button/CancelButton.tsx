import React from 'react'

import styles from './CancelButton.module.css'

interface CancelButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children = '취소',
  size = 'md',
}) => {
  const buttonClasses = `${styles.button} ${styles[size]} ${className}`

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={buttonClasses}>
      {children}
    </button>
  )
}

export default CancelButton
