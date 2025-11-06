import ContainerTitle from '@components/common/ContainerTitle'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import DownloadFileButton from '@components/common/ui/download/DownloadFileButton'
import TableBaseBody from '@components/common/ui/tableBase/TableBaseBody'
import TableBaseCell, { TableBaseHeadCell } from '@components/common/ui/tableBase/TableBaseCell'
import TableBaseRow from '@components/common/ui/tableBase/TableBaseRow'
import React from 'react'

import { useGetReceiptPreviousAppraisalByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'
import TableBaseContainer from '@/components/common/ui/tableBase/TableBaseContainer'

interface ReceiptPreviousAppraisalProps {
  judgSeq: number
}

const ReceiptPreviousAppraisalView: React.FC<ReceiptPreviousAppraisalProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetReceiptPreviousAppraisalByJudgSeq(judgSeq)

  if (isLoading) {
    return <SkeletonLoading />
  }

  return (
    <>
      <TableBaseContainer title={'시도지사 추천'}>
        <TableBaseBody>
          <TableBaseRow>
            <TableBaseHeadCell width={150}>시도지사 추천여부</TableBaseHeadCell>
            <TableBaseCell>
              {data?.receiptPreviousAppraisal?.governorRecommendation ? '추천' : '비 추천'}
            </TableBaseCell>
          </TableBaseRow>
          {data?.receiptPreviousAppraisal?.governorRecommendation === false && (
            <TableBaseRow>
              <TableBaseHeadCell width={150}>
                시·도지사 추천
                <br /> 요청을 하지 않은 이유
              </TableBaseHeadCell>
              <TableBaseCell>
                {data?.receiptPreviousAppraisal?.governorNotRecommendation}
              </TableBaseCell>
            </TableBaseRow>
          )}
        </TableBaseBody>
      </TableBaseContainer>
      <div className="pt-5">
        <ContainerTitle title="협의 공고 첨부 파일" />
        {data?.receiptPreviousAppraisalAttachmentUploadFileList?.map(file => (
          <DownloadFileButton
            key={file.previousAppraisalFileSeq}
            title={file.previousAppraisalTypeName}
            fileSeq={file.previousAppraisalFileSeq}
            originalFileName={file.originalFileName}
          />
        ))}
      </div>
    </>
  )
}
export default ReceiptPreviousAppraisalView
