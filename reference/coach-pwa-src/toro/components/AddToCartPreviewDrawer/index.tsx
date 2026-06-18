import { type FC, type ReactEventHandler, useCallback, useContext, useEffect } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Text from 'toro/components/Text'
import Drawer from 'toro/components/Drawer'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import DrawerHeader from 'toro/components/DrawerHeader'
import DrawerBody from 'toro/components/DrawerBody'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import { useIntl } from 'react-intl'
import Link from 'toro/components/Link'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import { CHECKOUT_URL, SHOPPING_BAG_URL } from 'toro/constants/Urls'
import RecommendationsContainer from 'toro/components/Certona/Recommendation'
import { useRouter } from 'next/router'
import DrawerTitle from 'toro/components/AddToCartPreviewDrawer/DrawerTitle'
import useDrawerAnalytics from 'toro/components/AddToCartPreviewDrawer/useDrawerAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import type { SystemStyleObject } from '@chakra-ui/react'
import { ShippingIcon } from 'toro/icons'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import useCartTotalQuantity from 'toro/components/AddToCartPreviewDrawer/useCartTotalQuantity'

type CloseDrawer = (args?: { sendAnalytics?: boolean }) => void

const AddToCartPreviewDrawer: FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { session } = useContext(SessionContext) || {}
  const styles: Record<string, SystemStyleObject> = useMultiStyleConfig('AddToCartPreviewDrawer')

  const [drawerState, setDrawerState] = useDrawerAtom()
  const [shoppingBagUrl, checkoutUrl] = useLocaleUrl([SHOPPING_BAG_URL, CHECKOUT_URL]) as string[]
  const cartProducts = get(session, 'cart.product_items', [])
  const totalQuantity = useCartTotalQuantity({ cartProducts })
  const analytics = useDrawerAnalytics({
    variantId: drawerState.variantId,
    isDrawerVisible: drawerState.drawerVisible,
    cartProducts,
  })

  const translation = {
    subtitle: formatMessage({
      id: 'pdp.cart.urgency.message',
      defaultMessage: ' ',
    }),
    shipping: formatMessage({
      id: 'pdp.cart.shipping.message',
      defaultMessage: 'Free Shipping & Returns',
    }),
    button: {
      checkout: formatMessage({ id: 'header.minicart.checkout', defaultMessage: 'Checkout' }),
      shoppingBag: formatMessage({
        id: 'header.minicart.viewShoppingBag',
        defaultMessage: 'View Your Bag',
      }),
    },
  }

  const closeDrawer = useCallback<CloseDrawer>(
    ({ sendAnalytics = true } = {}) => {
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: { drawerVisible: false },
      })
      if (sendAnalytics) {
        analytics.sendCheckoutDrawerCloseAction()
      }
    },
    [setDrawerState, analytics.sendCheckoutDrawerCloseAction]
  )

  useEffect(() => {
    const routeChangeHandler = () => {
      if (!drawerState.drawerVisible) return
      closeDrawer({ sendAnalytics: false })
    }

    router.events.on('routeChangeStart', routeChangeHandler)
    return () => {
      router.events.off('routeChangeStart', routeChangeHandler)
    }
  }, [drawerState.drawerVisible, closeDrawer])

  const checkoutLinkClickHandler: ReactEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    analytics.sendBeginCheckoutAction()
    analytics.sendCheckoutAction()
    window.location.href = checkoutUrl
  }

  const shoppingBagLinkClickHandler: ReactEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    analytics.sendViewShoppingBagAction()
    window.location.href = shoppingBagUrl
  }

  return (
    <Drawer
      id="post-add-to-cart-drawer"
      isOpen={drawerState.drawerVisible}
      onClose={closeDrawer}
      blockScrollOnMount={drawerState.drawerVisible}
      isFullHeight
    >
      <DrawerOverlay sx={styles.drawerOverlay} />
      <DrawerContent sx={styles.drawerContent}>
        <DrawerHeader sx={styles.drawerHeader}>
          <DrawerCloseButton sx={styles.drawerCloseButton} />
          <DrawerTitle
            styles={styles}
            isPartialAdded={drawerState.isPartialAdded}
            drawerError={drawerState.drawerErrorMsgFlag}
            drawerQuantity={drawerState.drawerQuantity}
          />
          <Text sx={styles.drawerSubtitle}>{translation.subtitle}</Text>
          <Flex sx={styles.drawerShippingWrapper}>
            <ShippingIcon width={16} height={16} viewBox="0 0 24 24" />
            <Text sx={styles.drawerShipping}>{translation.shipping}</Text>
          </Flex>
          <Flex direction="column" sx={styles.drawerButtonsWrapper}>
            <Link
              href={checkoutUrl}
              variant="unstyled"
              onClick={checkoutLinkClickHandler}
              sx={styles.drawerLink}
            >
              <Button size="lg" sx={{ ...styles.drawerButton, ...styles.drawerCheckoutButton }}>
                {translation.button.checkout}
              </Button>
            </Link>
            <Link
              href={shoppingBagUrl}
              variant="unstyled"
              onClick={shoppingBagLinkClickHandler}
              sx={styles.drawerLink}
            >
              <Button
                size="lg"
                variant="outline"
                sx={{ ...styles.drawerButton, ...styles.drawerShoppingButton }}
              >
                {translation.button.shoppingBag} ({totalQuantity})
              </Button>
            </Link>
          </Flex>
        </DrawerHeader>
        <DrawerBody sx={styles.drawerBody}>
          <RecommendationsContainer
            type="addtocart"
            vgId={drawerState.variantId}
            styleVariantOverride="postAddToCartDrawer"
            showDivider={false}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default withErrorBoundaryWrapper(AddToCartPreviewDrawer)
