import CategorySection from '@components/common/ui/category/CategorySection'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseContainer from '@components/common/ui/tableBase/TableBaseContainer'
import TableBaseHead from '@components/common/ui/tableBase/TableBaseHead'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetOpinionTemplateList } from '@/api/common-application-api/common-application-api'

const OpinionTemplateDescriptionSection: React.FC = () => {
  const { data: caseTemplateList } = useGetOpinionTemplateList()

  return (
    <CategorySection name={'쟁점의견 상세 설명'} required={false} isOpen={false}>
      <TableBaseContainer paddingTop={0}>
        <TableBaseHead>
          <TableBaseRow>
            <TableBaseHeadCell className={'w-1/3'}>쟁점명</TableBaseHeadCell>
            <TableBaseHeadCell>쟁점설명</TableBaseHeadCell>
          </TableBaseRow>
        </TableBaseHead>
        <TableBaseBody>
          {caseTemplateList?.map(caseTemplate => (
            <TableBaseRow key={caseTemplate.seq}>
              {/* 템플릿 이름 표시 - 필수 항목은 빨간색으로 강조 */}
              <TableBaseCell
                className={caseTemplate?.templateRequired ? 'text-red-600' : 'text-shadow-black'}
              >
                {caseTemplate?.templateName}
              </TableBaseCell>
              {/* 템플릿 설명 표시 - 필수 항목은 빨간색으로 강조 */}
              <TableBaseCell
                align={'left'}
                className={caseTemplate?.templateRequired ? 'text-red-600' : 'text-shadow-black'}
              >
                {caseTemplate?.templateDescription}
              </TableBaseCell>
            </TableBaseRow>
          ))}
        </TableBaseBody>
      </TableBaseContainer>
    </CategorySection>
  )
}
export default OpinionTemplateDescriptionSection
