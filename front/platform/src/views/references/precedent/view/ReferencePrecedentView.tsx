import { BasicButton } from '@components/common/button'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import ReferencePrecedentViewBody from '@components/references/precedent/ReferencePrecedentViewBody'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

interface Params {
  precedentSeq: number
}
const ReferencePrecedentView: React.FC = () => {
  const { precedentSeq } = useParams() as unknown as Readonly<Params>

  return (
    <>
      <MainTitle title={'판례'} />
      <ContainerCenter>
        <ReferencePrecedentViewBody precedentSeq={precedentSeq} />
        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-3 justify-between items-center mt-4">
          <BasicButton>
            <Link to={'/references/precedent/application'}>목록으로</Link>
          </BasicButton>
        </div>
      </ContainerCenter>
    </>
  )
}
export default ReferencePrecedentView
