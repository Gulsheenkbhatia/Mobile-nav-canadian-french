import { useAtomValue } from 'jotai/utils'
import { xgenClientAtom } from 'store/xgen.atom'
import { useCallback, useEffect, useState } from 'react'
import { XgenContainerID } from 'lib/xgen'
import { loveAtFirstSwipeProductsAtom } from 'store/love-at-first-swipe.atom'
import { mapXgenToLoveAtFirstSwipeResponse } from 'toro/components/LoveAtFirstSwipe/mapping'
import type { LoveAtFirstSwipeResponse } from 'toro/components/LoveAtFirstSwipe/types'

type State = {
  isLoading: boolean
  data: LoveAtFirstSwipeResponse | null
}

type UseLoveAtFirstSwipeRecommendations = (args?: { enabled?: boolean }) => State

export const useLoveAtFirstSwipeRecommendations: UseLoveAtFirstSwipeRecommendations = ({
  enabled = true,
} = {}) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    data: null,
  })
  const xgenClient = useAtomValue(xgenClientAtom)
  const swipeResults = useAtomValue(loveAtFirstSwipeProductsAtom)
  const likedIds = swipeResults.right || []
  const dislikedIds = swipeResults.left || []

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const prodList = likedIds.length > 0 ? likedIds.join(',') : undefined
      await xgenClient.recommendations.setContext({ prodList })
      await xgenClient.recommendations.excludeProducts(dislikedIds)

      const containerId = XgenContainerID.sm_el_sitewide2
      const rawData = await xgenClient.recommendations.getRaw(containerId)
      const matchingContainer = rawData?.containers?.find(
        (container) => container.containerId === containerId
      )
      if (matchingContainer?.items?.length > 0) {
        setState((prev) => ({
          ...prev,
          data: mapXgenToLoveAtFirstSwipeResponse(matchingContainer),
        }))
      } else {
        setState((prev) => ({ ...prev, data: null }))
      }
    } catch {
      setState((prev) => ({ ...prev, data: null }))
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
      await xgenClient.recommendations.setContext({ prodList: undefined })
      await xgenClient.recommendations.clearExcludedProducts()
    }
  }, [xgenClient, likedIds, dislikedIds])

  useEffect(() => {
    if (!xgenClient || !enabled) return
    void fetchData()
  }, [xgenClient, enabled, fetchData])

  return state
}
