import ContainerTitle from '@components/common/ContainerTitle'
import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import CategorySection from '@components/common/ui/category/CategorySection'
import DownloadFileButton from '@components/common/ui/download/DownloadFileButton'
import useReceiptAttachmentCategoryMemo from '@components/receipt/receiptAttachment/hook/useReceiptAttachmentCategoryMemo'
import React from 'react'

import { useGetReceiptAttachmentByJudgSeq } from '@/api/receipt-base-api/receipt-base-api'

interface ReceiptAttachmentFileViewProps {
  judgSeq: number
}

const ReceiptAttachmentFileView: React.FC<ReceiptAttachmentFileViewProps> = ({ judgSeq }) => {
  const { data, isLoading } = useGetReceiptAttachmentByJudgSeq(judgSeq)
  const categoryList = useReceiptAttachmentCategoryMemo(judgSeq, data)

  if (isLoading || categoryList === undefined) {
    return <SkeletonLoading />
  }

  return (
    <div style={{ paddingTop: `30px` }}>
      <ContainerTitle title={'사업시행자 첨부파일'} className={'pb-2'} />
      {categoryList
        .filter(category => {
          const len = category.documents.flatMap(document => document.attachments)[0] ?? {}
          return !!len.fileSeq
        })
        .map((category, index) => (
          <CategorySection key={index} name={category.name} isOpen={true}>
            {category.documents.map(document => (
              <div className="bg-white" key={document.typeCode}>
                {[document.attachments]
                  .flat()
                  .filter(file => !!file?.fileSeq)
                  .map(file => (
                    <DownloadFileButton
                      key={file?.fileSeq}
                      title={document.name}
                      fileSeq={file?.fileSeq}
                      originalFileName={file?.originalFileName}
                    />
                  ))}
              </div>
            ))}
          </CategorySection>
        ))}
    </div>
  )
}
export default ReceiptAttachmentFileView
