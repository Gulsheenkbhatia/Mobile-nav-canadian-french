import { useContext } from 'react'
import get from 'lodash/get'
import AnalyticsContext from 'toro/analytics/AnalyticsContext'
import PWAContext from 'components/common/PWAContext'

const MOCK_ANALYTICS = {
  send: () => {},
  addImpression: () => {},
  pageBecameInteractive: () => {},
  createEventData: () => {},
}

const useAnalytics = () => {
  const { appData } = useContext(PWAContext)
  const isOptGtmDisabled = get(appData, 'isOptGtmDisabled')

  const analytics = useContext(AnalyticsContext)

  /*
      If "isOptGtmDisabled" is true, then "optgtm=false" is in the URL query parameters.
      In this case, we return a mock analytics object so that analytics function calls
      do not break the site, since the AnalyticsContext will be empty.
  */
  return isOptGtmDisabled ? MOCK_ANALYTICS : analytics
}

export default useAnalytics
