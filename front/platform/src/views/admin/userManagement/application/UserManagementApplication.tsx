import UserManagementSearchFilter from '@components/admin/userManagement/UserManagementSearchFilter'
import { BasicButton } from '@components/common/button'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import React, { useCallback, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useGetAdminUserManagementList } from '@/api/admin-user-management-api/admin-user-management-api'
import type { GetAdminUserManagementListParams } from '@/model/getAdminUserManagementListParams'

import styles from './UserManagementApplication.module.css'

const UserManagementApplication: React.FC = () => {
  const navigate = useNavigate()
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const [searchParam, setSearchParam] = useState<GetAdminUserManagementListParams>()

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetAdminUserManagementList(
    {
      ...pagination,
      ...searchParam,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  )

  // 검색 폼 제출 처리
  const handleSearchSubmit: SubmitHandler<GetAdminUserManagementListParams> = data => {
    setSearchParam(params => ({ ...params, ...data, page: 0, pageSize: 10 }))
    void refetch()
  }

  const handleDelete = (id: number | undefined) => {
    console.log('삭제:', id)
    // 삭제 로직 구현
  }

  const getRoleDisplayName = useCallback((roleString: string) => {
    if (roleString.includes('ADMIN')) return '관리자'
    if (roleString.includes('DELIBERATE')) return '위원'
    if (roleString.includes('DECISION')) return '재결관'
    if (roleString.includes('IMPLEMENTER')) return '사업 시행자'
    return ''
  }, [])

  return (
    <>
      <MainTitle title="회원 관리" />
      <div className={styles.container}>
        <UserManagementSearchFilter onSubmit={handleSearchSubmit} />
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.headerTitle}>시스템 사용자 관리</h2>
              <p className={styles.headerDescription}>
                토지수용위원회 시스템의 사용자 계정과 권한을 관리할 수 있습니다.
              </p>
              <p className={styles.headerNote}>
                * 사업시행자와 재결관은 자동 가입 처리되어 수정/삭제가 불가능합니다.
              </p>
            </div>
            <BasicButton
              onClick={() => navigate('/admin/userManagement/write')}
              variant="primary"
              size="md"
            >
              회원 추가
            </BasicButton>
          </div>

          <PlatformDataGridV2
            data={usersData?.resultList || []}
            columns={[
              {
                accessorKey: 'userId',
                header: '아이디',
                size: 120,
              },
              {
                accessorKey: 'userName',
                header: '이름',
                size: 100,
              },
              {
                accessorKey: 'userEmail',
                header: '이메일',
                size: 150,
              },
              {
                accessorKey: 'userRole',
                header: '권한',
                size: 100,
                cell: ({ row }) => {
                  const role = row.original.userRole ?? ''
                  return <span>{getRoleDisplayName(role)}</span>
                },
              },
              {
                accessorKey: 'actions',
                header: '옵션',
                size: 150,
                cell: ({ row }) => {
                  const role = row.original.userRole ?? ''
                  const canEdit = role.includes('ADMIN') || role.includes('DELIBERATE')

                  return (
                    <div className={styles.actionButtons}>
                      <BasicButton
                        size="sm"
                        variant="outline"
                        className="text-table-cellText border-neutral-300"
                        onClick={() => navigate(`/admin/userManagement/modify/${row.original.seq}`)}
                      >
                        수정
                      </BasicButton>
                      {canEdit && (
                        <BasicButton
                          size="sm"
                          variant="outline"
                          className="text-semantic-error border-semantic-error"
                          onClick={() => handleDelete(row.original.seq)}
                        >
                          삭제
                        </BasicButton>
                      )}
                    </div>
                  )
                },
              },
            ]}
            totalPageSize={usersData?.total || 0}
            pageSize={pagination.pageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
            rowId={'seq'}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  )
}

export default UserManagementApplication
