import { useCallback, useState } from 'react'

import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

import { SGWidgetView } from 'toro/components/product/ShoppingGivesWidget/ui/SGWidget.view'
import { useCalcDonationAmount } from 'toro/components/product/ShoppingGivesWidget/hooks/useCalcDonationAmount'
import { useRouter } from 'next/router'
import { useUpdateAtom } from 'jotai/utils'
import { setFlyoutConfigAtom } from 'store/flyout.atom'
import { useIntl } from 'react-intl'

const LOGIN = 'login'
const REGISTER = 'register'

export function ShoppingGivesWidgetCTA({
  // application data
  isLoggedIn,
  // product data
  promotionPrice,
  // plugin data
  isSGWReady,
  isCTASkeletonEnabled,
  shoppingGivesDonationValues,
  // analytics
  sendAuthorizationAnalytics,
}) {
  const router = useRouter()
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)
  const styles = useMultiStyleConfig('ShoppingGivesWidget')
  const { formatMessage, formatNumber } = useIntl()
  const [widgetContainerHeight, setWidgetContainerHeight] = useState('auto')

  const donationAmount = useCalcDonationAmount({
    isSGWReady,
    formatNumber,
    promotionPrice,
    shoppingGivesDonationValues,
  })

  const widgetChildRefHandler = useCallback(
    (node) => {
      if (node) {
        setWidgetContainerHeight(`${node.offsetHeight + 10}px`) // 5px margin * 2
      }
    },
    [isLoggedIn]
  )

  const handleFlyoutConfig = useCallback(
    (signIn: boolean) => {
      const type = signIn ? LOGIN : REGISTER

      setFlyoutConfig({ type, options: { referrer: router.asPath } })
      sendAuthorizationAnalytics(signIn)
    },
    [sendAuthorizationAnalytics, router.asPath]
  )

  const handleLoginClick = useCallback(() => {
    handleFlyoutConfig(true)
  }, [isLoggedIn])

  const handleRegistrationClick = useCallback(() => {
    handleFlyoutConfig(false)
  }, [isLoggedIn])

  /*
   * When the SGW script is ready, and it will inject a new content into the Box wrapper
   * We need to leave only one actual widget in the DOM that was injected by the plugin.
   * */
  const isWidgetCTAContainerVisible = !isSGWReady || isCTASkeletonEnabled

  return (
    <Box
      position="relative"
      height={widgetContainerHeight}
      className="shopping-gives-widget"
      sx={styles.shoppingGivesContainer}
    >
      {isWidgetCTAContainerVisible && (
        <SGWidgetView
          styles={styles}
          isLoggedIn={isLoggedIn}
          donationAmount={donationAmount}
          handleLoginClick={handleLoginClick}
          handleRegistrationClick={handleRegistrationClick}
          widgetChildRefHandler={widgetChildRefHandler}
          formatMessage={formatMessage}
          isSGWReady={isSGWReady}
          isCTASkeletonEnabled={isCTASkeletonEnabled}
        />
      )}
    </Box>
  )
}
