import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'

import { useGetAdminCommitteeMemberList } from '@/api/admin-committee-member-api/admin-committee-member-api'
import { CommitteeMemberRoleLabel } from '@/constants/committeeMember/committedMember'

const CommitteeApplication: React.FC = () => {
  const { data: committeeListData, isLoading } = useGetAdminCommitteeMemberList()

  return (
    <>
      <MainTitle title="지방토지 수용위원회" />
      <ContainerCenter>
        <section>
          <div className="text-2xl font-bold mb-2 text-sky-700">지방토지수용위원회 위원명단</div>
          <div className="text-right text-sm text-neutral-500 mb-4"></div>
          <TableBaseContainer isLoading={isLoading}>
            <TableBaseHead>
              <TableBaseRow>
                <TableBaseHeadCell width="15%">연번</TableBaseHeadCell>
                <TableBaseHeadCell width="20%">구분</TableBaseHeadCell>
                <TableBaseHeadCell width="25%">이름</TableBaseHeadCell>
                <TableBaseHeadCell width="40%">비고</TableBaseHeadCell>
              </TableBaseRow>
            </TableBaseHead>
            <TableBaseBody>
              {committeeListData?.resultList?.map((Committee, index) => (
                <TableBaseRow key={index} className="hover:bg-table-cellBgHover">
                  <TableBaseCell align="center">{index + 1}</TableBaseCell>
                  <TableBaseCell align="center">
                    {
                      CommitteeMemberRoleLabel[
                        Committee.committeeType as keyof typeof CommitteeMemberRoleLabel
                      ]
                    }
                  </TableBaseCell>
                  <TableBaseCell align="center">{Committee.committeeName}</TableBaseCell>
                  <TableBaseCell align="center">{Committee.remarks}</TableBaseCell>
                </TableBaseRow>
              ))}
            </TableBaseBody>
          </TableBaseContainer>
        </section>
      </ContainerCenter>
    </>
  )
}

export default CommitteeApplication
