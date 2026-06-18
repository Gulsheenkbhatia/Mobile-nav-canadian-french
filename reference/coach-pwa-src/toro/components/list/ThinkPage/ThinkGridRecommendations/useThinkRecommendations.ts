import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import useRecommendations from 'toro/hooks/useRecommendations'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import useAnalyticsEventsRec from 'toro/components/RecommendationsContainer/useAnalyticsEventsRec'

type UseThinkRecommendationsArgs = {
  type: string
}

const useThinkRecommendations = ({ type }: UseThinkRecommendationsArgs) => {
  const styles = useMultiStyleConfig('ThinkGridRecommendations', { variant: 'PLP' })
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '50px' })
  const { fetchRecommendations, isLoading, data } = useRecommendations(type)
  const analytics = useAnalytics()

  const { items = [], vendor, containerDisplayName: label, strategyId, containerId } = data
  const analyticsEvents = useAnalyticsEventsRec({ containerId, vendor, label, strategyId })

  useEffect(() => {
    fetchRecommendations('')
  }, [fetchRecommendations, type])

  return {
    styles,
    ref,
    inView,
    isLoading,
    items,
    vendor,
    label,
    strategyId,
    containerId,
    analytics,
    analyticsEvents,
  }
}

export default useThinkRecommendations
