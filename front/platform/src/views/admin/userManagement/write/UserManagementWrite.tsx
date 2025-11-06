import UserManagementForm from '@components/admin/userManagement/UserManagementForm'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

const UserManagementWrite: React.FC = () => {
  return (
    <>
      <MainTitle title="회원 등록" />
      <ContainerCenter>
        <UserManagementForm isEdit={false} />
      </ContainerCenter>
    </>
  )
}

export default UserManagementWrite
