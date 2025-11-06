import BasicButton from '@components/common/button/BasicButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import { useShowAlertMessage, useShowConfirmMessage } from '@store/message'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useDeleteAdminDistrictCharge,
  useGetAdminDistrictChargeList,
} from '@/api/district-charge-api/district-charge-api'

import styles from './DistrictChargesApplication.module.css'

const DistrictChargesApplication: React.FC = () => {
  const navigate = useNavigate()
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const showConfirmMessage = useShowConfirmMessage()
  const showAlertMessage = useShowAlertMessage()
  const { data: districtChargesData, refetch: refetchDistrictChargesData } =
    useGetAdminDistrictChargeList({ ...pagination }, { query: { staleTime: 0 } })

  const { mutate: deleteAdminDistrictCharge } = useDeleteAdminDistrictCharge({
    mutation: {
      onSuccess: () => {
        showAlertMessage('구별 담당자를 삭제 하였습니다.')
        refetchDistrictChargesData()
      },
      onError: () => {
        showAlertMessage('구별 담당자를 삭제에 실패했습니다.')
      },
    },
  })

  const handleDelete = (id: number | undefined | null) => {
    showConfirmMessage('구별 담당자를 삭제 하시겠습니까?', () => {
      deleteAdminDistrictCharge({ seq: id })
    })
  }

  return (
    <>
      <MainTitle title="구별 담당자 관리" />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.headerTitle}>구별 담당자 현황</h2>
              <p className={styles.headerDescription}>
                서울시 각 구별 토지수용 관련 담당자 정보를 관리할 수 있습니다.
              </p>
            </div>
            <BasicButton
              onClick={() => navigate('/admin/districtCharge/write')}
              variant="primary"
              size="md"
            >
              담당자 추가
            </BasicButton>
          </div>

          <PlatformDataGridV2
            data={districtChargesData?.resultList ?? []}
            columns={[
              {
                accessorKey: 'managerName',
                header: '담당자 이름',
                size: 120,
              },
              {
                accessorKey: 'district',
                header: '담당 구',
                size: 400,
                meta: { type: 'text', align: 'left' },
              },
              {
                accessorKey: 'phoneNumber',
                header: '전화번호',
                size: 150,
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
                      onClick={() => navigate(`/admin/districtCharge/modify/${row.original.seq}`)}
                    >
                      수정
                    </BasicButton>
                    <BasicButton
                      size="sm"
                      variant="outline"
                      className="text-semantic-error border-semantic-error"
                      onClick={() => handleDelete(row.original.seq)}
                    >
                      삭제
                    </BasicButton>
                  </div>
                ),
              },
            ]}
            totalPageSize={districtChargesData?.total ?? 0}
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

export default DistrictChargesApplication
