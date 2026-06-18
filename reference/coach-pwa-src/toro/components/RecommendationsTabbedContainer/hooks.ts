import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { xgenClientAtom } from 'store/xgen.atom'
import { retrieveXgenRecommendationsAtom } from 'store/xgen-recommendations.atom'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { DEFAULT_FILTER, getXgenFilterContext, getXgenInitialFilterContext } from './helpers'
import {
  Filter,
  TabbedRecommendationsConfig,
  UseTabbedRecommendations,
} from 'toro/components/RecommendationsTabbedContainer/types'
import { interactionsAtom } from 'store/matching-experience'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { compareFiltersAndInteractions } from 'toro/helpers/tabbedRecommendationsFilterInteractionsHelper'
import usePageType from 'toro/hooks/usePageType'

const useTabbedRecommendationEvents = (pageType: string, type: string) => {
  const analytics = useAnalytics()

  return useCallback(
    (eventLabel: string = '', eventAction: string = 'impression', pillLabel: string = '') => {
      const analyticsEvent = pageType === 'product' ? 'productInteraction' : 'listInteraction'
      const eventActionPillLabel = pageType === 'product' && pillLabel ? ':' + pillLabel : ''

      analytics.send(analyticsEvent, {
        eventAction: `shopping guide recommendations ${eventAction}${eventActionPillLabel}`,
        eventLocation: type,
        eventLabel: eventLabel.toLowerCase(),
      })
    },
    [analytics, pageType, type]
  )
}

const useFilteredXgenRecommendations = (
  type: string,
  filters: TabbedRecommendationsConfig['filters']
) => {
  const [isLoading, setIsLoading] = useState(false)
  const isInitialLoadRef = useRef(true)
  const xgenClient = useAtomValue(xgenClientAtom)
  const selectedVgId = useVariantGroupData('id')
  const retrieveRecommendations = useUpdateAtom(retrieveXgenRecommendationsAtom)
  const xgenContext = useMemo(() => getXgenInitialFilterContext(filters), [filters])

  const processFilterChange = useCallback(
    async (selectedFilterItem: Filter) => {
      if (!selectedFilterItem || !xgenClient) {
        return
      }

      try {
        const contextValues = getXgenFilterContext(selectedFilterItem, xgenContext)
        await xgenClient.recommendations.setContext(contextValues)
        if (!isInitialLoadRef.current) {
          setIsLoading(true)
          await retrieveRecommendations({ type, vgId: selectedVgId })
          setIsLoading(false)
          await xgenClient.recommendations.setContext(xgenContext)
        } else {
          isInitialLoadRef.current = false
        }
      } catch (error) {
        console.error('[RecommendationsContainerWithTabs] Error setting filter context:', error)
      }
    },
    [xgenClient, retrieveRecommendations, type, selectedVgId, xgenContext]
  )

  return { isLoading, processFilterChange }
}

export const useTabbedRecommendations = (
  config: TabbedRecommendationsConfig
): UseTabbedRecommendations => {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [isTabsRefReady, setIsTabsRefReady] = useState(false)
  const { isPLP } = usePageType()
  const interactions = useAtomValue(interactionsAtom)
  const isEnhancedMatchingExperience = useExperiment(
    EXPERIMENTS.ENHANCED_CERTONA_MATCHING_EXPERIENCE
  )
  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER)
  const { filters, title, pageType, type } = config
  const selectedFilterItem = filters[selectedFilter]

  const handleAnalyticsEvent = useTabbedRecommendationEvents(pageType, type)
  const { isLoading, processFilterChange } = useFilteredXgenRecommendations(type, filters)

  const callbackRef = useCallback((node: HTMLDivElement | null) => {
    tabsRef.current = node
    setIsTabsRefReady(!!node)
  }, [])

  const handleViewAllClick = useCallback(() => {
    handleAnalyticsEvent(`${title}:${selectedFilterItem?.viewAllTitle}`, 'click')
  }, [handleAnalyticsEvent, title, selectedFilterItem?.viewAllTitle])

  const handleFilterChange = useCallback(
    (tabIndex: number) => {
      setSelectedFilter(tabIndex)
      handleAnalyticsEvent(
        `${title}:${filters[tabIndex]?.displayValue}`,
        'click',
        filters[tabIndex]?.displayValue.toLowerCase()
      )
    },
    [handleAnalyticsEvent, title, filters]
  )

  useEffect(() => {
    void processFilterChange(selectedFilterItem)
  }, [processFilterChange, selectedFilterItem])

  useEffect(() => {
    if (!isEnhancedMatchingExperience || !isTabsRefReady) {
      return
    }

    compareFiltersAndInteractions({
      filters,
      interactions,
      setSelectedFilter,
      tabsRef,
    })
  }, [isEnhancedMatchingExperience, interactions, filters, isTabsRefReady, isPLP])

  return {
    isLoading,
    selectedFilter,
    handleFilterChange,
    selectedFilterItem,
    handleViewAllClick,
    tabsRef: callbackRef,
  }
}
