import ContainerCenter from '@components/common/ContainerCenter'
import MainTitle from '@components/common/MainTitle'
import React from 'react'

const AcceptanceDecisionApplication: React.FC = () => {
  return (
    <>
      <MainTitle title="수용재결 안내" />
      <ContainerCenter>
        <section className="space-y-12">
          {/* 다운로드 링크 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-4 border-sky-600 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <label className="font-semibold flex items-center text-sky-700">
                감정평가업자 추천지침서
              </label>
              <a
                href="/files/Guidelines_for_Appraiser.hwp"
                download
                className="inline-block px-2 py-2 text-sm bg-neutral-700 text-white rounded hover:bg-primary-main text-center transition-colors duration-200"
              >
                감정평가업자 추천지침서
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="font-semibold flex items-center text-sky-700">운영규칙안내</label>
              <a
                href="http://www.law.go.kr/%EC%9E%90%EC%B9%98%EB%B2%95%EA%B7%9C/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%EC%A7%80%EB%B0%A9%ED%86%A0%EC%A7%80%EC%88%98%EC%9A%A9%EC%9C%84%EC%9B%90%ED%9A%8C%EC%9A%B4%EC%98%81%EA%B7%9C%EC%B9%99"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-2 py-2 text-sm bg-neutral-700 text-white rounded hover:bg-primary-main text-center transition-colors duration-200"
              >
                운영규칙(서울시)
              </a>
            </div>
          </div>

          {/* 수용재결의 효과 */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-table-cellText border-l-4 border-primary-light pl-4">
              수용재결의 효과
            </h2>

            {/* 사업시행자의 권리, 의무 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-700">
                가. 사업시행자의 권리, 의무
              </h3>
              <div className="space-y-6">
                <div className="bg-primary-lighter border border-primary-lighter rounded-lg p-6">
                  <h4 className="font-bold text-table-cellText mb-2">토지등에 대한 소유권 취득</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    수용재결이 되어 보상금을 지급하거나 공탁하면 사업시행자는 토지수용위원회가 정한
                    수용시기에 그 토지등에 대한 소유권을 취득하게 되고 그 토지등에 있던 다른 권리도
                    소멸됩니다.
                  </p>
                </div>
                <div className="bg-primary-lighter border border-primary-lighter rounded-lg p-6">
                  <h4 className="font-bold text-table-cellText mb-2">보상금 지불의무</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    사업시행자는 보상금을 수용의 개시일까지 토지소유자에게 지불해야 하며, 수령 거부
                    시 공탁해야 합니다. 만약 기한 내 보상금을 지급하지 않으면 수용재결은 무효가
                    됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 토지소유자의 권리, 의무 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-700">
                나. 토지소유자의 권리, 의무
              </h3>
              <div className="space-y-6">
                <div className="bg-primary-lighter border border-primary-lighter rounded-lg p-6">
                  <h4 className="font-bold text-table-cellText mb-2">보상금을 받을 권리</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    토지수용위원회가 정한 보상금을 사업시행자로부터 받을 권리가 생깁니다.
                  </p>
                </div>
                <div className="bg-primary-lighter border border-primary-lighter rounded-lg p-6">
                  <h4 className="font-bold text-table-cellText mb-2">토지등의 인도와 이전의무</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    보상금 지급 또는 공탁 후 토지나 물건을 사업시행자에게 인도 또는 이전해야 합니다.
                  </p>
                </div>
                <div className="bg-primary-lighter border border-primary-lighter rounded-lg p-6">
                  <h4 className="font-bold text-table-cellText mb-2">인도ㆍ이전을 거부할 때</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    행정대집행을 신청할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 수용재결의 구제절차 */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-table-cellText border-l-4 border-primary-light pl-4 mb-4">
                수용재결의 구제절차
              </h2>
              <div className="bg-primary-lighter border-l-4 border-primary-light p-6 rounded-r-lg">
                <p className="text-primary-main leading-relaxed">
                  토지수용제도는 공익사업을 위한 제도이지만, 토지소유자의 권익 보호를 위한 권리구제
                  제도가 마련되어 있습니다.
                </p>
              </div>
            </div>

            {/* 구제절차 상세 내용 */}
            <div className="space-y-8">
              {/* 수용신청 전 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700">
                  가. 수용신청 전에 할 수 있는 일
                </h3>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      수용재결신청 청구
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      지연 시 이자 가산 등 효과
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      재결 신청 기한 및 방식 안내
                    </li>
                  </ul>
                </div>
              </div>

              {/* 수용신청 후 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700">
                  나. 수용신청 후에 할 수 있는 일
                </h3>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                  <p className="text-neutral-700 leading-relaxed">
                    <span className="font-medium">잔여지 수용청구:</span> 자투리 땅이나 철거 잔여
                    건물 등에 대해 전부 수용을 요청할 수 있으며, 공사 완료 전까지 청구 가능
                  </p>
                </div>
              </div>

              {/* 수용재결 후 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700">
                  다. 수용재결 후에 할 수 있는 일
                </h3>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      이의신청 및 행정소송 가능
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      보상금 수령 시 "이의 유보" 명기 필수
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      이의 신청 시 재평가 및 보상금 조정
                    </li>
                  </ul>
                </div>
              </div>

              {/* 이의신청 재결 후 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700">
                  라. 이의신청 재결 후에 할 수 있는 일
                </h3>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      60일 내 행정소송 제기 가능
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      취소소송 vs 보상금 다툼 소송 구분 필요
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-light mr-2">•</span>
                      사업시행자 패소 시 이자 포함 보상금 지급
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ContainerCenter>
    </>
  )
}
export default AcceptanceDecisionApplication
