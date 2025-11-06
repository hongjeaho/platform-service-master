import ContainerCenter from '@components/common/ContainerCenter'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import ViewLoading from '@components/common/loading/ViewLoading'
import React from 'react'

import useLoginForm from '@/views/login/hook/useLoginForm'
import useLoginSubmit from '@/views/login/hook/useLoginSubmit'

import styles from './LoginApplication.module.css'

const LoginApplication: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useLoginForm()

  const { onSubmit, isPending } = useLoginSubmit()

  return (
    <div className={styles.background}>
      <ViewLoading isVisible={isPending} message="로그인 중입니다..." />
      <ContainerCenter>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>로그인</h1>
          </div>
          <div className={styles.cardInner}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
              <div className={styles.formContainer}>
                <div className={styles.formInner}>
                  <div className={styles.formField}>
                    <label htmlFor="id" className={styles.label}>
                      아이디
                    </label>
                    <InputTextBox
                      id="id"
                      placeholder="아이디를 입력해 주세요."
                      type="text"
                      register={register}
                      error={errors?.id}
                      rules={{
                        required: '아이디를 입력하세요.',
                        minLength: {
                          value: 4,
                          message: '아이디를 4자리 이상이어야 합니다.',
                        },
                      }}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="password" className={styles.label}>
                      비밀번호
                    </label>
                    <InputTextBox
                      id="password"
                      placeholder="비밀번호를 입력해주세요."
                      type="password"
                      register={register}
                      error={errors?.password}
                      rules={{
                        required: '비밀번호를 확인해 주세요.',
                        minLength: {
                          value: 5,
                          message: '비밀번호는 5자리 이상이어야 합니다.',
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isPending} className={styles.submitButton}>
                {isPending ? (
                  <div className={styles.loadingContent}>
                    <svg className={styles.spinner} viewBox="0 0 24 24">
                      <circle
                        className={styles.spinnerCircle}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className={styles.spinnerPath}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    로그인 중...
                  </div>
                ) : (
                  '로그인'
                )}
              </button>
            </form>
          </div>
          <div className={styles.footer}>
            <p className={styles.footerText}>
              계정이 없으신가요?{' '}
              <button type="button" className={styles.footerLink}>
                회원가입
              </button>
            </p>
          </div>
        </div>
      </ContainerCenter>
    </div>
  )
}
export default LoginApplication
