import { atom } from 'jotai'

interface OpinionTemplateTabState {
  activeTab: number
  tabs: Array<{ label: string; id: number }>
}

/**
 * 의견 템플릿 탭 상태를 관리하는 atom
 * activeTab: 현재 활성화된 탭의 ID
 * tabs: 탭 목록 정보
 */
export const opinionTemplateTabState = atom<OpinionTemplateTabState>({
  activeTab: 1,
  tabs: [],
})

/**
 * activeTab만 업데이트하는 write-only atom
 */
export const setActiveTabState = atom(null, (get, set, newActiveTab: number) => {
  const currentState = get(opinionTemplateTabState)
  set(opinionTemplateTabState, {
    ...currentState,
    activeTab: newActiveTab,
  })
})

/**
 * tabs 초기화하는 write-only atom
 * 탭 목록이 변경될 때 첫 번째 탭을 활성화
 */
export const initializeTabsState = atom(
  null,
  (_, set, newTabs: Array<{ label: string; id: number }>) => {
    set(opinionTemplateTabState, {
      tabs: newTabs,
      activeTab: newTabs[0]?.id ?? 1,
    })
  },
)

/**
 * activeTab만 읽는 파생 atom
 */
export const activeTabSelector = atom(get => {
  return get(opinionTemplateTabState).activeTab
})
