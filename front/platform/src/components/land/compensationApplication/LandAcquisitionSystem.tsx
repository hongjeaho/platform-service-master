import React from 'react'

const LandAcquisitionSystem: React.FC = () => {
  return (
    <section className="space-y-8">
      {/* 첫 번째 설명 박스 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-gray-800 leading-relaxed">
          <strong>
            국가나 공공기관에서는 다목적댐을 건설하고 도로, 철도, 항만, 산업단지를 조성하며
            주택건설과 교육시설을 설치하는 등 많은 공익사업을 시행하고 있습니다.
            <br />
            <br />
            이러한 공익사업을 시행하기 위하여는 사업에 쓸 토지 등이 필요하기 때문에 국가나
            공공단체에서는 이들 토지 등을 취득하기 위하여 토지, 물건 등 소유자 (이하 "토지소유자"라
            한다)와 먼저 매수 협의를 하고 이 때에 원만한 협의가 이루어지게 되면 상호간에 계약을
            체결하여 필요한 토지등을 매수하게 됩니다.
            <br />
            <br />
            그러나 협의매수가 불가능한 경우도 있으므로 이를 대비하여 사유재산제를 인정하고 있는 모든
            민주국가에서는 공익사업 용지를 강제로 취득할 수 있는 토지수용제도를 마련하고 있으며
            우리나라에서도 이 제도를 시행하고 있습니다.
          </strong>
        </p>
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-4">
        공익사업을 위한 토지 등의 취득 및 보상에 관한 법률에 정해져 있는 공익사업
      </h3>

      {/* 두 번째 설명 박스 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-gray-800 leading-relaxed">
          <strong>
            토지수용을 할 수 있는 공익사업은 공익사업을위한토지등의취득및보상에관한법률 (이하
            "토지보상법"이라 한다)에 그 종류가 자세히 정하여져 있으며
            <br />
            여기에 해당하는 경우에도 국토교통부장관이 특별히 수용을 할 수 있는 사업으로 인정을
            해야만 수용을 할 수가 있습니다.
          </strong>
        </p>
      </div>

      {/* 공익사업 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <caption className="sr-only">
            토지보상법에 정해져 있는 공익사업 (토지보상법 제4조)
          </caption>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-center font-medium w-20">
                연번
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-medium">
                토지보상법에 정해져 있는 공익사업 (토지보상법 제4조)
              </th>
            </tr>
          </thead>
          <tbody>
            {publicProjects.map(project => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-center">{project.id}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm leading-relaxed">
                  {project.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 추가 설명 */}
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        그 밖에 별표에 규정된 법률에 따라 토지등을 수용하거나 사용할 수 있는 사업 (제4조제8호 관련)
        [시행일: 2022. 6. 16.]
      </div>
    </section>
  )
}

const publicProjects = [
  {
    id: 1,
    content: '국방·군사에 관한 사업',
  },
  {
    id: 2,
    content:
      '관계 법률에 따라 허가ㆍ인가ㆍ승인ㆍ지정 등을 받아 공익을 목적으로 시행하는 철도ㆍ도로ㆍ공항ㆍ항만ㆍ주차장ㆍ공영차고지ㆍ화물터미널ㆍ궤도(軌道)ㆍ하천ㆍ제방ㆍ댐ㆍ운하ㆍ수도ㆍ하수도ㆍ하수종말처리ㆍ폐수처리ㆍ사방(砂防)ㆍ방풍(防風)ㆍ방화(防火)ㆍ방조(防潮)ㆍ방수(防水)ㆍ저수지ㆍ용수로ㆍ배수로ㆍ석유비축ㆍ송유ㆍ폐기물처리ㆍ전기ㆍ전기통신ㆍ방송ㆍ가스 및 기상 관측에 관한 사업',
  },
  {
    id: 3,
    content:
      '국가나 지방자치단체가 설치하는 청사ㆍ공장ㆍ연구소ㆍ시험소ㆍ보건시설ㆍ문화시설ㆍ공원ㆍ수목원ㆍ광장ㆍ운동장ㆍ시장ㆍ묘지ㆍ화장장ㆍ도축장 또는 그 밖의 공공용 시설에 관한 사업',
  },
  {
    id: 4,
    content:
      '관계 법률에 따라 허가ㆍ인가ㆍ승인ㆍ지정 등을 받아 공익을 목적으로 시행하는 학교ㆍ도서관ㆍ박물관 및 미술관 건립에 관한 사업',
  },
  {
    id: 5,
    content:
      '국가, 지방자치단체, 「공공기관의 운영에 관한 법률」 제4조에 따른 공공기관, 「지방공기업법」에 따른 지방공기업 또는 국가나 지방자치단체가 지정한 자가 임대나 양도의 목적으로 시행하는 주택 건설 또는 택지 및 산업단지 조성에 관한 사업',
  },
  {
    id: 6,
    content:
      '제1호부터 제5호까지의 사업을 시행하기 위하여 필요한 통로, 교량, 전선로, 재료 적치장 또는 그 밖의 부속시설에 관한 사업',
  },
  {
    id: 7,
    content:
      '제1호부터 제5호까지의 사업을 시행하기 위하여 필요한 주택, 공장 등의 이주단지 조성에 관한 사업',
  },
  {
    id: 8,
    content: '그 밖에 별표에 규정된 법률에 따라 토지등을 수용하거나 사용할 수 있는 사업',
  },
]
export default LandAcquisitionSystem
