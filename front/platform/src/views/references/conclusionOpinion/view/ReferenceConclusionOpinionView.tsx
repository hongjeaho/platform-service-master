import { BasicButton } from '@components/common/button'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import ReferenceConclusionOpinionViewBody from '@components/references/conclusionOpinion/ReferenceConclusionOpinionViewBody'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

interface Param {
  conclusionOpinionSeq: number
}

const ReferenceConclusionOpinionView: React.FC = () => {
  const { conclusionOpinionSeq } = useParams() as unknown as Readonly<Param>
  return (
    <>
      <MainTitle title={'재결관 의견'} />
      <ContainerCenter>
        <ReferenceConclusionOpinionViewBody conclusionOpinionSeq={conclusionOpinionSeq} />
        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-3 justify-between items-center mt-4">
          <BasicButton>
            <Link to={'/references/conclusionOpinion/application'}>목록으로</Link>
          </BasicButton>
        </div>
      </ContainerCenter>
    </>
  )
}
export default ReferenceConclusionOpinionView
