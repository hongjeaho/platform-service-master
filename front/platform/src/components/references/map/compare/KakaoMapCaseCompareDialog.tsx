import BasicDialog from '@components/common/ui/dialog/BasicDialog'
import type { KakaoMapSearchCase } from '@components/references/map/type/kakaoMapSearch'
import { formatPrice } from '@util/numberUtils'
import React from 'react'

interface CaseCompareDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedCases: KakaoMapSearchCase[]
}

const KakaoMapCaseCompareDialog: React.FC<CaseCompareDialogProps> = ({
  isOpen,
  onClose,
  selectedCases,
}) => {
  const formatArea = (area: number): string => {
    return `${area.toLocaleString()}㎡`
  }

  return (
    <BasicDialog
      isOpen={isOpen}
      onClose={onClose}
      title="사건 비교"
      hideFooter={true}
      className="w-full max-w-5xl"
    >
      <div className="space-y-6">
        {/* 비교 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            선택된 {selectedCases.length}개 사건을 비교하고 있습니다. 추후 상세 비교 기능이 추가될
            예정입니다.
          </p>
        </div>

        {/* 사건 비교 테이블 */}
        {selectedCases.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    구분
                  </th>
                  {selectedCases.map(caseItem => (
                    <th
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 min-w-[200px]"
                    >
                      {caseItem.caseNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 사건명 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    사건명
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      <div className="max-w-xs truncate" title={caseItem.caseName}>
                        {caseItem.caseName}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 사건 유형 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    사건유형
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      {caseItem.caseType}
                    </td>
                  ))}
                </tr>

                {/* 주소 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    주소
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      <div className="max-w-xs truncate" title={caseItem.address}>
                        {caseItem.address}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 면적 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    면적
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      {formatArea(caseItem.area)}
                    </td>
                  ))}
                </tr>

                {/* 가격 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    가격
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-green-600 font-medium"
                    >
                      {formatPrice(caseItem.price)}
                    </td>
                  ))}
                </tr>

                {/* 지목 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    지목
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      {caseItem.landCategory.join(', ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* 이용상황 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    이용상황
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      {caseItem.usageStatus.join(', ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* 용도지역 */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    용도지역
                  </td>
                  {selectedCases.map(caseItem => (
                    <td
                      key={caseItem.id}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                    >
                      {caseItem.zoneType.join(', ') || '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 빈 상태 처리 */}
        {selectedCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">비교할 사건을 선택해주세요.</p>
          </div>
        )}
      </div>
    </BasicDialog>
  )
}

export default KakaoMapCaseCompareDialog
