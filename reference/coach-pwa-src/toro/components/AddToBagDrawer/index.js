import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import HtmlContent from 'toro/components/HtmlContent'
import { CHECKOUT_URL, SHOPPING_BAG_URL } from 'toro/constants/Urls'
import Button from 'toro/components/Button'
import isBrowser from 'toro/helpers/isBrowser'
import { useIntl } from 'react-intl'
import useTheme from 'toro/hooks/useTheme'
import useAnalytics from 'toro/analytics/useAnalytics'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import { fetchFullData } from 'helpers/getFullData'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ATBProductRecommendations from '../ATBProductRecommendations'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import { CloseLargeIcon, InfoOutlinedIcon, ShippingIcon } from 'toro/icons'
import { ATB_DRAWER_ACTIONS, useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import useExperiment from 'toro/hooks/useExperiment'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { useRouter } from 'next/router'
import useCartTotalQuantity from 'toro/components/AddToCartPreviewDrawer/useCartTotalQuantity'

export const MAX_REACHED_MSG = 'You have now reached the maximum purchase limit for this item.'
const NO_TRANSLATION = 'no translation message'

const AddToCartDrawer = ({ maxQuantityError = null }) => {
  const { appData } = useContext(PWAContext)
  const { defaultLocale, locale } = appData
  const { formatMessage } = useIntl()
  const isPDPTemplateV3 = useExperiment(EXPERIMENTS.PDP_V3)
  const isEnchancedATBExperimentEnabled = useExperiment(EXPERIMENTS.ENCHANCED_ATB_DRAWER)
  const isPostATBMobileExperimentEnabled = useExperiment(EXPERIMENTS.POST_ATB_MOBILE)
  const [
    { drawerVisible, drawerQuantity, isPartialAdded, drawerErrorMsgFlag, variantId },
    setDrawerState,
  ] = useDrawerAtom()
  const analytics = useAnalytics()
  const router = useRouter()
  const theme = useTheme()
  const [cartItems, setCartItems] = useState([])
  const [shoppingBagUrl, checkoutUrl] = useLocaleUrl([SHOPPING_BAG_URL, CHECKOUT_URL])
  const { session } = useContext(SessionContext)
  const cartProducts = get(session, 'cart.product_items', [])
  const currentLocaleObj = getCurrentLocale(locale || defaultLocale)
  const currentLocale = currentLocaleObj?.locale
  const minibagDisclaimer = get(appData, 'minibagDisclaimer')
  const totalQuantity = useCartTotalQuantity({ cartProducts })
  const { isVisuallySimilarPlpWithExpEnabled, isVisuallySimilarPDPEnabled } = useLLMRecommendations(
    { clearDataOnUnmount: false }
  )
  const llmCloseDataQA =
    (isVisuallySimilarPlpWithExpEnabled || isVisuallySimilarPDPEnabled) && 'llm_atb_cta_close'

  const labels = useMemo(() => {
    return {
      partialErrorText: formatMessage(
        {
          id: 'header.minicart.drawerQuantity',
          defaultMessage: '{drawerQuantity} item(s) added to bag.',
        },
        { drawerQuantity }
      ),
      maxReachedText: formatMessage({
        id: 'header.minicart.maxReachedText',
        defaultMessage: MAX_REACHED_MSG,
      }),
      itemNotAvailable: formatMessage({
        id: 'header.minicart.itemNotAvailable',
        defaultMessage: 'This item is no longer available and cannot be added to your bag.',
      }),
      itemAddedToBag: formatMessage(
        {
          id: 'header.minicart.itemaddedtobag',
          defaultMessage: '{drawerQuantity} item(s) successfully added to bag.',
        },
        { drawerQuantity }
      ),
    }
  }, [drawerQuantity])

  const {
    retentionToastMessageOnMobile: {
      displayRetentionToastOnMobileDrawer,
      retentionToastMessageText: retentionToastMessageTextPreference,
    },
    adaptiveExperience: { enableEnhancedATBDrawer },
  } = usePreference({
    retentionToastMessageOnMobile: [
      'displayRetentionToastOnMobileDrawer',
      'retentionToastMessageText',
    ],
    adaptiveExperience: ['enableEnhancedATBDrawer'],
  })
  const isEnchancedATBEnabled = enableEnhancedATBDrawer && isEnchancedATBExperimentEnabled

  const variant =
    (isPostATBMobileExperimentEnabled && 'postATBMobile') ||
    (isEnchancedATBEnabled && 'enchncedATBRecommendationMobile')

  const styles = useMultiStyleConfig('AddToBagDrawer', {
    variant,
  })
  const retentionToastMessageText =
    retentionToastMessageTextPreference?.[currentLocale?.replace('-', '_')] ||
    retentionToastMessageTextPreference?.['en_US']

  useEffect(() => {
    return () => {
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: {
          drawerVisible: false,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (drawerVisible) {
      toggleBodyScroll(false)
      analytics.send('cartInteraction', {
        eventLocation: 'checkout drawer',
        eventAction: 'checkout drawer open',
        product: { id: variantId },
      })
    } else {
      toggleBodyScroll(true)
      // TODO: consider to move the hide event from the ProductMainSection
    }
    return () => {
      toggleBodyScroll(true)
    }
  }, [drawerVisible])

  const closeDrawer = useCallback(
    (sendAnalytics = true) => {
      setDrawerState({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: { drawerVisible: false },
      })
      if (sendAnalytics) {
        analytics.send('cartInteraction', {
          eventLocation: 'checkout drawer',
          eventAction: 'checkout drawer close',
          product: { id: variantId },
        })
      }
    },
    [setDrawerState]
  )

  useEffect(() => {
    const handleCartItems = async () => {
      if (cartProducts?.length && drawerVisible) {
        const completeProducts = await fetchFullData(cartProducts, {
          includeInventory: true,
          locale: locale || defaultLocale,
        })
        setCartItems(completeProducts)
      }
    }
    handleCartItems()
  }, [cartProducts, drawerVisible])

  useEffect(() => {
    const handleRouteChange = () => {
      if (drawerVisible) {
        closeDrawer(false)
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [drawerVisible, closeDrawer])

  const handleCheckout = useCallback(
    (event) => {
      event.preventDefault()
      if (cartItems?.length) {
        analytics.send('beginCheckout', {
          eventLocation: 'checkout drawer',
          products: cartItems,
          eventAction: 'begin_checkout',
          checkoutOption: 'regular',
        })
        analytics.send('cartInteraction', {
          eventLocation: 'checkout drawer',
          eventAction: 'checkout',
          eventLabel: variantId,
        })
      }
      // We don't want to proxy the request or route it internally
      // and let Akamai handle the redirection instead.
      if (isBrowser()) {
        window.location.href = checkoutUrl
      }
    },
    [cartItems, variantId]
  )

  const onViewShoppingBag = (e) => {
    e.preventDefault()
    analytics.send('cartInteraction', {
      eventLocation: 'checkout drawer',
      eventAction: 'view shopping bag',
      product: { id: variantId },
    })

    if (isBrowser()) {
      //we don't want to proxy the request or route it internally, we want to let Akamai handle the redirection
      window.location.href = shoppingBagUrl
    }
  }

  const certonaSubTitle = formatMessage({
    id: 'header.minicart.certonaSubTitle',
    defaultMessage: 'Make it yours',
  })

  const certonaTitle = formatMessage({
    id: 'header.minicart.certonaTiTle',
    defaultMessage: 'Perfect accessories for this bag',
  })

  const urgencyMessage = formatMessage({
    id: 'pdp.cart.urgency.message',
    defaultMessage: NO_TRANSLATION,
  })
  const shippingReturns = formatMessage({
    id: 'pdp.cart.shipping.message',
    defaultMessage: NO_TRANSLATION,
  })

  const ToastMessage = () => (
    <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
      <ProductInfoMessage
        sx={styles.retentionInfoMessage}
        variant={isEnchancedATBEnabled || isPostATBMobileExperimentEnabled ? 'none' : 'alert'}
        className="retentionToastMessage"
      >
        {isPostATBMobileExperimentEnabled ? urgencyMessage : retentionToastMessageText}
      </ProductInfoMessage>
    </Experiment>
  )

  return (
    <>
      <Box
        id="drawer-bottom"
        position={'fixed'}
        bottom={0}
        w={'100%'}
        left={0}
        bg={isEnchancedATBEnabled ? 'var(--color-background-cta-hover)' : theme.colors.main.white}
        display={drawerVisible ? 'block' : 'none'}
        zIndex={1600}
        sx={styles.ATCStickyDrawerContainer}
        className="pdp-addtocart-toast toast-show"
      >
        <Box
          p={`var(--spacing-4) var(--spacing-3) ${isPDPTemplateV3 ? 'var(--spacing-2)' : ''}`}
          sx={styles.drawerMessageWrapper}
        >
          <Experiment notForIDs={EXPERIMENTS.PDP_V3}>
            <Flex justify="space-between">
              <Box w="32px" />
              <DrawerMessage
                labels={labels}
                styles={styles}
                isPartialAdded={isPartialAdded}
                drawerError={drawerErrorMsgFlag}
                maxQuantityError={maxQuantityError}
              />
              <CloseLargeIcon
                height="24px"
                width="24px"
                onClick={closeDrawer}
                data-qa={llmCloseDataQA}
              />
            </Flex>
          </Experiment>
          <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
            <Flex justify="flex-end" sx={styles.closeIconWrapper}>
              <CloseLargeIcon
                height="24px"
                width="24px"
                onClick={closeDrawer}
                data-qa={llmCloseDataQA}
              />
            </Flex>
            <DrawerMessage
              labels={labels}
              styles={styles}
              isPartialAdded={isPartialAdded}
              drawerError={drawerErrorMsgFlag}
              maxQuantityError={maxQuantityError}
            />
          </Experiment>
        </Box>
        <Box className="bagDrawerBtnsContainer" sx={styles.bagDrawerBtns}>
          <Flex direction={isEnchancedATBEnabled ? 'column-reverse' : 'column'}>
            {isPostATBMobileExperimentEnabled && urgencyMessage !== NO_TRANSLATION && (
              <ToastMessage />
            )}
            <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
              {isPostATBMobileExperimentEnabled ? (
                shippingReturns !== NO_TRANSLATION && (
                  <Box sx={styles.shippingReturns}>
                    <ShippingIcon width="16" height="16" />
                    <Text>{shippingReturns}</Text>
                  </Box>
                )
              ) : (
                <Box sx={styles.minibagDisclaimerTop}>
                  <HtmlContent content={minibagDisclaimer} />
                </Box>
              )}
            </Experiment>
            {displayRetentionToastOnMobileDrawer && !isPostATBMobileExperimentEnabled && (
              <ToastMessage />
            )}
          </Flex>
          <Flex direction="column">
            <Link
              href={checkoutUrl}
              variant="unstyled"
              onClick={handleCheckout}
              className="checkout-btn-minicart"
              sx={styles.checkoutButtonVariantWrapper}
            >
              <Button
                sx={styles.checkoutButtonStyles}
                {...styles.checkoutButtonVariant}
                className="checkout-btn"
                size="lg"
                w="100%"
                data-qa="mb_btn_checkout"
              >
                {formatMessage({ id: 'header.minicart.checkout' })}
              </Button>
            </Link>
            <Link
              href={shoppingBagUrl}
              variant="unstyled"
              onClick={onViewShoppingBag}
              className="cart-btn-minicart"
              sx={styles.viewBagButtonWrapper}
            >
              <Button
                size="lg"
                w="100%"
                sx={styles.viewBagButtonStyles}
                {...styles.viewBagButtonVariant}
                className="view-shopping-bag-btn"
              >
                {formatMessage({ id: 'header.minicart.viewShoppingBag' })}
                {isPostATBMobileExperimentEnabled ? ` (${totalQuantity})` : null}
              </Button>
            </Link>
          </Flex>
        </Box>
        {displayRetentionToastOnMobileDrawer && (
          <Experiment notForIDs={EXPERIMENTS.PDP_V3}>
            <Flex className="retentionToastMessage" sx={styles.retentionMessageWrapper}>
              <InfoOutlinedIcon width="16" height="16" />
              <p>{retentionToastMessageText}</p>
            </Flex>
          </Experiment>
        )}
        <Experiment notForIDs={EXPERIMENTS.PDP_V3}>
          <Box sx={styles.minibagDisclaimerBottom}>
            <HtmlContent content={minibagDisclaimer} />
          </Box>
        </Experiment>
        {/* TODO: refactor drawerVisible props */}
        {drawerVisible && (
          <>
            <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}>
              <Flex direction="column">
                {isEnchancedATBEnabled && (
                  <Flex direction="column" sx={styles.certonaTitleWrapper}>
                    <Text sx={styles.certonaSubTitle}>{certonaSubTitle}</Text>
                    <Text sx={styles.certonaTitle}>{certonaTitle}</Text>
                  </Flex>
                )}
                <ATBProductRecommendations
                  drawerVisible={drawerVisible}
                  variantId={variantId}
                  vgId={variantId}
                  type="addtocart"
                  closeDrawer={closeDrawer}
                  variant={variant || 'pdpV3ATCRecommendationMobile'}
                />
              </Flex>
            </Experiment>
            <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}>
              <ATBProductRecommendations
                drawerVisible={drawerVisible}
                type="addtocart"
                closeDrawer={closeDrawer}
                variantId={variantId}
                vgId={variantId}
              />
            </Experiment>
          </>
        )}
      </Box>
    </>
  )
}

const DrawerMessage = ({ labels, styles, isPartialAdded, drawerError, maxQuantityError }) => {
  const { label, className } = useMemo(() => {
    if (isPartialAdded || maxQuantityError) {
      return {
        label: `${isPartialAdded ? labels.partialErrorText : ''} ${labels.maxReachedText}`,
        className: 'atb-drawer-message',
      }
    }

    if (drawerError) {
      return {
        label: labels.itemNotAvailable,
        className: 'atb-drawer-message',
      }
    }

    return {
      label: labels.itemAddedToBag,
      className: 'toast-message-pdp atb-drawer-message',
    }
  }, [labels, isPartialAdded, maxQuantityError, drawerError])

  return (
    <Text variant="body-primary" sx={styles.drawerMessage} className={className}>
      {label}
    </Text>
  )
}

AddToCartDrawer.propTypes = {
  maxQuantityError: PropTypes.bool,
  selectedVariantData: PropTypes.object,
  selectedColor: PropTypes.object,
  productData: PropTypes.object,
}
export default withErrorBoundaryWrapper(AddToCartDrawer)
