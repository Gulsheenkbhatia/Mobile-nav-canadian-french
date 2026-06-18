import React, { useRef } from 'react'
import Tabs from 'toro/components/Tabs'
import TabList from 'toro/components/TabList'
import Tab from 'toro/components/Tab'
import ScrollableContent from 'toro/components/ScrollableContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { CertonaTabFilterType } from 'toro/components/Certona/TabbedRecommendation/types'
import usePageType from 'toro/hooks/usePageType'

interface FilterTabsProps {
  filters: CertonaTabFilterType[]
  selectedFilter: number
  onFilterChange: (tabIndex: number) => void
  defaultFilter?: number
  tabsRef?: (node: HTMLDivElement | null) => void
  variant?: 'tabbedPDPRecommendation' | 'tabbedRecommendation' | 'inlinePDPv6'
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  filters,
  selectedFilter,
  onFilterChange,
  defaultFilter = 0,
  tabsRef,
  variant = 'tabbedRecommendation',
}) => {
  const internalTabsRef = useRef<HTMLDivElement>()
  const tabsReference = tabsRef || internalTabsRef
  const styles = useMultiStyleConfig('TabbedPDPRecommendation', { variant })
  const { isPLP } = usePageType()

  if (!filters.length) {
    return null
  }

  return (
    <Tabs
      variant="unstyled"
      sx={styles.tabs}
      onChange={onFilterChange}
      defaultIndex={defaultFilter}
      index={selectedFilter}
      ref={tabsReference}
    >
      <ScrollableContent scrollParentId="recommendationContainer" variant={variant}>
        <TabList
          sx={{
            ...styles.tabList,
            ...(isPLP && styles.tabListPLP),
          }}
        >
          {filters.map((filter, index) => (
            <Tab
              key={filter.value}
              sx={{
                ...styles.tab,
                ...(selectedFilter === index && styles.selectedTab),
              }}
            >
              {filter.displayValue}
            </Tab>
          ))}
        </TabList>
      </ScrollableContent>
    </Tabs>
  )
}

export default FilterTabs
