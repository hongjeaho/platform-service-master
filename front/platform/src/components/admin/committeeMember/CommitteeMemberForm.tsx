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
import type { AdminCommitteeMemberEntity } from '@/model/adminCommitteeMemberEntity'

import styles from './CommitteeMemberForm.module.css'
import useCommitteeMemberForm from './hook/useCommitteeMemberForm'
import useCommitteeMemberSubmit from './hook/useCommitteeMemberSubmit'

interface CommitteeMemberFormProps {
  isEdit: boolean
  seq?: number
  committeeMemberData?: AdminCommitteeMemberEntity
}

const CommitteeMemberForm: React.FC<CommitteeMemberFormProps> = ({
  isEdit,
  committeeMemberData,
  seq,
}) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useCommitteeMemberForm(committeeMemberData)

  const { onSubmit } = useCommitteeMemberSubmit({
    isEdit,
    seq,
  })

  const handleCancel = (): void => {
    navigate('/admin/committeeMember/application')
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <TableBaseContainer title="위원회 구성원 정보" paddingTop={0}>
          <TableBaseBody>
            <TableBaseRow>
              <TableBaseHeadCell width={250}>구분</TableBaseHeadCell>
              <TableBaseCell colSpan={3}>
                <InputSelectBox
                  id="committeeType"
                  placeholder="구분을 선택해 주세요"
                  control={control}
                  options={[
                    { value: 'CA001001', label: '위원장' },
                    { value: 'CA001002', label: '위원' },
                    { value: 'CA001003', label: '위원(위원장직무대행)' },
                  ]}
                  rules={{
                    required: '구분을 선택해 주세요.',
                  }}
                />
              </TableBaseCell>
            </TableBaseRow>
            <TableBaseRow>
              <TableBaseHeadCell>성명</TableBaseHeadCell>
              <TableBaseCell colSpan={3}>
                <InputTextBox
                  id="committeeName"
                  placeholder="위원 성명을 입력해주세요"
                  type="text"
                  register={register}
                  error={errors?.committeeName}
                  rules={{
                    required: '성명을 입력해 주세요.',
                  }}
                />
              </TableBaseCell>
            </TableBaseRow>
            <TableBaseRow>
              <TableBaseHeadCell>비고</TableBaseHeadCell>
              <TableBaseCell colSpan={3}>
                <InputTextBox
                  id="remarks"
                  placeholder="예) 내부, 외부 (선택사항)"
                  type="text"
                  register={register}
                  error={errors?.remarks}
                  rules={{
                    required: false, // 비고는 선택사항
                  }}
                />
              </TableBaseCell>
            </TableBaseRow>
          </TableBaseBody>
        </TableBaseContainer>

        <div className={styles.buttonContainer}>
          <BasicButton type="submit" variant="primary" size="md">
            {isEdit ? '수정' : '등록'}
          </BasicButton>
          <CancelButton size="md" onClick={handleCancel}>
            취소
          </CancelButton>
        </div>
      </form>
    </>
  )
}

export default CommitteeMemberForm
