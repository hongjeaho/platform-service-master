import { X } from 'lucide-react'
import React, { type PropsWithChildren } from 'react'

interface TabItem {
  id: number
  label: string
}

interface TabContentProps extends PropsWithChildren {
  tabs: TabItem[] /* 탭 목록 */
  activeTab: number /* 활성화 된 탭 */
  setActiveTab: (tabId: number) => void /* 탭 활성화 */
  showRemoveButton?: boolean /* 탭 삭제 보튼 노출 */
  onRemoveButton?: (tabId: number) => void /* 탭 삭제 이벤트 */
}

const TabContent: React.FC<TabContentProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  onRemoveButton,
  showRemoveButton = false,
  children,
}) => {
  const handleDeleteTab = (tabId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation() // 탭 클릭 이벤트 방지
    onRemoveButton && onRemoveButton(tabId)
  }

  return (
    <div className="mx-auto p-6">
      <div className="mb-4">
        <ul className="flex border-b border-gray-300">
          {tabs.map(tab => (
            <li className="mr-0.5" key={tab.id} data-tab-id={tab.id}>
              <div
                onClick={() => setActiveTab(tab.id)}
                className={`group px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer rounded-t-lg border flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-500 text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <span className="flex-1">{tab.label}</span>
                {showRemoveButton && (
                  <button
                    type="button"
                    onClick={e => handleDeleteTab(tab.id, e)}
                    className="text-gray-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-100 cursor-pointer"
                    title="탭 삭제"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="tab-content">{children}</div>
    </div>
  )
}
export default TabContent
