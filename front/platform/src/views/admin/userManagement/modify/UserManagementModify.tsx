import UserManagementForm from '@components/admin/userManagement/UserManagementForm'
import UserManagementSkeleton from '@components/admin/userManagement/UserManagementSkeleton'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'
import { useParams } from 'react-router-dom'

import { useGetAdminUserManagement } from '@/api/admin-user-management-api/admin-user-management-api'

interface Params {
  seq: number
}

const UserManagementModify: React.FC = () => {
  const { seq } = useParams() as unknown as Readonly<Params>

  const { data: userManagementData, isLoading } = useGetAdminUserManagement(seq)

  if (isLoading) {
    return (
      <>
        <MainTitle title="회원 수정" />
        <ContainerCenter>
          <UserManagementSkeleton />
        </ContainerCenter>
      </>
    )
  }

  return (
    <>
      <MainTitle title="회원 수정" />
      <ContainerCenter>
        <UserManagementForm seq={seq} isEdit={true} userData={userManagementData} />
      </ContainerCenter>
    </>
  )
}

export default UserManagementModify
