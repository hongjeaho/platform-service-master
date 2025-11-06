import React from 'react'

const ExpropriationCompensation: React.FC = () => {
  return (
    <section className="space-y-8">
      {/* 수용보상금의 결정 */}
      <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-4">
        수용보상금의 결정
      </h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-2">
        <p className="text-gray-800 leading-relaxed">
          <strong>
            수용보상금은 2개의 감정평가기관이 토지소유자가 제출한 의견서를 참고하여 평가한 평가액
            (협의매수시 평가한 평가자는 제외)을 산술평균하여 결정합니다. 다만 수용평가금액이
            협의매수시에 사업시행자가 협의가격으로 제시한 금액보다 낮을 때에는 당초 협의하였던
            가격으로 수용보상금을 결정하게 됩니다.
          </strong>
        </p>
      </div>
      {/* 보상 */}
      <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-4">보상</h3>
      {/* 1. 토지 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">1. 토지</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed mb-4">
            <strong>
              공시지가(매년 1월 1일을 기준으로 전국의 토지중에서 표준지를 선정하여 가격을 결정
              공시함)를 기준으로 감정평가사가 수용대상 토지의 개별적인 특성 등을 비교하여 평가한
              가격으로 결정하게 됩니다. 다만 이때에 당해 공익사업으로 인하여 상승된
              지가(개발이익이나 투기가격)는 보상금에서 제외됩니다.
              <br />※ 채권보상 사업시행자가 국가나 공공단체인 경우에는 다음의 기준에 따라 채권으로
              보상 할 수 있습니다.
            </strong>
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="space-y-3">
            <div className="font-medium text-gray-800">· 대상</div>
            <div className="ml-7 space-y-2 text-sm">
              <div>- 본인이 희망하는 경우</div>
              <div>
                - 부재지주의 토지로서 토지에 대한 보상금이 1억원을 초과하는 때에 그 초과금액에
                대하여 보상하는 경우
              </div>
              <div>- 상환기간 : 5년 이내</div>
            </div>

            <div className="font-medium text-gray-800 mt-6">· 채권이율</div>
            <div className="ml-7 space-y-2 text-sm">
              <div>- 부재부동산 소유자에게 채권으로 지급하는 경우</div>
              <div>- 상환기한이 3년 이하인 채권: 3년 만기 정기예금 이자율</div>
              <div>- 상환기한이 3년 초과 5년 이하인 채권: 5년 만기 국고채 금리</div>
              <div>- 부재부동산 소유자가 아닌 자가 원하여 채권으로 지급하는 경우</div>
              <div>
                - 상환기한이 3년 이하인 채권: 3년 만기 국고채 금리와 3년 만기 정기예금 이자율 중 더
                높은 것
              </div>
              <div>- 상환기한이 3년 초과 5년 이하인 채권: 5년 만기 국고채 금리</div>
            </div>
          </div>
        </div>
      </div>
      {/* 2. 건물 기타 지장물 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">2. 건물 기타 지장물</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed">
            이전비(해체 + 운반 + 복원)를 보상하는 것이 원칙이며 만약 이전비가 물건의 가액을
            초과하거나 이전이 불가능할 때에는 물건의 가액으로 보상합니다.
          </p>
        </div>
      </div>
      {/* 3. 영업보상 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">3. 영업보상</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed">
            공익사업의 시행으로 영업장소를 이전하거나 폐업하게 되어 영업상의 손실이 발생하는
            경우에는 영업의 종류에 따라 다음기준에 의한 휴업 또는
            <br />
            폐업보상을 하게 됩니다.
          </p>
        </div>
      </div>
      {/* 4. 휴업보상 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">4. 휴업보상</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed">
            휴업보상의 경우에는 4개월의 범위내에서 휴업기간 중의 영업이익과 시설의 이전비용 등을
            보상하게 됩니다.
          </p>
        </div>
      </div>
      {/* 5. 폐업보상 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">5. 폐업보상</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-gray-800 leading-relaxed space-y-4">
            <p>
              폐업보상의 경우에는 2년간의 영업이익을 보상하게 되나 폐업보상에 해당되는 지의 여부는
              소유자의 폐업의사에 따라 결정 되는 것이 아니고 다음의 요건에 해당되어야 합니다.
            </p>
            <div className="mt-4">
              <div className="font-medium mb-2">※ 폐업보상대상</div>
              <div className="space-y-1 text-sm ml-4">
                <div>- 다른 장소에 이전하여서는 당해 영업을 할 수 없는 경우</div>
                <div>- 다른 장소에서는 당해 영업의 허가를 받을 수 없는 경우</div>
                <div>
                  - 주민에게 혐오감을 주는 영업시설로서 다른 장소로 이전 하는 것이 현저히 곤란하다고
                  객관적 사실에 근거하여 시ㆍ군ㆍ구의 장이 인정하는 경우
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 6. 권리 및 기타보상 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">6. 권리 및 기타보상</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-gray-800 leading-relaxed space-y-3">
            <p>
              광업권, 어업권에 대하여는 권리소멸에 따른 보상금을 광업법과 수산업법에서 정하는 기준에
              따라 토지보상금과는 별도로 지불합니다.
            </p>
            <p>
              국유지나 공유지를 적법하게 개간하였을때에는 개간비를 지불하고, 수확하기 전에 수용한
              땅에 심은 농작물이 있을 경우 그 작물에 대하여도 보상금을 지불합니다.
            </p>
          </div>
        </div>
      </div>
      {/* 7. 사업구역밖 대지 등의 보상 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">7. 사업구역밖 대지 등의 보상</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed">
            공익사업용지로 포함되지는 아니하였으나 사업지구 인근의 농경지(계획적으로 조성한
            유실수단지나 죽림단지 포함) 또는 대지(조성된 대지에 한함)가 사업시행으로 인하여 산지나
            하천 등에 둘러싸여 교통이 두절되거나 경작이 불가능하게 된 경우에 소유자가 청구하면
            공익사업시행지구안에 편입된 것으로 보아 보상을 해줄 수 있습니다.
          </p>
        </div>
      </div>
      {/* 8. 영농손실보상 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-800">8. 영농손실보상</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-gray-800 leading-relaxed space-y-3">
            <p>
              - 사업지구내에 편입된 농지에 대하여 도별 연간 농가평균 단위경작면적당 농작물총수입
              직전 3년간 평균의 2년분을 영농손실액으로 보상합니다.
            </p>
            <p>
              - 사업인정고시일등 이후부터 농지로 이용되고 있는 토지, 일시적으로 농지로 이용되는
              토지, 타인소유의 토지를 불법으로 점유하여 경작하고 있는 토지, 농민이 아닌 자가
              경작하고 있는 토지, 토지의 취득에 대한 보상 이후에 사업시행자가 2년 이상 계속하여
              경작하도록 허용하는 토지는 보상대상이 되지 아니합니다.
            </p>
            <p>
              - 농지의 소유자와 실제의 경작자가 다른 경우로서 농지의 소유자가 당해 지역에 거주하는
              농민인 경우에는 서로 협의하는 바에 따라 지급하고, 농지의 소유자가 당해 지역에 거주하는
              농민이 아닌 경우에는 실제의 경작자에게 지급합니다.
            </p>
            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-sm">
                ※ 실제의 경작자는 사업인정고시일, 보상계획공고일 당시의 적법한 경작자를 의미
              </p>
            </div>
          </div>
        </div>
      </div>{' '}
    </section>
  )
}
export default ExpropriationCompensation
