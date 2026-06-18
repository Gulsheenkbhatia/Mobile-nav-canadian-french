import { useCallback, useMemo, useContext, useRef, useEffect } from 'react'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import {
  currentLocaleAtom,
  setVisuallySimilarDataAtom,
  setIsVisuallySimilarDataInitializedAtom,
} from 'store/global.atom'
import { visuallySimilarPropAtom } from 'store/pdp.atom'
import PWAContext from 'components/common/PWAContext'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  getVisuallySimilarV1Data,
  abortableFetchVisuallySimilarData,
} from 'toro/helpers/visuallySimilar'
import { getToken } from 'toro/lib/shopper-login/helpers/token'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const useLLMRecommendations = ({
  clearDataOnUnmount = true,
}: { clearDataOnUnmount?: boolean } = {}) => {
  const { appData } = useContext(PWAContext)
  const imageDomain = get(appData, 'imageDomain')
  const setVisuallySimilarData = useUpdateAtom(setVisuallySimilarDataAtom)
  const setIsVisuallySimilarDataInitialized = useUpdateAtom(setIsVisuallySimilarDataInitializedAtom)
  const isViewSimilarLlmPdpATestEnabled = useExperiment(EXPERIMENTS.VIEW_SIMILAR_LLM_PDP_A)
  const isViewSimilarLlmPdpBTestEnabled = useExperiment(EXPERIMENTS.VIEW_SIMILAR_LLM_PDP_B)
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPV6Enabled = useTemplate([TemplateName.pdpv6])
  const isViewSimilarLlmPlpTestEnabled = useExperiment(EXPERIMENTS.VIEW_SIMILAR_LLM_PLP)
  const isPrioritizeYmalOverVs = useExperiment(EXPERIMENTS.PRIORITIZE_YMAL_OVER_VS)
  const locale = useAtomValue(currentLocaleAtom)
  const abortController = useRef(null)
  const {
    toggleSiteFeatures: { enableVisuallySimilar },
  } = usePreference({
    ToggleSiteFeatures: ['enableVisuallySimilar'],
  })
  const visuallySimilarProp = useAtomValue(visuallySimilarPropAtom)

  // Check if VS should be disabled due to V6 + ABTEST-4916
  const shouldDisableVisuallySimilar = isPDPV6Enabled && isPrioritizeYmalOverVs

  const isVisuallySimilarPDPEnabled =
    get(enableVisuallySimilar, 'PDP.enable', false) &&
    (isPDPV5Enabled || isViewSimilarLlmPdpATestEnabled || isViewSimilarLlmPdpBTestEnabled) &&
    !shouldDisableVisuallySimilar

  const isVisuallySimilarPlpWithExpEnabled =
    get(enableVisuallySimilar, 'PLP.enable', false) && isViewSimilarLlmPlpTestEnabled

  const excludeVisuallySimilarCertona = get(
    enableVisuallySimilar,
    'excludeVisuallySimilarCertona',
    false
  )

  const minVisaullySimilarCount = get(enableVisuallySimilar, 'minRecommendation')
  const maxVisaullySimilarCount = get(enableVisuallySimilar, 'maxRecommendation')
  const llmApiVersion = get(enableVisuallySimilar, 'version')

  const abortDataRequest = () => {
    setIsVisuallySimilarDataInitialized(false)
    setVisuallySimilarData([])
    abortController.current?.abort()
    abortController.current = null
  }

  useEffect(() => {
    return () => {
      if (clearDataOnUnmount) {
        setIsVisuallySimilarDataInitialized(false)
        setVisuallySimilarData([])
      }
      abortController.current?.abort()
      abortController.current = null
    }
  }, [clearDataOnUnmount])

  const setVisuallySimilarProp = useCallback(
    async (propValue) => {
      abortDataRequest()
      let data = []
      if (propValue?.includes('[')) {
        data = getVisuallySimilarV1Data(propValue, locale, imageDomain)
        setIsVisuallySimilarDataInitialized(true)
      } else if (propValue?.length) {
        const { token } = await getToken()
        const { controller, fetchLatest } = abortableFetchVisuallySimilarData(
          propValue,
          minVisaullySimilarCount,
          maxVisaullySimilarCount,
          token
        )
        abortController.current = controller
        const latest = await fetchLatest
        data = await latest?.json()
        setIsVisuallySimilarDataInitialized(true)
      } else if (typeof propValue === 'string' && !propValue?.length) {
        setIsVisuallySimilarDataInitialized(true)
      }
      setVisuallySimilarData(data)
    },
    [enableVisuallySimilar]
  )

  return useMemo(
    () => ({
      isViewSimilarLlmPdpATestEnabled,
      isViewSimilarLlmPdpBTestEnabled,
      enableVisuallySimilar,
      isVisuallySimilarPDPEnabled,
      isVisuallySimilarPlpWithExpEnabled,
      excludeVisuallySimilarCertona,
      minVisaullySimilarCount,
      maxVisaullySimilarCount,
      setVisuallySimilarProp,
      llmApiVersion,
      visuallySimilarProp,
    }),
    [enableVisuallySimilar, visuallySimilarProp]
  )
}

export default useLLMRecommendations
