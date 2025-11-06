import { BasicButton } from '@components/common/button'
import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import ReferenceDecreeViewBody from '@components/references/decree/ReferenceDecreeViewBody'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

interface Params {
  decreeDetailSeq: number
}

const ReferenceDecreeView: React.FC = () => {
  const { decreeDetailSeq } = useParams() as unknown as Readonly<Params>

  return (
    <>
      <MainTitle title={'법령 및 시행규칙'} />
      <ContainerCenter>
        <ReferenceDecreeViewBody decreeDetailSeq={decreeDetailSeq} />
        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-3 justify-between items-center mt-4">
          <BasicButton>
            <Link to={'/references/decree/application'}>목록으로</Link>
          </BasicButton>
        </div>
      </ContainerCenter>
    </>
  )
}
export default ReferenceDecreeView
