import React from 'react'
import { useNavigate } from 'react-router-dom'

import BasicButton from '@/components/common/button/BasicButton'
import CancelButton from '@/components/common/button/CancelButton'
import InputTextBox from '@/components/common/input/inputBox/InputTextBox'
import InputSelectBox from '@/components/common/input/selectBox/InputSelectBox'
import TableBaseBody from '@/components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@/components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'
import TableBaseRow from '@/components/common/ui/tableBase/TableBaseRow'
import type { AdminUserManagementCreateRequest } from '@/model/adminUserManagementCreateRequest'

import useUserManagementForm from './hook/useUserManagementForm'
import useUserManagementSubmit from './hook/useUserManagementSubmit'
import useUserManagementUserIdCheck from './hook/useUserManagementUserIdCheck'
import styles from './UserManagementForm.module.css'

interface UserManagementFormProps {
  isEdit?: boolean
  seq?: number
  userData?: AdminUserManagementCreateRequest
}

const UserManagementForm: React.FC<UserManagementFormProps> = ({
  userData,
  isEdit = false,
  seq,
}) => {
  const navigate = useNavigate()
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useUserManagementForm(userData)
  const { onSubmit } = useUserManagementSubmit({ isEdit, seq })

  const userId = watch('userId')
  const password = watch('userPassword')

  const { handleUserIdCheck, isLoading, isChecked, isDuplicate } =
    useUserManagementUserIdCheck(userId)

  // 아이디 중복확인 관련 에러 계산
  const getUserIdError = () => {
    // 기본 validation 에러가 있으면 그것을 우선 표시
    if (errors?.userId) {
      return errors.userId
    }

    // 편집 모드가 아니고 아이디가 입력된 경우
    if (!isEdit && userId?.trim()) {
      if (!isChecked) {
        return { message: '아이디 중복확인을 해주세요.', type: 'validate' }
      }
      if (isDuplicate) {
        return { message: '이미 사용중인 아이디입니다.', type: 'validate' }
      }
    }

    return undefined
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <TableBaseContainer title="회원 정보" paddingTop={0}>
        <TableBaseBody>
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell width={250}>아이디</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className={styles.idInputContainer}>
                <InputTextBox
                  id="userId"
                  placeholder="사용자 아이디를 입력해주세요"
                  type="text"
                  register={register}
                  error={getUserIdError()}
                  rules={{
                    required: '아이디를 입력해 주세요.',
                  }}
                  disabled={isEdit}
                />
                {!isEdit && (
                  <BasicButton
                    onClick={handleUserIdCheck}
                    disabled={!userId?.trim() || isLoading}
                    variant="secondary"
                    size="md"
                  >
                    {isLoading ? '확인중...' : '중복확인'}
                  </BasicButton>
                )}
              </div>
              {!isEdit && isChecked && !isDuplicate && (
                <div className={styles.successMessage}>
                  <span className={styles.successMessageText}>✓ 사용 가능한 아이디입니다.</span>
                </div>
              )}
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>비밀번호</TableBaseHeadCell>
            <TableBaseCell>
              <InputTextBox
                id="userPassword"
                placeholder={isEdit ? '변경하지 않으려면 비워두세요' : '비밀번호를 입력해주세요'}
                type="password"
                register={register}
                error={errors?.userPassword}
                rules={{
                  required: isEdit ? false : '비밀번호를 입력해 주세요.',
                  minLength: isEdit
                    ? undefined
                    : {
                        value: 8,
                        message: '비밀번호는 8자 이상이어야 합니다.',
                      },
                }}
              />
              {isEdit && <span className={styles.helperText}>* 변경하지 않으려면 비워두세요</span>}
            </TableBaseCell>
            <TableBaseHeadCell>비밀번호 확인</TableBaseHeadCell>
            <TableBaseCell>
              <InputTextBox
                id="userPasswordConfirm"
                placeholder={
                  isEdit ? '변경하지 않으려면 비워두세요' : '비밀번호를 한번 더 입력해주세요'
                }
                type="password"
                register={register}
                error={errors?.userPasswordConfirm}
                rules={{
                  required: isEdit ? false : '비밀번호 확인을 입력해 주세요.',
                  validate: (value: string) => {
                    if (isEdit && !password) {
                      return true
                    }
                    if (value !== password) {
                      return '비밀번호가 일치하지 않습니다.'
                    }
                    return true
                  },
                }}
              />
              {isEdit && <span className={styles.helperText}>* 변경하지 않으려면 비워두세요</span>}
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>이름</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <InputTextBox
                id="userName"
                placeholder="사용자 이름을 입력해주세요"
                type="text"
                register={register}
                error={errors?.userName}
                rules={{
                  required: '이름을 입력해 주세요.',
                }}
              />
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>이메일</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <InputTextBox
                id="userEmail"
                placeholder="이메일을 입력해주세요"
                type="text"
                register={register}
                error={errors?.userEmail}
                rules={{
                  required: '이메일을 입력해 주세요.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '올바른 이메일 형식을 입력해 주세요.',
                  },
                }}
              />
            </TableBaseCell>
          </TableBaseRow>
          <TableBaseRow className="min-h-[60px]">
            <TableBaseHeadCell>권한</TableBaseHeadCell>
            <TableBaseCell colSpan={3}>
              <div className={styles.roleContainer}>
                <InputSelectBox
                  id={'userRole'}
                  control={control}
                  disabled={isEdit}
                  options={[
                    { value: 'ADMIN', label: '관리자' },
                    { value: 'DELIBERATE', label: '위원' },
                    { value: 'DECISION', label: '재결관' },
                  ]}
                  rules={{ required: '권한을 선택해 주세요.' }}
                />
                <span className={styles.roleHelperText}>* 사업시행자는 자동 가입 처리됩니다</span>
              </div>
            </TableBaseCell>
          </TableBaseRow>
        </TableBaseBody>
      </TableBaseContainer>
      <div className={styles.buttonContainer}>
        <BasicButton type="submit" variant="primary" size="md">
          {isEdit ? '수정' : '등록'}
        </BasicButton>
        <CancelButton onClick={() => navigate('/admin/userManagement/application')} size="md">
          취소
        </CancelButton>
      </div>
    </form>
  )
}

export default UserManagementForm
