import { type ReceiptQuantityReportEntity } from '@/model'

type QuantityReportEntityKey = keyof ReceiptQuantityReportEntity

interface LabelItem {
  id: QuantityReportEntityKey | ''
  disabled?: boolean
  fixedDecimalScale?: boolean
}

interface TotalQuantityReportLabelGroup {
  label: string
  list: LabelItem[]
}

export const totalQuantityReportLabels: TotalQuantityReportLabelGroup[] = [
  {
    label: '토 지',
    list: [
      {
        id: 'totalLandCnt',
        disabled: true,
        fixedDecimalScale: false,
      },
      {
        id: 'totalLandArea',
        disabled: true,
        fixedDecimalScale: true,
      },
      {
        id: 'totalLandPrice',
        disabled: true,
        fixedDecimalScale: false,
      },
      { id: 'landCnt', disabled: false, fixedDecimalScale: false },
      { id: 'landArea', disabled: false, fixedDecimalScale: true },
      { id: 'landPrice', disabled: false, fixedDecimalScale: false },
      {
        id: 'decisionLandCnt',
        disabled: false,
        fixedDecimalScale: false,
      },
      {
        id: 'decisionLandArea',
        disabled: false,
        fixedDecimalScale: true,
      },
      {
        id: 'decisionLandPrice',
        disabled: false,
        fixedDecimalScale: false,
      },
    ],
  },
  {
    label: '물건',
    list: [
      { id: 'totalObjCnt', disabled: true, fixedDecimalScale: false },
      { id: '', disabled: true, fixedDecimalScale: false },
      {
        id: 'totalObjPrice',
        disabled: true,
        fixedDecimalScale: false,
      },
      { id: 'objCnt', disabled: false, fixedDecimalScale: false },
      { id: '', disabled: true, fixedDecimalScale: false },
      { id: 'objPrice', disabled: false, fixedDecimalScale: false },
      {
        id: 'decisionObjCnt',
        disabled: false,
        fixedDecimalScale: false,
      },
      { id: '', disabled: true, fixedDecimalScale: false },
      {
        id: 'decisionObjPrice',
        disabled: false,
        fixedDecimalScale: false,
      },
    ],
  },
  {
    label: '영업권',
    list: [
      {
        id: 'totalGoodwillCnt',
        disabled: true,
        fixedDecimalScale: false,
      },
      { id: '', disabled: true, fixedDecimalScale: false },
      {
        id: 'totalGoodwillPrice',
        disabled: true,
        fixedDecimalScale: false,
      },
      { id: 'goodwillCnt', disabled: false, fixedDecimalScale: false },
      { id: '', disabled: true, fixedDecimalScale: false },
      {
        id: 'goodwillPrice',
        disabled: false,
        fixedDecimalScale: false,
      },
      {
        id: 'decisionGoodwillCnt',
        disabled: false,
        fixedDecimalScale: false,
      },
      { id: '', disabled: true, fixedDecimalScale: false },
      {
        id: 'decisionGoodwillPrice',
        disabled: false,
        fixedDecimalScale: false,
      },
    ],
  },
  {
    label: '기타',
    list: [
      { id: 'totalEtcCnt', disabled: true, fixedDecimalScale: false },
      { id: 'totalEtcArea', disabled: true, fixedDecimalScale: true },
      {
        id: 'totalEtcPrice',
        disabled: true,
        fixedDecimalScale: false,
      },
      { id: 'etcCnt', disabled: false, fixedDecimalScale: false },
      { id: 'etcArea', disabled: false, fixedDecimalScale: true },
      { id: 'etcPrice', disabled: false, fixedDecimalScale: false },
      {
        id: 'decisionEtcCnt',
        disabled: false,
        fixedDecimalScale: false,
      },
      {
        id: 'decisionEtcArea',
        disabled: false,
        fixedDecimalScale: true,
      },
      {
        id: 'decisionEtcPrice',
        disabled: false,
        fixedDecimalScale: false,
      },
    ],
  },
]
