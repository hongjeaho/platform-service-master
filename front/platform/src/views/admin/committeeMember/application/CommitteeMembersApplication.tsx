import BasicButton from '@components/common/button/BasicButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import { CommitteeMemberRoleLabel } from '@constants/committeeMember/committedMember'
import { useShowAlertMessage, useShowConfirmMessage } from '@store/message'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useDeleteAdminCommitteeMember,
  useGetAdminCommitteeMemberList,
} from '@/api/admin-committee-member-api/admin-committee-member-api'

import styles from './CommitteeMembersApplication.module.css'

const CommitteeMembersApplication: React.FC = () => {
  const navigate = useNavigate()
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const showConfirmMessage = useShowConfirmMessage()
  const showAlertMessage = useShowAlertMessage()
  const { data: committeeMembersData, refetch: refetchCommitteeMembersData } =
    useGetAdminCommitteeMemberList({ ...pagination }, { query: { staleTime: 0 } })

  const { mutate: deleteAdminCommitteeMember } = useDeleteAdminCommitteeMember({
    mutation: {
      onSuccess: () => {
        showAlertMessage('위원회 명단을 삭제하였습니다.')
        refetchCommitteeMembersData()
      },
      onError: () => {
        showAlertMessage('위원회 명단 삭제에 실패했습니다.')
      },
    },
  })

  const handleDelete = (id: number | undefined | null) => {
    showConfirmMessage('위원회 명단을 삭제하시겠습니까?', () => {
      deleteAdminCommitteeMember({ seq: id })
    })
  }

  return (
    <>
      <MainTitle title="위원회 명단 관리" />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.headerTitle}>위원회 명단 현황</h2>
              <p className={styles.headerDescription}>
                토지수용위원회 구성원의 정보를 관리하고 위원회 현황을 파악할 수 있습니다.
              </p>
            </div>
            <BasicButton
              onClick={() => navigate('/admin/committeeMember/write')}
              variant="primary"
              size="md"
            >
              위원 추가
            </BasicButton>
          </div>

          <PlatformDataGridV2
            data={committeeMembersData?.resultList ?? []}
            columns={[
              {
                accessorKey: 'committeeName',
                header: '성명',
                size: 150,
              },
              {
                accessorKey: 'committeeType',
                header: '구분',
                size: 100,
                cell: ({ row }) => {
                  return (
                    <span>
                      {
                        CommitteeMemberRoleLabel[
                          row.original.committeeType as keyof typeof CommitteeMemberRoleLabel
                        ]
                      }
                    </span>
                  )
                },
              },
              {
                accessorKey: 'remarks',
                header: '비고',
                size: 150,
                cell: ({ row }) => {
                  return <span>{row.original.remarks ?? '-'}</span>
                },
              },
              {
                accessorKey: 'actions',
                header: '옵션',
                size: 150,
                cell: ({ row }) => (
                  <div className={styles.actionButtons}>
                    <BasicButton
                      size="sm"
                      variant="outline"
                      className="text-table-cellText border-neutral-300"
                      onClick={() => navigate(`/admin/committeeMember/modify/${row.original?.seq}`)}
                    >
                      수정
                    </BasicButton>
                    <BasicButton
                      size="sm"
                      variant="outline"
                      className="text-semantic-error border-semantic-error"
                      onClick={() => handleDelete(row.original?.seq)}
                    >
                      삭제
                    </BasicButton>
                  </div>
                ),
              },
            ]}
            totalPageSize={committeeMembersData?.total ?? 0}
            pageSize={10}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
            rowId={'id'}
            loading={false}
          />
        </div>
      </div>
    </>
  )
}

export default CommitteeMembersApplication
