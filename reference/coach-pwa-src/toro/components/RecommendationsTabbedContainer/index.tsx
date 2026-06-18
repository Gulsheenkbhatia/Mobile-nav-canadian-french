import { FC, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MatchExperienceConfigType } from 'toro/components/Certona/TabbedRecommendation/types'
import get from 'lodash/get'
import RecommendationsContainer, {
  ContainerSupportedTypes,
} from 'toro/components/RecommendationsContainer'
import FilterTabs from 'toro/components/common/FilterTabs'
import ViewAllButton from 'toro/components/common/ViewAllButton'
import { useTabbedRecommendations } from './hooks'
import { DEFAULT_FILTER } from './helpers'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'

const CertonaTabbedRecommendation = dynamic(
  () => import('toro/components/Certona/TabbedRecommendation'),
  {
    ssr: false,
  }
)

type RecommendationsTabbedContainerProps = {
  type: ContainerSupportedTypes
  pageType: string
  matchExperienceConfig: MatchExperienceConfigType
}

const RecommendationsTabbedContainer: FC<RecommendationsTabbedContainerProps> = ({
  type,
  matchExperienceConfig,
  pageType,
}) => {
  const title = get(matchExperienceConfig, 'title', '')
  const filters = get(matchExperienceConfig, 'filters', [])
  const hasFilters = Boolean(filters.length)

  const config = useMemo(
    () => ({
      filters,
      title,
      pageType,
      type,
    }),
    [filters, title, pageType, type]
  )

  const {
    isLoading,
    selectedFilter,
    handleFilterChange,
    selectedFilterItem,
    handleViewAllClick,
    tabsRef,
  } = useTabbedRecommendations(config)

  const navigationContent = hasFilters ? (
    <FilterTabs
      filters={filters}
      selectedFilter={selectedFilter}
      onFilterChange={handleFilterChange}
      defaultFilter={DEFAULT_FILTER}
      tabsRef={tabsRef}
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
      emitHomeFeaturedProductsJsonLd={pageType === 'home'}
    />
  )
}

export default withSchemeValidation(RecommendationsTabbedContainer, CertonaTabbedRecommendation)
