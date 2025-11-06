import CommitteeMemberForm from '@components/admin/committeeMember/CommitteeMemberForm'
import CommitteeMemberSkeleton from '@components/admin/committeeMember/CommitteeMemberSkeleton'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'
import { useParams } from 'react-router-dom'

import { useGetAdminCommitteeMember } from '@/api/admin-committee-member-api/admin-committee-member-api'

const CommitteeMemberModify: React.FC = () => {
  const { seq } = useParams<{ seq: string }>()
  const committeeMemberSeq = Number(seq)

  const { data: committeeMemberData, isLoading } = useGetAdminCommitteeMember(committeeMemberSeq)

  return (
    <>
      <MainTitle title={'위원회 구성원 수정'} />
      <ContainerCenter>
        {isLoading ? (
          <CommitteeMemberSkeleton />
        ) : (
          <CommitteeMemberForm
            isEdit={true}
            seq={committeeMemberSeq}
            committeeMemberData={committeeMemberData}
          />
        )}
      </ContainerCenter>
    </>
  )
}

export default CommitteeMemberModify
