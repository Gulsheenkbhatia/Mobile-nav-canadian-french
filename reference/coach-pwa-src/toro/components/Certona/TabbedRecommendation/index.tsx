import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CertonaScheme,
  certonaScriptLoadedAtom,
  clearSchemeInCertonaAtom,
} from 'store/certona-schemes.atoms'
import CertonaRecommendation from 'toro/components/Certona/Recommendation'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { FormErrorOutline } from 'toro/icons/header-icons'
import get from 'lodash/get'
import { TabbedRecommendation } from 'toro/components/Certona/TabbedRecommendation/types'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import { getFilterOptions } from 'toro/components/Certona/helpers'
import useAnalytics from 'toro/analytics/useAnalytics'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import { interactionsAtom } from 'store/matching-experience'
import usePageType from 'toro/hooks/usePageType'
import useViewportType from 'toro/hooks/useViewportType'
import FilterTabs from 'toro/components/common/FilterTabs'
import ViewAllButton from 'toro/components/common/ViewAllButton'
import { compareFiltersAndInteractions } from 'toro/helpers/tabbedRecommendationsFilterInteractionsHelper'

const DEFAULT_FILTER = 0

const CertonaTabbedRecommendation = ({
  categoryID,
  hideRecommendationPrice,
  matchExperienceConfig,
  pageType,
  variant,
  itemId,
  userChannel,
}: TabbedRecommendation) => {
  const styles = useMultiStyleConfig('TabbedPDPRecommendation', { variant })
  const clearScheme = useUpdateAtom(clearSchemeInCertonaAtom)
  const isCertonaScriptLoaded = useAtomValue(certonaScriptLoadedAtom)
  const { isPLP } = usePageType()
  const { isDesktop } = useViewportType()

  const isEnhancedMatchingExperience = useExperiment(
    EXPERIMENTS.ENHANCED_CERTONA_MATCHING_EXPERIENCE
  )

  const tabsRef = useRef<HTMLDivElement>()

  const interactions = useAtomValue(interactionsAtom)

  const title = get(matchExperienceConfig, 'title')
  const filters = useMemo(() => {
    const filters = matchExperienceConfig?.filters ?? []
    // we need fallback to "default" when user navigates as "direct" channel without paid sarch
    const defaultChannelOrder = matchExperienceConfig?.channels?.default
    const channelOrder = isEnhancedMatchingExperience
      ? matchExperienceConfig?.channels?.[userChannel] ?? defaultChannelOrder
      : defaultChannelOrder

    if (channelOrder) {
      // pick specific items based on channel order item index
      return channelOrder
        .split(',')
        .map((itemIndex) => {
          return filters[parseInt(itemIndex)]
        })
        .filter(Boolean)
    }

    return filters
  }, [matchExperienceConfig?.filters, userChannel, isEnhancedMatchingExperience])

  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER)

  useEffect(() => {
    if (!isEnhancedMatchingExperience || !isPLP || isDesktop) {
      return
    }

    compareFiltersAndInteractions({
      filters,
      interactions,
      setSelectedFilter,
      tabsRef,
    })
  }, [isEnhancedMatchingExperience, filters, interactions, isDesktop, isPLP])

  const recommender = get(matchExperienceConfig, 'recommender')
  const selectedFilterItem = filters[selectedFilter]

  useEffect(() => {
    return () => {
      clearScheme(recommender)
    }
  }, [selectedFilter])

  const currentScheme = useCertonaScheme(recommender, {
    pagetype: pageType,
    filter: getFilterOptions(selectedFilterItem),
    enabled: true,
    itemid: itemId,
    exitemid: itemId,
    categoryID,
    dependencies: [selectedFilter],
    p3recommendations: !!itemId,
  }) as CertonaScheme

  const analytics = useAnalytics()

  const handleAnalyticsEvent = (
    eventLabel: string = title,
    eventAction: string = 'impression',
    pillLabel: string = ''
  ) => {
    const analyticsEvent = pageType === 'product' ? 'productInteraction' : 'listInteraction'
    const eventActionPillLabel = pageType === 'product' && pillLabel ? ':' + pillLabel : ''

    analytics.send(analyticsEvent, {
      eventAction: `shopping guide recommendations ${eventAction}${eventActionPillLabel}`,
      eventLocation: currentScheme.scheme,
      eventLabel: eventLabel.toLowerCase(),
    })
  }

  const categoryTabOnChange = (tabIndex: number) => {
    setSelectedFilter(tabIndex)
    handleAnalyticsEvent(
      `${title}:${filters[tabIndex]?.displayValue}`,
      'click',
      filters[tabIndex]?.displayValue.toLowerCase()
    )
  }

  const setTabsRef = useCallback((node: HTMLDivElement | null) => {
    tabsRef.current = node
  }, [])

  if (!isCertonaScriptLoaded) {
    return null
  }

  return (
    <ImpressionSensor payload={title} onVisible={handleAnalyticsEvent} threshold={1}>
      <Box sx={styles.certonaTabbedContainer}>
        {title && (
          <Box as="h2" sx={styles.title} data-qa="certona-title">
            {title}
          </Box>
        )}
        <FilterTabs
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={categoryTabOnChange}
          defaultFilter={DEFAULT_FILTER}
          tabsRef={setTabsRef}
          variant={variant}
        />
        {currentScheme && !currentScheme.items?.length ? (
          <Flex sx={styles.fallbackMessageContainer}>
            <FormErrorOutline width="16" height="16" />
            <Text sx={styles.fallbackMessage}>
              <strong>Oops!</strong> It looks like we couldn&apos;t load the products this time. Try
              selecting another filter to explore more options.
            </Text>
          </Flex>
        ) : (
          <CertonaRecommendation
            certonaData={currentScheme}
            hidePrice={hideRecommendationPrice}
            variant={variant}
            label={title}
            skeletonVisible={!currentScheme}
            isLoading={!currentScheme}
            selectedFilter={selectedFilter}
            isMatchingExperience
          />
        )}
        <ViewAllButton
          filterItem={selectedFilterItem}
          onClick={() =>
            handleAnalyticsEvent(`${title}:${selectedFilterItem.viewAllTitle}`, 'click')
          }
          variant={variant}
        />
      </Box>
    </ImpressionSensor>
  )
}

export default CertonaTabbedRecommendation
