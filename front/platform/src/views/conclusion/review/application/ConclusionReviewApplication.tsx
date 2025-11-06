// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import ContainerCenter from '@components/common/ContainerCenter'
import PlatformDataGridV2LinkButton from '@components/common/dataGrid/button/PlatformDataGridV2LinkButton'
import usePlatformDataGridV2Pagination from '@components/common/dataGrid/hook/usePlatformDataGridV2Pagination'
import PlatformDataGridV2 from '@components/common/dataGrid/PlatformDataGridV2'
import MainTitle from '@components/common/MainTitle'
import ConclusionSearchFilter from '@components/conclusion/ConclusionSearchFilter'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'

// 3. API 및 타입
import { useGetConclusionInfoList } from '@/api/conclusion-base-api/conclusion-base-api'
import type { GetConclusionInfoListParams } from '@/model'

// 페이지네이션 기본값
const DEFAULT_PAGE_SIZE = 10
const INITIAL_PAGE = 0

// 재결 검토 상태 코드
const CONCLUSION_STATUS = {
  WAITING: 'CC001000', // 재결관 검토 대기
  IN_PROGRESS: 'CC001001', // 재결관 검토 진행중
  COMPLETED: 'CC001002', // 재결관 검토 완료
} as const

/**
 * 재결 검토 상태 코드에 따른 상세 페이지 링크 생성
 * @param judgSeq - 재결 일련번호
 * @param statusCode - 재결 검토 상태 코드
 * @returns 상세 페이지 경로
 */
const getConclusionDetailLink = (judgSeq: string | number, statusCode: string): string => {
  const baseUrl = `/conclusion/application/${judgSeq}`

  // 재결관 검토 진행중
  if (statusCode === CONCLUSION_STATUS.IN_PROGRESS) {
    return `${baseUrl}/progress`
  }

  // 재결관 검토 완료
  if (statusCode === CONCLUSION_STATUS.COMPLETED) {
    return `${baseUrl}/complete`
  }

  // 재결관 검토 대기 (start)
  return baseUrl
}

/**
 * 재결 검토 목록 페이지 컴포넌트
 * - 재결 검토 신청 목록 조회 및 표시
 * - 검색 필터링 기능 (사건번호, 사업명, 접수일, 검토 진행현황)
 * - 페이지네이션 지원
 * - 상태별 상세 페이지 링크 제공
 */
const ConclusionReviewApplication: React.FC = () => {
  // 검색 파라미터 상태 관리
  const [searchParam, setSearchParam] = useState<GetConclusionInfoListParams>({})

  // 페이지네이션 상태 및 핸들러
  const { pagination, onChangePage, onChangePageSize } = usePlatformDataGridV2Pagination()

  // 재결 검토 목록 조회 (검색 조건 + 페이지네이션)
  const { data, isLoading, refetch } = useGetConclusionInfoList({ ...searchParam, ...pagination })

  /**
   * 검색 폼 제출 핸들러
   * - 검색 조건을 상태에 저장
   * - 페이지를 첫 페이지로 초기화
   * - 목록 재조회
   */
  const handleSearchSubmit: SubmitHandler<GetConclusionInfoListParams> = data => {
    setSearchParam(params => ({
      ...params,
      ...data,
      page: INITIAL_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }))
    void refetch()
  }

  return (
    <>
      <MainTitle title="재결 검토" />
      <ContainerCenter>
        <ConclusionSearchFilter onSubmit={handleSearchSubmit} />
        <PlatformDataGridV2
          data={data?.resultList ?? []}
          columns={[
            {
              accessorKey: 'judgSeq',
              header: '재결일련번호',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'caseNo',
              header: '사건번호',
              size: 100,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'caseTitle',
              header: '사업명',
              meta: { type: 'text' },
              cell: ({ row }) => {
                const judgSeq = (row.getValue('judgSeq') as string) ?? '0'
                const statusCode = row.original.statusCode ?? ''
                const link = getConclusionDetailLink(judgSeq, statusCode)

                return (
                  <PlatformDataGridV2LinkButton link={link} title={row.getValue('caseTitle')} />
                )
              },
            },
            {
              accessorKey: 'chargeNm',
              header: '담당자',
              size: 120,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'statusName',
              header: '검토 진행상태',
              size: 110,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'ltisStateName',
              header: 'LTIS 진행상태',
              size: 170,
              meta: { type: 'text' },
            },
            {
              accessorKey: 'pdfView',
              header: 'PDF 미리보기',
              size: 170,
              meta: { type: 'text', align: 'center' },
            },
          ]}
          totalPageSize={data?.total ?? 0}
          pageSize={searchParam.pageSize ?? DEFAULT_PAGE_SIZE}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
          rowId={'judgSeq'}
          loading={isLoading}
        />
      </ContainerCenter>
    </>
  )
}
export default ConclusionReviewApplication
