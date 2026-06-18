import { useShoppingGivesAnalytics } from 'toro/components/product/ShoppingGivesWidget/hooks/useShoppingGivesAnalytics'

import type { UseSGWidgetAPI } from 'toro/components/product/ShoppingGivesWidget/hooks/useSGWidgetAPI'
import type { WithEnabledSGWidgetAPIProps } from 'toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledAPI'

import { SGWScript } from 'toro/components/product/ShoppingGivesWidget/SGWScript'
import { useSGWScriptLoading } from 'toro/components/product/ShoppingGivesWidget/hooks/useSGWScriptLoading'
import { useShoppingGivesHandlers } from 'toro/components/product/ShoppingGivesWidget/hooks/useShoppingGivesHandlers'
import { ShoppingGivesWidgetCTA } from 'toro/components/product/ShoppingGivesWidget/ShoppingGivesWidgetCTA'

export type ShoppingGivesWidgetProps = WithEnabledSGWidgetAPIProps & {
  shoppingGivesDonationValues: UseSGWidgetAPI['shoppingGivesDonationValues']
}
export function ShoppingGivesWidget({
  masterId,
  promotionPrice,
  configMode,
  isLoggedIn,
  preferences,
  analyticsSend,
  shoppingGivesDonationValues,
}: ShoppingGivesWidgetProps) {
  const analyticsSendHandlers = useShoppingGivesAnalytics({ analyticsSend })

  const {
    isSGWReady,
    isSGWLoadError,
    isSGWScriptLoading,
    onSGScriptReady,
    onSGWLoadError,
    onSGWStartLoading,
  } = useSGWScriptLoading({ isLoggedIn, masterId, promotionPrice })

  useShoppingGivesHandlers({
    isLoggedIn,
    isSGWReady,
    analyticsSendHandlers,
  })

  /*
   * Between the time the SGW script is loading and the time it is ready, the CTA buttons are without listener.
   * In some cases, we need to wait for all page properties to be ready to start loading the script.
   * */
  const isCTASkeletonEnabled =
    isSGWScriptLoading || (isLoggedIn && !isSGWReady && !isSGWScriptLoading)

  return (
    <>
      <SGWScript
        // app state
        masterId={masterId}
        configMode={configMode}
        isLoggedIn={isLoggedIn}
        shoppingGivesStoreId={preferences?.shoppingGivesStoreId}
        // product
        promotionPrice={promotionPrice}
        // plugin
        isSGWReady={isSGWReady}
        onSGWLoadError={onSGWLoadError}
        onSGScriptReady={onSGScriptReady}
        onSGWStartLoading={onSGWStartLoading}
        isSGWScriptLoading={isSGWScriptLoading}
      />
      {!isSGWLoadError && (
        <ShoppingGivesWidgetCTA
          // application data
          isLoggedIn={isLoggedIn}
          // product data
          promotionPrice={promotionPrice}
          // plugin data
          isSGWReady={isSGWReady}
          isCTASkeletonEnabled={isCTASkeletonEnabled}
          shoppingGivesDonationValues={shoppingGivesDonationValues}
          // analytics
          sendAuthorizationAnalytics={analyticsSendHandlers.sendAuthorizationAnalytics}
        />
      )}
    </>
  )
}
