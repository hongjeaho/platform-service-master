import type { Attachment } from '@/model'

export const attachmentCategories: ReceiptAttachmentCategory[] = [
  {
    name: '적정성 검토서',
    required: true,
    documents: [
      {
        name: '적정성 검토서',
        typeCode: 'CR002001',
        multiple: false,
        required: true,
      },
    ],
  },
  {
    name: '신청 문서(공문)',
    required: true,
    documents: [
      {
        name: '신청 문서(공문)',
        typeCode: 'CR002002',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    name: '재결 신청서',
    required: true,
    documents: [
      {
        name: '재결 신청서',
        typeCode: 'CR002003',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    name: '재결신청 청구서',
    required: false,
    documents: [
      {
        name: '재결신청 청구서',
        typeCode: 'CR002004',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    name: '사업계획서',
    required: true,
    documents: [
      {
        name: '사업계획서',
        typeCode: 'CR002005',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    name: '사업인정 관련 고시',
    required: true,
    documents: [
      {
        name: '구역결정 고시문',
        typeCode: 'CR002006',
        required: true,
        multiple: false,
      },
      {
        name: '사업시행실시계획인가(시행인가)',
        typeCode: 'CR002007',
        required: true,
        message: '※ 변경고시(인가) 등 제출 서류가 있는 경우 추가 버튼 눌러 업로드 해주세요',
        multiple: true,
      },
    ],
  },
  {
    name: '최초(도시계획결정 및 변경) 고시 사본 (구보등)',
    required: true,
    documents: [
      {
        name: '최초(도시계획결정 및 변경) 고시 사본 (구보등)',
        typeCode: 'CR002008',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    name: '중토위 의견청취 관련 문서',
    required: true,
    documents: [
      {
        name: '결과 회신 공문 사본',
        typeCode: 'CR002009',
        required: true,
        multiple: false,
      },
      {
        name: '이행(보완)여부 자료',
        typeCode: 'CR002010',
        required: false,
        multiple: false,
      },
      {
        name: '이행(보완)여부 확인 증빙 서류',
        typeCode: 'CR002011',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    name: '소유자별서류',
    required: true,
    documents: [
      {
        name: '사업시행자 제시액 조서',
        typeCode: 'CR002012',
        required: true,
        multiple: false,
      },
      {
        name: '토지조서(조서별 세목고시 첨부)',
        typeCode: 'CR002013',
        required: false,
        multiple: false,
      },
      {
        name: '물건조서',
        typeCode: 'CR002014',
        required: false,
        multiple: false,
      },
      {
        name: '협의 경위서',
        typeCode: 'CR002015',
        required: true,
        multiple: false,
      },
      {
        name: '토지 대장',
        typeCode: 'CR002016',
        required: false,
        multiple: false,
      },
      {
        name: '등기사항전부증명서',
        typeCode: 'CR002017',
        required: false,
        multiple: false,
      },
      {
        name: '토지이용계획확인서',
        typeCode: 'CR002018',
        required: false,
        multiple: false,
      },
      {
        name: '지적도',
        typeCode: 'CR002019',
        required: false,
        multiple: false,
      },
      {
        name: '측량도면',
        typeCode: 'CR002020',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    name: '사업 예정지 및 사업계획 도면',
    required: false,
    documents: [
      {
        name: '사업 예정지 및 사업계획 도면',
        typeCode: 'CR002021',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    name: '협의관계서류',
    required: true,
    documents: [
      {
        name: '보상계획공고',
        typeCode: 'CR002022',
        required: true,
        multiple: false,
      },
      {
        name: '손실보상 협의 요청문서',
        typeCode: 'CR002023',
        required: true,
        multiple: false,
      },
      {
        name: '공시 송달문서',
        typeCode: 'CR002024',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    name: '기본 조사서',
    required: false,
    documents: [
      {
        name: '토지 기본 조사서',
        typeCode: 'CR002025',
        required: false,
        multiple: false,
      },
      {
        name: '물건 기본 조사서',
        typeCode: 'CR002026',
        required: false,
        multiple: false,
        message: '※ 2024.4.9 이후 보상계획 공고 또는 통지된 사업은 필수 업로드 해주세요',
      },
    ],
  },
  {
    name: '기타 증빙서류',
    message: '※ 기타 증빙서류가 있는 경우 추가 버튼 눌러 업로드 해주세요',
    required: false,
    documents: [
      {
        name: '기타 증빙서류',
        typeCode: 'CR002027',
        required: false,
        multiple: true,
      },
    ],
  },
]

export interface ReceiptAttachmentCategory {
  name: string
  message?: string
  required: boolean
  documents: DocumentAttachment[]
}

export interface DocumentAttachment {
  name: string
  required: boolean
  multiple: boolean
  message?: string
  typeCode: string
  attachments?: Attachment | Attachment[]
}
