import { useCallback, useReducer, useEffect, useMemo } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

import {
  retrieveXgenRecommendationsAtom,
  xgenRecommendationsDataAtom,
  xgenRecommendationsInitialData,
} from 'store/xgen-recommendations.atom'

import { XgenContainer, XgenContainerID } from 'lib/xgen'
import type { ResponseRecommendations } from 'toro/components/RecommendationsContainer/types'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'
import { xgenClientAtom } from 'store/xgen.atom'
import { categoryIdAtom } from 'store/search-results.atom'
import useXgenMessagingCarryover from 'toro/hooks/useXgenMessagingCarryover'

export enum RESPONSE_REDUCER_ACTIONS {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  SET_DATA = 'SET_DATA',
}

const PLP_CONTAINERS = new Set([
  XgenContainerID.productlisting1_rr,
  XgenContainerID.productlisting2_rr,
  XgenContainerID.productlisting3_rr,
  XgenContainerID.productlisting4_rr,
  XgenContainerID.productlisting7_rr,
  XgenContainerID.plpTopProducts,
])

interface ResponseReducerState {
  data: ResponseRecommendations
  isLoading: boolean
  isError: boolean
  errorMessage: string | undefined
}

interface ResponseReducerAction {
  type: string
  payload?: {
    data?: ResponseRecommendations
    errorMessage?: string | undefined
  }
}

interface ReturnRecommendationsType extends ResponseReducerState {
  fetchRecommendations: (vgId: string) => Promise<XgenContainer>
}

interface UseRecommendationsHook {
  (recommendationId: string, onResponse?: (response) => void): ReturnRecommendationsType
}

const initialState: ResponseReducerState = {
  data: {
    items: [],
    strategyId: '',
    containerId: '',
    containerDisplayName: '',
    vendor: RecommendationVendors.XGEN,
  },
  isLoading: false,
  isError: false,
  errorMessage: undefined,
}

const responseReducer = (state: ResponseReducerState, action: ResponseReducerAction) => {
  switch (action.type) {
    case RESPONSE_REDUCER_ACTIONS.LOADING:
      return { ...state, isLoading: true }
    case RESPONSE_REDUCER_ACTIONS.SUCCESS:
      return { ...state, isLoading: false }
    case RESPONSE_REDUCER_ACTIONS.FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.errorMessage,
      }
    case RESPONSE_REDUCER_ACTIONS.SET_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.data,
        },
      }
  }
}

const useRecommendations: UseRecommendationsHook = (
  type: string,
  onResponse?: (response: ResponseRecommendations) => void
) => {
  const [responseData, setResponseData] = useReducer(responseReducer, initialState)
  const retrieveRecommendations = useUpdateAtom(retrieveXgenRecommendationsAtom)
  const recommendationsData = useAtomValue(xgenRecommendationsDataAtom)
  const xgenClient = useAtomValue(xgenClientAtom)
  const categoryId = useAtomValue(categoryIdAtom)
  const { shouldSetXgenContext, parentCategory } = useXgenMessagingCarryover(type)

  const containerId = XgenContainerID[type]
  const isPlpContainer = PLP_CONTAINERS.has(containerId)
  const shouldSetPlpContext = isPlpContainer && categoryId

  const fetchRecommendations = useCallback(
    async (vgId) => {
      try {
        setResponseData({ type: RESPONSE_REDUCER_ACTIONS.LOADING })

        if (shouldSetPlpContext) {
          await xgenClient.recommendations.setContext({ parentCategory: categoryId })
        }

        if (shouldSetXgenContext) {
          await xgenClient.recommendations.setContext({ parentCategory })
        }

        const recommendations = await retrieveRecommendations({ type, vgId })
        setResponseData({ type: RESPONSE_REDUCER_ACTIONS.SUCCESS })
        const results =
          recommendations?.[containerId] ?? xgenRecommendationsInitialData[containerId]
        onResponse?.(results)
        return results
      } catch (e) {
        setResponseData({
          type: RESPONSE_REDUCER_ACTIONS.FAILURE,
          payload: { errorMessage: e.message },
        })

        console.error('[recommendations][error]:', e)
        return xgenRecommendationsInitialData[containerId]
      }
    },
    [type, retrieveRecommendations]
  )

  useEffect(() => {
    setResponseData({
      type: RESPONSE_REDUCER_ACTIONS.SET_DATA,
      payload: {
        data: recommendationsData[containerId] ?? xgenRecommendationsInitialData[containerId],
      },
    })
  }, [recommendationsData[containerId]])

  return useMemo(
    () => ({ fetchRecommendations, ...responseData }),
    [fetchRecommendations, responseData]
  )
}

export default useRecommendations
