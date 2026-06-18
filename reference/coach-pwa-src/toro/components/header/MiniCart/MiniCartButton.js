import React, { forwardRef, useContext, useMemo, useEffect, useCallback } from 'react'
import { SHOPPING_BAG_URL } from 'toro/constants/Urls'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import PWAContext from 'components/common/PWAContext'
import useAnalytics from 'toro/analytics/useAnalytics'
import useShoppingGivesTrackingInstance from 'toro/hooks/useShoppingGivesTrackingInstance'
import isBrowser from 'toro/helpers/isBrowser'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useIntl } from 'react-intl'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import {
  reminderInCartBubbleColorAtom,
  reminderInCartIsBubbleOnAtom,
} from 'store/add-to-cart-reminder.atom'
import { useAtomValue } from 'jotai/utils'
import { BagIconV2 } from 'toro/icons'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import { useAtom } from 'jotai'
import useExposedSearch from 'toro/hooks/useExposedSearch'
import { getTotalQty } from 'toro/components/header/MiniCart/helpers'
const MiniCartButton = forwardRef(({ productItems, setIsHoveredOnMiniCart }, ref) => {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const { BagIcon, BagLargeIcon } = useMultiStyleConfig('Icons')
  const { isMobile, isDesktop } = useViewportType()
  const { appData } = useContext(PWAContext)
  const [miniCartOpenReason, setMiniCartOpenReason] = useAtom(miniCartOpenReasonAtom)
  const analytics = useAnalytics()
  const { createTrackingInstance } = useShoppingGivesTrackingInstance()
  const shoppingBagUrl = useLocaleUrl(SHOPPING_BAG_URL)
  const reminderInCartBubbleColor = useAtomValue(reminderInCartBubbleColorAtom)
  const reminderInCartIsBubbleOn = useAtomValue(reminderInCartIsBubbleOnAtom)
  const exposeMobileSearchBar = useExposedSearch()
  const totalQty = useMemo(() => getTotalQty(productItems), [productItems])

  const isSubBrandActive = get(appData, 'isSubBrandActive')
  const MiniCartIcon = useMemo(() => (totalQty < 100 ? BagIcon : BagLargeIcon), [totalQty])

  const handleMouseEnter = useCallback(() => {
    if (productItems?.length > 0 && !miniCartOpenReason) {
      setIsHoveredOnMiniCart(true)
      setMiniCartOpenReason(MiniCartOpenReasons.Hovered)
    }
  }, [productItems, miniCartOpenReason])

  const handleMouseLeave = () => {
    setIsHoveredOnMiniCart(false)
  }

  const {
    reminderInCart: { RICMasterFlag: isCheckoutReminderEnabled },
    generalConfiguration: { enableNewGlobalHeader },
  } = usePreferenceNew({
    ReminderInCart: ['RICMasterFlag'],
    generalConfiguration: ['enableNewGlobalHeader'],
  })

  const styles = useMultiStyleConfig('MiniCart', {
    variant: enableNewGlobalHeader && isMobile && 'globalHeaderV2',
  })

  const isMiniCartBadgeActive =
    isCheckoutReminderEnabled && !!reminderInCartBubbleColor && totalQty > 0

  const handleLinkClick = async (e) => {
    e.preventDefault()

    analytics.send('navClick', {
      eventLocation: 'utility',
      text: 'minicart',
    })

    if (isMiniCartBadgeActive && reminderInCartIsBubbleOn) {
      analytics.send('miniCartBadgeInteraction', {
        eventAction: 'checkout reminder view cart',
      })
      analytics.send('cartInteraction', {
        eventLocation: 'checkout reminder',
        eventAction: 'view bag',
        undefinedKeysToKeep: ['event_label'],
      })
    }

    try {
      await createTrackingInstance()
    } catch (e) {
      console.log('Error during createTrackingInstance', e)
    }

    if (isBrowser()) {
      //we don't want to proxy the request or route it internally, we want to let Akamai handle the redirection
      window.location.href = shoppingBagUrl
    }
  }

  useEffect(() => {
    if (isMiniCartBadgeActive && reminderInCartIsBubbleOn) {
      analytics.send('miniCartBadgeInteraction', {
        eventAction: 'checkout reminder impression',
      })
    }
  }, [isMiniCartBadgeActive, reminderInCartIsBubbleOn])

  return (
    <Link
      aria-label="Mini Cart"
      href={shoppingBagUrl}
      data-qa="m_hdr_icon_minicart"
      onClick={handleLinkClick}
      display="flex"
      sx={styles.miniCart}
    >
      <Flex
        className="bag-icon-container"
        ref={ref}
        alignItems="center"
        justifyContent="center"
        w={theme.space.l}
        position={!isDesktop ? 'static' : 'relative'}
        title={formatMessage(
          {
            id: 'header.navigation.minicart.cartItem',
            defaultMessage: `Cart ${totalQty} items`,
          },
          { totalQty }
        )}
        sx={{
          svg: {
            pointerEvents: 'none',
          },
          ...styles.bagIconContainer,
          ...(!isDesktop
            ? {
                width: '24px',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'relative',
              }
            : {}),
        }}
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        {(enableNewGlobalHeader || exposeMobileSearchBar) && isMobile && !isSubBrandActive ? (
          <BagIconV2 width="16px" height="20px" />
        ) : (
          <MiniCartIcon />
        )}
        <Box
          position="absolute"
          top="4px"
          left="2px"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          sx={styles.cartContentContainer}
        >
          {isMiniCartBadgeActive ? (
            <Text
              variant="eyebrow-primary"
              size="md"
              backgroundColor={reminderInCartBubbleColor}
              sx={styles.miniCartBadge}
            >
              {totalQty}
            </Text>
          ) : (
            <Text variant="eyebrow-primary" size="md">
              {totalQty}
            </Text>
          )}
        </Box>
      </Flex>
    </Link>
  )
})

export default withErrorBoundaryWrapper(MiniCartButton)
