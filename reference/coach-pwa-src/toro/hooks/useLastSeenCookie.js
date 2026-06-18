import { useEffect } from 'react'
import Cookies from 'js-cookie'
import get from 'lodash/get'
import omit from 'lodash/omit'
import keys from 'lodash/keys'
import values from 'lodash/values'
import { LAST_SEEN_PRODUCT_IDS } from 'toro/constants/cookies'
import usePreference from 'toro/hooks/usePreference'
import { getDaysFromSeconds } from 'toro/helpers/date'
import { getSiteValueFromPref } from 'toro/helpers/preferences'

const RECENTLY_VIEWED_LIMIT = 4

export default function useLastSeenCookie({
  appData,
  pageData,
  originalProductId,
  disabled = false,
}) {
  const siteId = get(appData, 'siteId')
  const productId = get(pageData, 'id')
  const searchSuggestionsPreference = usePreference({
    groupId: 'SearchSuggestions',
    preferenceId: 'lastSeenpidsCookieMaxAge',
  })

  const lastSeenpidsCookieMaxAge = getSiteValueFromPref(searchSuggestionsPreference, siteId)
  // Try/catch inserted to handle scenarios where a malformed cookie value is set in user's browser
  // TODO - Use local storage instead
  useEffect(() => {
    if (productId && lastSeenpidsCookieMaxAge && !disabled) {
      const lastSeenData = Cookies.get(LAST_SEEN_PRODUCT_IDS)
      let parsedLastSeenData = {}
      try {
        parsedLastSeenData = lastSeenData ? JSON.parse(lastSeenData) : {}
      } catch (error) {
        parsedLastSeenData = {}
      }

      const recentlyViewedProductIds = values(parsedLastSeenData) || []
      const _lastSeenProductId = !!originalProductId?.trim() ? originalProductId : productId

      if (!recentlyViewedProductIds.includes(_lastSeenProductId)) {
        const lastSeenProducts = {
          [`${new Date()}`]: _lastSeenProductId,
          ...omit(parsedLastSeenData, keys(parsedLastSeenData)[RECENTLY_VIEWED_LIMIT - 1]),
        }

        Cookies.set(LAST_SEEN_PRODUCT_IDS, JSON.stringify(lastSeenProducts), {
          expires: getDaysFromSeconds(lastSeenpidsCookieMaxAge),
        })
      }
    }
  }, [productId, lastSeenpidsCookieMaxAge])
}
