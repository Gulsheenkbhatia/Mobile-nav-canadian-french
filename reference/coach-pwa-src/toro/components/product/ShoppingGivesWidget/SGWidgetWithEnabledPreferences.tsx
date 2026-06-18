import { useContext } from 'react'
import dynamic from 'next/dynamic'

import useAnalytics from 'toro/analytics/useAnalytics'
import SessionContext from 'toro/components/SessionContext'

import { useShoppingGivesPreferences } from 'toro/components/product/ShoppingGivesWidget/hooks/useShoppingGivesPreferences'
import type { WithEnabledSGWidgetAPIProps } from 'toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledAPI'

import {
  SHOPPING_GIVES_DEV_CONFIG_MODE,
  SHOPPING_GIVES_PROD_CONFIG_MODE,
} from 'toro/constants/appConstants'

const WithSGWidgetAPI = dynamic<WithEnabledSGWidgetAPIProps>(
  () =>
    import('toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledAPI').then(
      (mod) => mod.SGWidgetWithEnabledAPI
    ),
  {
    ssr: false,
  }
)

export const configModeMap = {
  [SHOPPING_GIVES_DEV_CONFIG_MODE]: 'staging',
  [SHOPPING_GIVES_PROD_CONFIG_MODE]: 'production',
}

export type SGWidgetWithEnabledPreferencesProps = {
  masterId?: string
  promotionPrice: number
  configMode: keyof typeof configModeMap
}

/*
 * This component is responsible for checking if the widget is enabled.
 * If it is, it will load and render the WithSGWidgetAPI that will check the Shopping Gives API.
 * */
export function SGWidgetWithEnabledPreferences(props: SGWidgetWithEnabledPreferencesProps) {
  // TODO: session and isLoggedIn can be refactored to use as props.
  const { session } = useContext(SessionContext)
  const isLoggedIn = !!session?.user?.userEmail
  const preferences = useShoppingGivesPreferences()
  const { isDataLayerInitialized, send: analyticsSend, createEventData } = useAnalytics()

  const isSGWidgetEnabled = checkIfCharityWidgetEnabled({
    isLoggedIn,
    shoppingGivesStoreId: preferences.shoppingGivesStoreId,
    isDataLayerInitialized,
    shoppingGivesBMIsEnabled: preferences.shoppingGivesBMIsEnabled,
    shoppingGivesGuestEnabled: preferences.shoppingGivesGuestEnabled,
    shoppingGivesInsiderEnabled: preferences.shoppingGivesInsiderEnabled,
  })

  if (!isSGWidgetEnabled) return null

  return (
    <WithSGWidgetAPI
      {...props}
      isLoggedIn={isLoggedIn}
      preferences={preferences}
      analyticsSend={analyticsSend}
      createEventData={createEventData}
      isDataLayerInitialized={isDataLayerInitialized}
    />
  )
}

/*
 * Before fetching the plugin configuration, we need to check if the widget is enabled on the BM side.
 * */
function checkIfCharityWidgetEnabled({
  isLoggedIn,
  shoppingGivesStoreId,
  isDataLayerInitialized,
  shoppingGivesBMIsEnabled,
  shoppingGivesGuestEnabled,
  shoppingGivesInsiderEnabled,
}): boolean {
  return (
    isDataLayerInitialized &&
    shoppingGivesStoreId &&
    shoppingGivesBMIsEnabled &&
    (!isLoggedIn ? shoppingGivesGuestEnabled : shoppingGivesInsiderEnabled)
  )
}
