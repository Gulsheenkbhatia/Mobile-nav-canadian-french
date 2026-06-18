export type Filter = {
  filterType: string
  value: string
}

export type TabFilter = {
  filterType: string
  displayValue: string
  value: string
  viewAllTitle: string
  viewAllLink: string
}

export type TabbedRecommendationsConfig = {
  filters: TabFilter[]
  title: string
  pageType: string
  type: string
}

export type UseTabbedRecommendations = {
  isLoading: boolean
  selectedFilter: number
  handleFilterChange: (tabIndex: number) => void
  selectedFilterItem: TabFilter | undefined
  handleViewAllClick: () => void
  tabsRef: (node: HTMLDivElement | null) => void
}
