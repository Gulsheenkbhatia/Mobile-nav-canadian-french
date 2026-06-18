import { useCallback, useMemo } from 'react'
import type { AnalyticsEvents } from 'toro/components/RecommendationsContainer/types'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'

// Analytics events for the Recommendations container
// Usage: container level, not product tile level

function useAnalyticsEventsRec({ containerId, vendor, label, strategyId }): AnalyticsEvents {
  const { addImpression, selectRecommItem, addToWishlistRecommItem, removeFromWishlistRecommItem } =
    useRecommAnalytics({
      eventLocation: containerId,
      schemeExpId: strategyId,
    })

  const eventBasePayload = useMemo(() => {
    return {
      eventLocation: containerId,
      recAIType: vendor,
      listName: label,
    }
  }, [containerId, vendor, label])

  const onTileVisible = useCallback(
    (product, idx, overrides = {}) => {
      const event = {
        ...eventBasePayload,
        product,
        idx,
        sendOnceInViewport: true,
        ...overrides,
      }

      addImpression(event)
    },
    [addImpression, eventBasePayload]
  )

  const onTileClick = useCallback(
    (product, idx, overrides = {}) => {
      const event = {
        ...eventBasePayload,
        product,
        idx,
        ...overrides,
      }

      selectRecommItem(event)
    },
    [selectRecommItem, eventBasePayload]
  )

  const onLinkClick = (product, idx) => () => {
    selectRecommItem({
      ...eventBasePayload,
      product,
      idx,
    })
  }

  const onAddToWishlistSuccess = useCallback(
    (product, idx) => {
      const event = {
        ...eventBasePayload,
        product,
        idx,
      }

      addToWishlistRecommItem(event)
    },
    [addToWishlistRecommItem, eventBasePayload]
  )

  const onRemoveFromWishlistSuccess = useCallback(
    (product, idx) => {
      const event = {
        ...eventBasePayload,
        product,
        idx,
      }

      removeFromWishlistRecommItem(event)
    },
    [removeFromWishlistRecommItem, eventBasePayload]
  )

  return useMemo(
    () => ({
      onTileVisible,
      onTileClick,
      onAddToWishlistSuccess,
      onRemoveFromWishlistSuccess,
      onLinkClick,
    }),
    [onTileVisible, onTileClick, onAddToWishlistSuccess, onRemoveFromWishlistSuccess, onLinkClick]
  )
}

export default useAnalyticsEventsRec
