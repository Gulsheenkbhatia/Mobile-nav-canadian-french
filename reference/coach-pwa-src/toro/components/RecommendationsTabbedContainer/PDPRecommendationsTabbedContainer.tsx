import { FC, useMemo } from 'react'
import get from 'lodash/get'
import useProductData from 'toro/hooks/useProductData'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import FilterTabs from 'toro/components/common/FilterTabs'
import ViewAllButton from 'toro/components/common/ViewAllButton'
import { useTabbedRecommendations } from './hooks'
import { TabbedRecommendation } from 'toro/components/Certona/TabbedRecommendation/types'
import { DEFAULT_FILTER } from './helpers'

const PDPRecommendationsTabbedContainer: FC<TabbedRecommendation> = ({
  pageType = 'product',
  variant,
}) => {
  const similarProductConfigs = useProductData('similarProductConfigs')
  const type = get(similarProductConfigs, 'recommender', 'product6_rr')
  const title = get(similarProductConfigs, 'title', '')
  const filters = get(similarProductConfigs, 'filters', [])

  const config = useMemo(
    () => ({
      filters,
      title,
      pageType,
      type,
    }),
    [filters, title, pageType, type]
  )

  const { isLoading, selectedFilter, handleFilterChange, selectedFilterItem, handleViewAllClick } =
    useTabbedRecommendations(config)

  const hasFilters = Boolean(filters.length)

  const navigationContent = hasFilters ? (
    <FilterTabs
      filters={filters}
      selectedFilter={selectedFilter}
      onFilterChange={handleFilterChange}
      defaultFilter={DEFAULT_FILTER}
      variant={variant}
    />
  ) : null

  const footerContent =
    hasFilters && selectedFilterItem ? (
      <ViewAllButton filterItem={selectedFilterItem} onClick={handleViewAllClick} />
    ) : null

  return (
    <RecommendationsContainer
      type={type}
      navigation={navigationContent}
      footer={footerContent}
      showItemSkeletons={isLoading}
      title={title}
      variant={variant}
    />
  )
}

export default PDPRecommendationsTabbedContainer
