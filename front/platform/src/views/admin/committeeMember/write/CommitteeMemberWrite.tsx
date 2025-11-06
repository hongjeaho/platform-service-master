import CommitteeMemberForm from '@components/admin/committeeMember/CommitteeMemberForm'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'

const CommitteeMemberWrite: React.FC = () => {
  return (
    <>
      <MainTitle title={'위원회 구성원 등록'} />
      <ContainerCenter>
        <CommitteeMemberForm isEdit={false} />
      </ContainerCenter>
    </>
  )
}

export default CommitteeMemberWrite
