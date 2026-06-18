import PWAContext from 'components/common/PWAContext'
import { useContext, useEffect, useState } from 'react'
import usePreference from 'toro/hooks/usePreference'
import {
  sendViewProduct,
  fetchRecommendations,
  sendClickReco,
  sendViewReco,
  sendAddToCart,
} from './helpers'
import get from 'lodash/get'

function useEinsteinRecommendations({
  pageType = '',
  productId = '',
  recommender = '',
  isInView = false,
  triggerPageViewImpression = false,
  isEinsteinEnabled = false,
}) {
  const [recommendations, setRecommendations] = useState({})
  const [isLoadingRecommendations, setLoadingRecommendations] = useState(true)
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')

  const url = usePreference({
    groupId: 'EinsteinRecommendation',
    siteId,
    preferenceId: 'einsteinAPIUrl',
    defaultValue: '',
  })

  const einsteinSiteId = usePreference({
    groupId: 'EinsteinRecommendation',
    siteId,
    preferenceId: 'einsteinSiteId',
    defaultValue: '',
  })

  const einsteinClientId = usePreference({
    groupId: 'EinsteinRecommendation',
    siteId,
    preferenceId: 'einsteinClientId',
    defaultValue: '',
  })

  useEffect(() => {
    if (triggerPageViewImpression && pageType === 'PDP' && recommender && productId) {
      sendViewProduct({
        url,
        einsteinSiteId,
        einsteinClientId,
        productId,
      })
    }
  }, [triggerPageViewImpression])

  useEffect(() => {
    if (isEinsteinEnabled && recommender && pageType === 'searchSuggestion') {
      getAllRecommendations()
    }
  }, [])

  useEffect(() => {
    if (isInView) {
      getAllRecommendations()
    }
  }, [isInView])

  const getAllRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const response = await fetchRecommendations({
        url,
        einsteinSiteId,
        einsteinClientId,
        products: productId
          ? [
              {
                id: productId,
              },
            ]
          : [],
        recommender,
      })
      setRecommendations(response)
      setLoadingRecommendations(false)
    } catch {
      setLoadingRecommendations(false)
    }
  }

  const sendRecommendationClick = async ({ id, recommenderName, recoUUID }) => {
    await sendClickReco({
      url,
      einsteinSiteId,
      einsteinClientId,
      id,
      recommenderName,
      recoUUID,
    })
  }

  const sendRecommendationView = async ({ products, recommenderName, recoUUID }) => {
    await sendViewReco({
      url,
      einsteinSiteId,
      einsteinClientId,
      products,
      recommenderName,
      recoUUID,
    })
  }

  const sendRecoAddToCart = async ({ product }) => {
    await sendAddToCart({
      url,
      einsteinSiteId,
      einsteinClientId,
      product,
    })
  }

  return {
    recommendations,
    isLoadingRecommendations,
    sendRecommendationClick,
    sendRecommendationView,
    sendRecoAddToCart,
  }
}

export default useEinsteinRecommendations
