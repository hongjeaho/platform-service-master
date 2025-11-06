import React from 'react'

import styles from './BasicButton.module.css'

interface BasicButtonProps {
  formId?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const BasicButton: React.FC<BasicButtonProps> = ({
  formId,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`

  return (
    <button
      form={formId}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  )
}

export default BasicButton
