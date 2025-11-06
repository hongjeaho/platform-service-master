import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

import procedureImage from '@/assets/images/land/procedure.gif'

const ProcedureApplication: React.FC = () => {
  return (
    <>
      <MainTitle title="수용재결 절차안내" />
      <ContainerCenter>
        <section>
          <div className="text-2xl font-bold mb-2 text-sky-700 text-center">
            토지수용위원회 수용재결 절차
          </div>
          {/* 이미지 중앙 정렬 */}
          <div className="flex justify-center mt-6">
            <img src={procedureImage} alt="수용재결 절차도" className="max-w-full h-auto" />
          </div>
        </section>
      </ContainerCenter>
    </>
  )
}

export default ProcedureApplication
