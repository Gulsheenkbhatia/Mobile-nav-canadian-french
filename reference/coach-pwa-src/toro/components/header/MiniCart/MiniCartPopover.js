import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Box from 'toro/components/Box'
import useTheme from 'toro/hooks/useTheme'
import CloseButton from 'toro/components/CloseButton'
import Flex from 'toro/components/Flex'
import Divider from 'toro/components/Divider'
import Text from 'toro/components/Text'
import MiniCartPopoverItem from 'toro/components/header/MiniCart/MiniCartPopoverItem'
import Button from 'toro/components/Button'
import { CHECKOUT_URL, SHOPPING_BAG_URL } from 'toro/constants/Urls'
import Link from 'toro/components/Link'
import useViewportType from 'toro/hooks/useViewportType'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import size from 'lodash/size'
import reverse from 'lodash/reverse'
import orderBy from 'lodash/orderBy'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import PayPalButton from 'toro/components/Paypal'
import { miniCartDefaultDuration } from 'toro/constants/appConstants'
import isBrowser from 'toro/helpers/isBrowser'
import SessionContext from 'toro/components/SessionContext'
import { fetchFullData } from 'helpers/getFullData'
import useShoppingGivesTrackingInstance from 'toro/hooks/useShoppingGivesTrackingInstance'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import isArray from 'lodash/isArray'
import { price as formatPrice } from 'toro/helpers/price-format'
import HtmlContent from 'toro/components/HtmlContent'
import { renderWithSpecialCharacters } from 'toro/helpers/strings'
import PromoProgressBar from 'toro/components/header/MiniCart/PromoProgressBar'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import { PaypalIcon } from 'toro/icons'
import MinicartRecommendations from 'toro/components/MinicartRecommendations'
import { useRouter } from 'next/router'
import { useAtomValue, useResetAtom } from 'jotai/utils'
import { lastAddedProductToBagVariantIdAtom, addToBagButtonRefAtom } from 'store/pdp.atom'
import AmazonPayButton from 'toro/components/list/AmazonPay'
import getAPIURL from 'helpers/getAPIURL'
import isEmpty from 'toro/helpers/emptyObjectCheck'
import { miniCartOpenReasonAtom, MiniCartOpenReasons } from 'store/global.atom'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import {
  appendQuantityToProducts,
  applyBodyStyles,
  hasPromotion,
  revertBodyStyles,
} from 'toro/components/header/MiniCart/helpers'
import useCurrencyOptions from 'toro/hooks/useCurrencyOptions'
import PayPalModal from 'toro/components/header/MiniCart/PayPalModal'
import { cartProductIdsAtom } from 'store/miniCartPopover.atom'
import { useAtom } from 'jotai'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import { aeDrawerConfigAtom } from 'store/ae-drawer.atom'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import fetch from 'helpers/fetch'
import { responseLogger } from 'helpers/logger'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const DESKTOP_WIDTH = 465
const DESKTOP_HEIGHT = `calc(53vh - 200px)`
const MOBILE_WIDTH = 327
const MOBILE_HEIGHT = `calc(50vh - 100px)`

function MiniCartPopover({
  triggerRef,
  timeoutRef,
  isHoveredOnMiniCart = undefined,
  miniCartPopUpPosition = undefined,
  renderOnlyContent = false,
}) {
  const theme = useTheme()
  const analytics = useAnalytics()
  const { isDesktop } = useViewportType()
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [modalVisibility, setModalVisibility] = useState(false)
  const { appData } = useContext(PWAContext)
  const miniCartOpenReason = useAtomValue(miniCartOpenReasonAtom)
  const cartProductIds = useAtomValue(cartProductIdsAtom)
  const hideMiniCart = useResetAtom(miniCartOpenReasonAtom)
  const {
    session: { cart },
  } = useContext(SessionContext)
  const siteId = useMemo(() => get(appData, 'siteId'), [appData])
  const brand = useMemo(() => get(appData, 'brand'), [appData])
  const isPayPalCountryNeeded = ['kate-spade'].includes(brand)
  const isPaypalDisabledOnMiniCart = get(appData, 'paypalDisabledOnMinicart', false)
  const { bannerHeight } = useHeadroomAtom()
  const router = useRouter()
  const [shoppingBagUrl, checkoutUrl] = useLocaleUrl([SHOPPING_BAG_URL, CHECKOUT_URL])
  const { defaultLocale, locale } = appData
  const { isStaticHeader } = useHeaderPositionPref()
  const currencyOptions = useCurrencyOptions(get(cart, 'currency', 'USD'))
  const [amazonCredentials, setAmazonCredentials] = useState({})
  const [productsInCart, setProductsInCart] = useState([])
  const minibagDisclaimer = get(appData, 'minibagDisclaimer')
  const isExistDisclaimer = Boolean(minibagDisclaimer)
  const [isPopupRendered, setIsPopupRendered] = useState(false)
  const scrolledWrapperRef = useRef(null)
  const paypalCtaRef = useRef()
  const [payCountry, setPayCountry] = useState('')
  const popoverRef = useRef()
  const productsInCartRef = useRef(null)
  const lastAddedProductToBagVariantId = useAtomValue(lastAddedProductToBagVariantIdAtom)
  const [atbButtonRef, setAtbButtonRef] = useAtom(addToBagButtonRefAtom)
  const minicartCloseBtnRef = useRef(null)

  const {
    cartCheckoutSettings: { miniBagTimmer: popoverDuration = 3000 },
    paypalExpressCheckout: {
      PP_ShowExpressCheckoutButtonOnCart: isPaypalExpressCheckoutEnabled = false,
    },
    recommendations: { hideRecommendations = false, isCertonaEnableOnATCDesktop = false },
    amazonPayV2: { enableAmazonPayMinicart = false, amazonPayScript },
    toggleSiteFeatures: { enableExpandedMinProductApi },
    approachingDiscountConfigs: { enableApproachingDiscountOnMiniCart = false },
  } = usePreference({
    CartCheckoutSettings: ['miniBagTimmer'],
    paypalExpressCheckout: ['PP_ShowExpressCheckoutButtonOnCart'],
    recommendations: ['hideRecommendations', 'isCertonaEnableOnATCDesktop'],
    AmazonPay_v2: ['enableAmazonPayMinicart', 'amazonPayScript'],
    ToggleSiteFeatures: ['enableExpandedMinProductApi'],
    'Approaching Discount Configs': ['enableApproachingDiscountOnMiniCart'],
  })
  const styles = useMultiStyleConfig('MiniCart')
  const { formatMessage } = useIntl()
  const { createTrackingInstance } = useShoppingGivesTrackingInstance()

  const isPaypalVisibleOnMiniCart = isPaypalExpressCheckoutEnabled && !isPaypalDisabledOnMiniCart
  const isAmazonCountryNeeded =
    enableAmazonPayMinicart && amazonPayScript && !isPaypalVisibleOnMiniCart

  const cartProducts = get(cart, 'product_items', [])

  const showRecommendations = useMemo(
    () => !hideRecommendations && isCertonaEnableOnATCDesktop && miniCartOpenReason,
    [hideRecommendations, isCertonaEnableOnATCDesktop, miniCartOpenReason]
  )
  const customizedProducts = useMemo(() => {
    let reversedCustomizedProducts = reverse(cartProducts)
    const hasBundledItems = !!reversedCustomizedProducts.find(
      (item) => item.c_isBundleProductLineItem
    )
    if (hasBundledItems) {
      const bundleVariant = reversedCustomizedProducts.filter(
        (item) => item.c_headlessLastUpdated && item.c_isBundleProductLineItem
      )
      const sortByUpdateBundle = orderBy(bundleVariant, ['c_headlessLastUpdated'], ['desc'])

      const isCartIncludesBundleVariant = sortByUpdateBundle.length !== 0

      if (isCartIncludesBundleVariant) {
        reversedCustomizedProducts = sortByUpdateBundle.concat(
          reversedCustomizedProducts.filter(
            (item) => !(item.c_headlessLastUpdated && item.c_isBundleProductLineItem)
          )
        )
      }

      reversedCustomizedProducts = appendQuantityToProducts(reversedCustomizedProducts)
    }
    return reversedCustomizedProducts?.reduce((finalProductItems, product) => {
      const customizerProductId = get(product, 'c_customizerId', '')
      const hasEmbellishments = get(product, 'c_hasEmbellishments', false)
      const isEmbellishment = get(product, 'c_customizerParentId', false)

      if (hasEmbellishments) {
        return [
          ...finalProductItems,
          {
            ...product,
            embellishments: reversedCustomizedProducts?.filter(
              (prod) => get(prod, 'c_customizerParentId') === customizerProductId
            ),
          },
        ]
      }

      if (isEmbellishment) {
        return finalProductItems
      }

      return [...finalProductItems, product]
    }, [])
  }, [cartProductIds])

  const totalQuantity = useMemo(
    () => customizedProducts.reduce((accumulator, product) => accumulator + product.quantity, 0),
    [customizedProducts]
  )
  const totalPriceFromProductsInCart = useMemo(
    () =>
      productsInCart.reduce(
        (accumulator, product) =>
          accumulator +
          get(product, 'masterProductData.prices.currentPrice', 0) *
            get(product, 'basketInfo.quantity', 1),
        0
      ),
    [productsInCart]
  )

  const isBasketExist = get(cart, 'basket_id', '')

  const totalPrice = get(cart, 'product_total', 0)

  const orderPriceAdjustments = get(cart, 'order_price_adjustments') || []
  const orderLevelPromos =
    (isArray(orderPriceAdjustments) &&
      orderPriceAdjustments.filter((discount) => !!get(discount, 'promotion_id'))) ||
    []

  const fetchAmazonCredentials = async () => {
    const url = getAPIURL('/get-amazon-credentials')
    try {
      const res = await fetch(url)
      responseLogger(res)
      try {
        const data = await res.json()
        const { amazonPayButtonConfig } = data
        setAmazonCredentials(amazonPayButtonConfig)
      } catch (error) {
        console.error('Failed to parse JSON:', error)
        setAmazonCredentials({})
        return
      }
    } catch (error) {
      console.error('Error fetching Amazon credentials:', error)
      setAmazonCredentials({})
    }
  }

  useEffect(() => {
    const fetchProductsData = async () => {
      if (size(customizedProducts)) {
        setLoadingProducts(true)

        const completeProducts = await fetchFullData(customizedProducts, {
          includeInventory: true,
          withMaster: false,
          locale: locale || defaultLocale,
          minProductsApiEnabled: enableExpandedMinProductApi,
        })

        setLoadingProducts(false)
        setProductsInCart(completeProducts)
        productsInCartRef.current = completeProducts
      }
    }
    fetchProductsData()
  }, [customizedProducts])

  useEffect(() => {
    if (isAmazonCountryNeeded && isBasketExist) fetchAmazonCredentials()
  }, [isAmazonCountryNeeded, isBasketExist])

  /**
   * This is data object that assigned for item that is gift, but promo code
   * text still need to be applied for others items
   */

  const promoRenderInfo = useMemo(() => {
    let priceAdjustments = []
    productsInCart.forEach((item) => {
      if (
        get(item, 'basketInfo.bonus_product_line_item') &&
        get(item, 'basketInfo.price_adjustments')
      ) {
        priceAdjustments = get(item, 'basketInfo.price_adjustments')
      }
    })
    return priceAdjustments
  }, [productsInCart])

  const clearTimer = useCallback(() => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const startTimer = useCallback(
    (cb) => {
      const duration = popoverDuration || miniCartDefaultDuration
      clearTimer()
      timeoutRef.current = setTimeout(cb, duration)
    },
    [popoverDuration]
  )

  const getFormattedPrice = useCallback(
    (price) => {
      return formatPrice(price, currencyOptions)
    },
    [currencyOptions]
  )

  const scrollProductsItemsToTop = () => {
    if (scrolledWrapperRef && scrolledWrapperRef.current) {
      const giftWrapPurchaseItems = customizedProducts.filter(
        (item) => item?.bonus_product_line_item
      )?.length
      if (giftWrapPurchaseItems == 1 && showRecommendations) {
        const giftWrapProductItemHeight =
          document.getElementsByClassName('minicart-item')[0]?.offsetHeight
        scrolledWrapperRef.current.scrollTo({
          left: 0,
          top: giftWrapProductItemHeight,
          behavior: 'smooth',
        })
      } else {
        scrolledWrapperRef.current.scrollTop = 0
      }
    }
  }

  useEffect(() => {
    !showRecommendations &&
      !loadingProducts &&
      miniCartOpenReason === MiniCartOpenReasons.AddToBag &&
      scrollProductsItemsToTop()
  }, [miniCartOpenReason, productsInCart])

  useOutsideClick({
    ref: popoverRef,
    handler: handleOutsideClick,
  })

  const handleCloseAndFocus = () => {
    hideMiniCart()
    atbButtonRef?.focus()
    setAtbButtonRef(null)
  }

  const handleLastButtonKeyDown = getKeyboardHandler(['Tab'], (e) => {
    if (!e.shiftKey) {
      e.preventDefault()
      minicartCloseBtnRef?.current?.focus()
    }
  })

  const handleEscClick = getKeyboardHandler(['Escape'], () => {
    handleCloseAndFocus()
  })

  useEffect(() => {
    if (!miniCartOpenReason) return
    minicartCloseBtnRef.current?.focus()
  }, [miniCartOpenReason, isPopupRendered])

  useEffect(() => {
    const handler = () => {
      hideMiniCart()
    }
    router.events.on('routeChangeStart', handler)
    return () => {
      router.events.off('routeChangeStart', handler)
    }
  }, [])

  useEffect(() => {
    if (miniCartOpenReason && !isHoveredOnMiniCart) {
      applyBodyStyles()
      if (!showRecommendations) {
        startTimer(hideMiniCart)
      }
    } else {
      clearTimer()
      revertBodyStyles()
    }

    return () => {
      clearTimer()
      revertBodyStyles()
    }
  }, [miniCartOpenReason, isHoveredOnMiniCart])

  useEffect(() => {
    const productCount = productsInCart.reduce((sum, item) => sum + item.quantity, 0)
    const itemCount = customizedProducts.reduce((sum, item) => sum + item.quantity, 0)
    let eventLocation = ''

    if (!loadingProducts && productCount > 0 && productCount === itemCount) {
      if (!isHoveredOnMiniCart) {
        if (
          miniCartOpenReason === MiniCartOpenReasons.AddToBag ||
          miniCartOpenReason === MiniCartOpenReasons.PickUpInStore
        ) {
          eventLocation = 'auto'
        }
      } else {
        eventLocation = 'utility nav'
      }
    }

    if (eventLocation) {
      analytics.send('viewMiniCart', {
        products: productsInCart,
        eventLocation,
        router,
      })
    }
  }, [productsInCart, customizedProducts, isHoveredOnMiniCart])

  useEffect(() => {
    if (miniCartOpenReason && !isPopupRendered) {
      setIsPopupRendered(true)
    }
  }, [miniCartOpenReason])

  function handleCloseClick() {
    miniCartOpenReason && hideMiniCart()
  }

  const onCheckout = async (e) => {
    e.preventDefault()
    analytics.send('beginCheckout', {
      products: productsInCart,
      eventLocation: 'minicart',
      checkoutOption: 'regular',
    })
    analytics.send('cartInteraction', { eventLocation: 'minicart', eventAction: 'checkout' })

    try {
      await createTrackingInstance()
    } catch (e) {
      console.log(`error ${e}`)
    }

    if (isBrowser()) {
      //we don't want to proxy the request or route it internally, we want to let Akamai handle the redirection
      window.location.href = checkoutUrl
    }
  }

  const onViewShoppingBag = async (e) => {
    e.preventDefault()
    analytics.send('cartInteraction', { eventLocation: 'minicart', eventAction: 'view bag' })

    try {
      await createTrackingInstance()
    } catch (e) {
      console.log(`error ${e}`)
    }

    if (isBrowser()) {
      //we don't want to proxy the request or route it internally, we want to let Akamai handle the redirection
      window.location.href = shoppingBagUrl
    }
  }

  const onPayPal = useCallback(() => {
    !isPayPalCountryNeeded &&
      analytics.send('cartInteraction', {
        eventLocation: 'minicart',
        eventAction: 'paypal checkout',
      })

    analytics.send('beginCheckout', {
      products: productsInCartRef?.current,
      eventLocation: 'minicart',
      checkoutOption: 'paypal',
      isExpressPay: true,
    })

    isPayPalCountryNeeded &&
      payCountry &&
      analytics.send('cartInteraction', {
        eventLocation: 'mini cart',
        eventAction: 'paypal express interstitial - country selected',
        eventLabel: payCountry?.toUpperCase(),
      })
  }, [productsInCart, payCountry, isPayPalCountryNeeded])

  const onClose = () => {
    setModalVisibility(false)
    analytics.send('cartInteraction', {
      eventLocation: 'mini cart',
      eventAction: 'paypal express interstitial - modal close',
    })
  }

  const onDummyPayPal = () => {
    analytics.send('cartInteraction', {
      eventLocation: 'minicart',
      eventAction: 'paypal checkout',
    })
    setPayCountry('')
    setModalVisibility(true)
  }

  const handleChange = (e) => {
    const { value } = e.target
    value && setPayCountry(value)
  }

  const { showDrawer } = useAtomValue(aeDrawerConfigAtom)
  const { isVisuallySimilarPlpWithExpEnabled, isVisuallySimilarPDPEnabled } = useLLMRecommendations(
    { clearDataOnUnmount: false }
  )

  function handleOutsideClick(e) {
    if (!isDesktop && e.target === triggerRef.current) {
      // don't emit close when clicking the shopping icon in the header, parent component will take
      // care of closing this
      return
    }

    if (isDesktop && showDrawer) {
      return
    }

    handleCloseClick()
  }

  function handleMouseEnter() {
    clearTimer()
  }

  const handleMouseLeave = () => !showRecommendations && hideMiniCart()

  const headerMinicartText = renderWithSpecialCharacters(
    formatMessage({ id: 'header.minicart.text' })
  )

  if (!isPopupRendered) {
    return null
  }

  const renderProduct = (item, index, allItems) => (
    <Fragment key={get(item, 'basketInfo.item_id', item?.id)}>
      <MiniCartPopoverItem
        item={item}
        sx={styles.miniCartProductDetailContainer}
        orderLevelPromos={orderLevelPromos}
        hasPromotion={hasPromotion(item, cart)}
        promoRenderInfo={promoRenderInfo}
        brand={brand}
        getFormattedPrice={getFormattedPrice}
      />
      {index < allItems?.length - 1 && (
        <Divider
          borderColor={theme.colors.main.gray}
          variant="dashed"
          sx={styles.cartSecondaryDivider}
        />
      )}
    </Fragment>
  )

  const content = (
    <>
      <Flex
        alignItems="center"
        minHeight="30px"
        sx={styles.myBagInfo(isDesktop)}
        data-qa="mb_baginfo"
      >
        <Text
          variant="primary"
          size="sm"
          sx={styles.myBagHeader}
          className="minicart-total-quantity"
        >
          {renderWithSpecialCharacters(
            formatMessage({ id: 'header.minicart.myBag' }, { totalQty: totalQuantity })
          )}
        </Text>
        <Divider orientation="vertical" sx={styles.miniCartPriceDivider} />
        <Text variant="primary" size="sm" sx={styles.myBagHeader} className="minicart-total-price">
          {totalPrice
            ? getFormattedPrice(totalPrice)
            : getFormattedPrice(totalPriceFromProductsInCart)}
        </Text>
        <CloseButton
          size="md"
          onClick={handleCloseClick}
          data-qa={
            (isVisuallySimilarPlpWithExpEnabled || isVisuallySimilarPDPEnabled) && showDrawer
              ? 'visually_similar_add_to_bag_close'
              : 'mb_icon_x'
          }
          sx={styles.miniCartCloseButton}
          ref={minicartCloseBtnRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleCloseAndFocus()
            }
          }}
          variant="icon-only-w-focus"
          aria-label="Close mini cart"
        />
      </Flex>
      {headerMinicartText !== 'header.minicart.text' && (
        <Text variant="body-primary" size="md" sx={styles.miniCartSecondaryText}>
          {headerMinicartText}
        </Text>
      )}
      <Box
        ref={scrolledWrapperRef}
        maxHeight={isDesktop ? DESKTOP_HEIGHT : MOBILE_HEIGHT}
        sx={styles.miniCartProductsContainer}
        overflowY={!isDesktop ? 'auto' : null}
        className={isDesktop ? 'custom-scrollbar' : ''}
      >
        {enableApproachingDiscountOnMiniCart && (
          <PromoProgressBar productsInCart={productsInCart} />
        )}
        {showRecommendations && productsInCart.length ? (
          <>
            {renderProduct(productsInCart[0], 0)}
            <MinicartRecommendations
              variantId={lastAddedProductToBagVariantId}
              siteId={siteId}
              onItemClick={hideMiniCart}
              scrollProductsItemsToTop={scrollProductsItemsToTop}
              loadingProducts={loadingProducts}
            />
            {productsInCart.slice(1).map(renderProduct)}
          </>
        ) : (
          productsInCart.map(renderProduct)
        )}
      </Box>
      <Box
        bottom="0"
        left="0"
        right="0"
        sx={styles.cartButtonsMainWrapper}
        paddingTop={isExistDisclaimer ? '0px' : 'l'}
      >
        <Box sx={styles.disclaimer}>
          <HtmlContent content={minibagDisclaimer} />
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          sx={{ gap: theme.space.mar, ...styles.cartButtonsWrapper }}
        >
          {isPaypalVisibleOnMiniCart && (
            <>
              {!isPayPalCountryNeeded && (
                <PayPalButton ref={paypalCtaRef} onClick={onPayPal} data-qa="mb_cntnr_paypal" />
              )}
              <Button
                variant="brand"
                size="lg"
                w="45%"
                position={!isPayPalCountryNeeded ? 'absolute' : 'static'}
                zIndex={0}
                onClick={!isPayPalCountryNeeded ? onPayPal : onDummyPayPal}
                data-qa="mb_btn_paypal"
              >
                <PaypalIcon height={20} width={75} />
              </Button>
            </>
          )}
          {modalVisibility && (
            <PayPalModal
              onClose={onClose}
              styles={styles}
              onPayPal={onPayPal}
              handleChange={handleChange}
              payCountry={payCountry}
            />
          )}
          {isAmazonCountryNeeded && !isEmpty(amazonCredentials) && (
            <AmazonPayButton amazonCredentials={amazonCredentials} data-qa="mb_cntnr_amazon" />
          )}
          <Link
            href={checkoutUrl}
            variant="unstyled"
            w={isPaypalVisibleOnMiniCart || isAmazonCountryNeeded ? '45%' : '100%'}
            onClick={onCheckout}
          >
            <Button
              size="lg"
              w="100%"
              data-qa="mb_btn_checkout"
              sx={styles.cartCheckoutButton}
              className="minicart-checkout-btn"
              {...styles.checkoutButtonVariant}
            >
              {renderWithSpecialCharacters(formatMessage({ id: 'header.minicart.checkout' }))}
            </Button>
          </Link>
        </Flex>
        <Box sx={styles.viewShoppingBagButtonWrapper}>
          <Link
            href={shoppingBagUrl}
            variant="unstyled"
            w="100%"
            onClick={onViewShoppingBag}
            onKeyDown={handleLastButtonKeyDown}
          >
            <Button
              size="lg"
              w="100%"
              data-qa="mb_btn_vsb"
              sx={styles.viewShoppingBagButton}
              className="minicart-cart-btn"
              {...styles.viewBagButtonVariant}
            >
              {renderWithSpecialCharacters(
                formatMessage({ id: 'header.minicart.viewShoppingBag' })
              )}
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  )

  if (renderOnlyContent) {
    return content
  }

  return (
    <>
      <Box
        position="fixed"
        top={`-${bannerHeight}px`}
        left="0"
        width="100vw"
        height="200vh"
        zIndex="100"
        pointerEvents="none"
        sx={miniCartOpenReason ? styles.miniCartOverlay : styles.miniCartOverlayClosed}
      />
      <Box
        display={miniCartOpenReason ? 'block' : 'none'}
        ref={popoverRef}
        id="minicart-popover"
        position={isStaticHeader ? 'fixed' : 'absolute'}
        zIndex={theme.zIndex.popover}
        width={isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH}
        maxWidth={isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH}
        sx={{ ...styles.miniCartMainContainer, ...miniCartPopUpPosition }}
        onMouseEnter={isDesktop ? handleMouseEnter : null}
        onMouseLeave={isDesktop ? handleMouseLeave : null}
        data-qa="mb_cntnr"
        onKeyDown={handleEscClick}
      >
        <Box
          position="absolute"
          top="-10px"
          right={`${isDesktop ? 24 : 12}px`}
          width="0"
          height="0"
          sx={styles.miniCartContainer}
        />
        {content}
      </Box>
    </>
  )
}

export default withErrorBoundaryWrapper(MiniCartPopover)
