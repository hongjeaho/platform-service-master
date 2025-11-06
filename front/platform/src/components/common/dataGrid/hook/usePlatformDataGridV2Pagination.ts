import { useCallback, useState } from 'react'

export interface PlatformDataGridV2PaginationProps {
  page: number
  pageSize: number
}

const usePlatformDataGridV2Pagination = (props?: PlatformDataGridV2PaginationProps) => {
  const [pagination, setPagination] = useState<PlatformDataGridV2PaginationProps>({
    page: props?.page ?? 0,
    pageSize: props?.pageSize ?? 10,
  })

  const onChangePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const onChangePageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 0 }))
  }, [])

  return {
    pagination,
    setPagination,
    onChangePage,
    onChangePageSize,
  }
}

export default usePlatformDataGridV2Pagination
