import BoardQuestionAnswerSearchFilter from '@components/board/questionAnswer/BoardQuestionAnswerSearchFilter'
import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import { NotebookPen } from 'lucide-react'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useGetBoardQuestionAnswerResultList } from '@/api/board-question-and-answer-api/board-question-and-answer-api'
import type { GetBoardQuestionAnswerResultListParams } from '@/model'

const BoardQuestionAnswerApplication: React.FC = () => {
  const navigate = useNavigate()
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()
  const [searchParam, setSearchParam] = useState<GetBoardQuestionAnswerResultListParams>({})

  const { data, isLoading, refetch } = useGetBoardQuestionAnswerResultList(
    {
      ...searchParam,
      ...pagination,
      boardCategoryCode: 'CB001003',
    },
    {
      query: {
        staleTime: 0, // 0분 동안 fresh 상태 유지
      },
    },
  )

  const handleSearchSubmit: SubmitHandler<GetBoardQuestionAnswerResultListParams> = async data => {
    setSearchParam(params => ({
      ...params,
      ...data,
      page: 0,
      pageSize: pagination.pageSize,
    }))
    void refetch()
  }
  const handleButtonClick = () => {
    navigate(`/board/questionAnswer/write`)
  }

  return (
    <>
      <MainTitle title="묻고 답하기" />
      <ContainerCenter>
        <BoardQuestionAnswerSearchFilter onSubmit={handleSearchSubmit} />
        <div className={'flex justify-end'}>
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-main focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors duration-200 flex items-center cursor-pointer"
          >
            질문 등록
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
              size: 665,
              cell: ({ row }) => {
                return (
                  <PlatformDataGridV2LinkButton
                    link={`/board/questionAnswer/application/${row.original.seq}`}
                    title={row.getValue('title')}
                  ></PlatformDataGridV2LinkButton>
                )
              },
            },
            {
              accessorKey: 'reply',
              header: '답변여부',
              size: 100,
            },
            {
              accessorKey: 'writerId',
              header: '담당자',
              size: 200,
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
export default BoardQuestionAnswerApplication
