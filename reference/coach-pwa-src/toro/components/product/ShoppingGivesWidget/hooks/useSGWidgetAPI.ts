import { useMemo } from 'react'

import { useIsDisplayWidget } from 'toro/components/product/ShoppingGivesWidget/hooks/useIsDisplayWidget'
import { useGetShoppingGivesConfigs } from 'toro/components/product/ShoppingGivesWidget/hooks/useLoadShoppingGivesConfigs'

import type { UseLoadShoppingGivesConfigs } from 'toro/components/product/ShoppingGivesWidget/hooks/useLoadShoppingGivesConfigs'
import type { WithEnabledSGWidgetAPIProps } from 'toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledAPI'

export type UseSGWidgetAPI = {
  canDisplayWidget: boolean
  shoppingGivesDonationValues: UseLoadShoppingGivesConfigs['shoppingGivesDonationValues']
}

type UseSGWidgetAPIProps = Pick<
  WithEnabledSGWidgetAPIProps,
  'configMode' | 'isLoggedIn' | 'preferences' | 'createEventData' | 'isDataLayerInitialized'
>

/*
 * This hook is responsible for loading the Shopping Gives API configuration.
 * If configuration is enabled, and it provides the shoppingGivesDonationValues we can move forward.
 * */
export function useSGWidgetAPI({
  configMode,
  isLoggedIn,
  preferences,
  createEventData,
  isDataLayerInitialized,
}: UseSGWidgetAPIProps): UseSGWidgetAPI {
  const {
    shoppingGivesUrl,
    shoppingGivesStoreId,
    shoppingGivesBMIsEnabled,
    shoppingGivesGuestEnabled,
    shoppingGivesInsiderEnabled,
    shoppingGivesGuestCustomerSegment,
  } = preferences

  const { isShoppingGivesActive, shoppingGivesDonationValues, shoppingGivesActiveCustomerSegment } =
    useGetShoppingGivesConfigs({
      // global
      configMode,
      isLoggedIn,
      // analytics
      createEventData,
      // preferences
      shoppingGivesStoreId,
      shoppingGivesGuestCustomerSegment,
    })

  const canDisplayWidget = useIsDisplayWidget({
    // configs
    isLoggedIn,
    isShoppingGivesActive,
    isDataLayerInitialized,
    shoppingGivesActiveCustomerSegment,
    // preferences
    shoppingGivesUrl,
    shoppingGivesStoreId,
    shoppingGivesBMIsEnabled,
    shoppingGivesGuestEnabled,
    shoppingGivesInsiderEnabled,
  })

  return useMemo(
    () => ({
      canDisplayWidget,
      shoppingGivesDonationValues,
    }),
    [canDisplayWidget, shoppingGivesDonationValues]
  )
}
