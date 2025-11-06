import BoardAnnouncementSearchFilter from '@components/board/announcement/BoardAnnouncementSearchFilter'
import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import { NotebookPen } from 'lucide-react'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useGetBoardAnnouncementList } from '@/api/board-announcement-api/board-announcement-api'
import type { GetBoardAnnouncementListParams } from '@/model'

const BoardAnnouncementApplication: React.FC = () => {
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const [searchParam, setSearchParam] = useState<GetBoardAnnouncementListParams>({})
  const navigate = useNavigate()
  const { data, isLoading, refetch } = useGetBoardAnnouncementList(
    {
      ...searchParam,
      ...pagination,
      boardCategoryCode: 'CB001002',
    },
    {
      query: {
        staleTime: 0, // 0분 동안 fresh 상태 유지
      },
    },
  )

  const handleSearchSubmit: SubmitHandler<GetBoardAnnouncementListParams> = async data => {
    setSearchParam(params => ({
      ...params,
      ...data,
      page: 0,
      pageSize: pagination.pageSize,
    }))
    void refetch()
  }

  const handleButtonClick = () => {
    navigate(`/board/announcement/write`)
  }

  return (
    <>
      <MainTitle title="공지사항" />
      <ContainerCenter>
        <BoardAnnouncementSearchFilter onSubmit={handleSearchSubmit} />
        <div className={'flex justify-end'}>
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-main focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors duration-200 flex items-center cursor-pointer"
          >
            공지사항 등록
            <NotebookPen className="w-4 h-4 mr-2" />
          </button>
        </div>
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'updatedTime',
              header: '작성일',
              size: 200,
            },
            {
              accessorKey: 'title',
              header: '제목',
              size: 750,
              cell: ({ row }) => {
                return (
                  <PlatformDataGridV2LinkButton
                    link={`/board/announcement/application/${row.original.seq}`}
                    title={row.getValue('title')}
                  ></PlatformDataGridV2LinkButton>
                )
              },
            },
            {
              accessorKey: 'writerId',
              header: '담당자',
              size: 220,
            },
            {
              accessorKey: 'viewCount',
              header: '조회수',
              size: 100,
            },
          ]}
          totalPageSize={data?.total ?? 0} // 전체 카운터
          pageSize={searchParam.pageSize ?? 10}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'seq'} // grid unique
          loading={isLoading}
          hideHorizontalScrollbar // 가로 스크롤 숨김처리
        />
      </ContainerCenter>
    </>
  )
}
export default BoardAnnouncementApplication
