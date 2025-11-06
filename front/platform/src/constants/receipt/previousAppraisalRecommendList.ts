import { type ReceiptPreviousAppraisalRecommend } from '@/model'

export const previousAppraisalRecommendList: AppraisalRecommend[] = [
  {
    recommendTypeCode: 'CR003001',
    recommendTypeName: '사업시행자 추천',
  },
  {
    recommendTypeCode: 'CR003002',
    recommendTypeName: '시도지사 추천',
  },
  {
    recommendTypeCode: 'CR003003',
    recommendTypeName: '토지소유자 추천',
  },
  {
    recommendTypeCode: 'CR003004',
    recommendTypeName: '추가 사업시행자 추천',
  },
]

export interface AppraisalRecommend extends ReceiptPreviousAppraisalRecommend {
  recommendTypeName: string
}
