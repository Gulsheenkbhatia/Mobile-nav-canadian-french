import { useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference'
import { SHOPPING_GIVES_GROUP_ID, SHOPPING_GIVES_STORE_ID } from 'toro/site-preferences'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import { API_TRACKING_SHOPPING_GIVES } from 'toro/constants/Urls'

const useShoppingGivesTrackingInstance = () => {
  const { appData } = useContext(PWAContext)
  const shoppingGivesStoreIdPref = usePreference({
    groupId: SHOPPING_GIVES_GROUP_ID,
    preferenceId: SHOPPING_GIVES_STORE_ID,
  })
  const shoppingGivesStoreId = getSiteValueFromPref(shoppingGivesStoreIdPref, appData?.siteId)

  const decodeTrackingId = (storeId) => {
    if (!storeId) return null
    storeId = storeId.replace(/-/g, '')

    let value = sessionStorage.getItem(`sg.sid-${storeId}`)

    if (value && value.length > 0) {
      return window.atob(value)
    }

    return null
  }

  const createTrackingInstance = () => {
    const decodedStoreId = decodeTrackingId(shoppingGivesStoreId)

    if (decodedStoreId && !!shoppingGivesStoreId) {
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/*+json',
        },
        body: JSON.stringify({
          storeId: shoppingGivesStoreId || '',
          id: decodedStoreId || '',
          isTestMode: appData.shoppingGivesIsTest,
        }),
      }
      return fetch(API_TRACKING_SHOPPING_GIVES, options)
    }
  }

  return { createTrackingInstance }
}

export default useShoppingGivesTrackingInstance
