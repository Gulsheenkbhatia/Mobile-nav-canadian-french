import dynamic from 'next/dynamic'

import { useSGWidgetAPI } from 'toro/components/product/ShoppingGivesWidget/hooks/useSGWidgetAPI'
import { UseShoppingGivesPreferences } from 'toro/components/product/ShoppingGivesWidget/hooks/useShoppingGivesPreferences'

import type { UseShoppingGivesAnalyticsProps } from 'toro/components/product/ShoppingGivesWidget/hooks/useShoppingGivesAnalytics'
import { SGWidgetWithEnabledPreferencesProps } from 'toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledPreferences'

const ShoppingGivesWidgetContainer = dynamic(
  import('toro/components/product/ShoppingGivesWidget/ShoppingGivesWidget').then(
    (mod) => mod.ShoppingGivesWidget
  ),
  { ssr: false }
)

export type WithEnabledSGWidgetAPIProps = SGWidgetWithEnabledPreferencesProps & {
  isLoggedIn: boolean
  preferences: UseShoppingGivesPreferences
  analyticsSend: UseShoppingGivesAnalyticsProps['analyticsSend']
  createEventData: unknown // TODO: define type
  isDataLayerInitialized: boolean
}

export function SGWidgetWithEnabledAPI(props: WithEnabledSGWidgetAPIProps) {
  const { canDisplayWidget, shoppingGivesDonationValues } = useSGWidgetAPI({
    configMode: props.configMode,
    isLoggedIn: props.isLoggedIn,
    preferences: props.preferences,
    createEventData: props.createEventData,
    isDataLayerInitialized: props.isDataLayerInitialized,
  })

  if (!canDisplayWidget) return null

  return (
    <ShoppingGivesWidgetContainer
      {...props}
      shoppingGivesDonationValues={shoppingGivesDonationValues}
    />
  )
}
