import { useEffect, useContext, useMemo } from 'react'
import useToast from 'toro/hooks/useToast'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import { useIntl } from 'react-intl'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import { price as formatPrice } from 'toro/helpers/price-format'
import { STORAGE_COUPON } from 'toro/constants/storageIds'
import useAnalytics from 'toro/analytics/useAnalytics'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { bannerHeightAtom } from 'store/headroom.atom'
import { promoCouponCodeAtom } from 'store/pdp.atom'

enum AVAILABLE_STATUSES {
  noApplicablePromotion = 'no_applicable_promotion',
  applied = 'applied',
  other = 'otherTypes',
}

enum AVAILABLE_DISCOUNT_TYPES {
  amount = 'amount',
  percentage = 'percentage',
}

const getCouponStatus = (couponItems, code) => {
  if (!couponItems) return
  const matchedCoupon = couponItems?.find((coupon) => coupon.code === code)
  const couponStatus = get(matchedCoupon, 'status_code', '')

  if (Object.values(AVAILABLE_STATUSES).includes(couponStatus)) return couponStatus

  return AVAILABLE_STATUSES.other
}

const getOrderLevelCoupon = (basketData, couponCode) => {
  return get(basketData, 'order_price_adjustments', []).find(
    (coupon) => get(coupon, 'coupon_code') === couponCode
  )
}

const getProductLevelCoupon = (basketData, couponCode) => {
  const products = get(basketData, 'product_items', [])
  for (let product of products) {
    const appliedCoupon = get(product, 'price_adjustments', []).find(
      (coupon) => get(coupon, 'coupon_code') === couponCode
    )
    if (!appliedCoupon) continue

    return appliedCoupon
  }
}

const getDiscountCount = (basketData, couponCode) => {
  if (!basketData || !couponCode) return
  const appliedCoupon =
    getOrderLevelCoupon(basketData, couponCode) || getProductLevelCoupon(basketData, couponCode)

  if (!appliedCoupon) return

  return get(appliedCoupon, 'applied_discount', {})
}

const toastMessages = {
  no_applicable_promotion: {
    id: 'header.autoPromoCode.Statuscode.noApplicablePromotion',
    defaultMessage:
      'Congratulations! The promo code will be automatically applied to your cart, when the eligible item is added to the cart',
  },
  applied: {
    id: 'header.autoPromoCode.Statuscode.applied',
    defaultMessage:
      'Congratulations! Your {discountCount} off has been applied to eligible items present in your cart.',
  },
  otherTypes: {
    id: 'header.autoPromoCode.Statuscode.applied.otherTypes',
    defaultMessage: 'Congratulations! Discount has been applied to your cart.',
  },
}
const DESKTOP_TOAST_DEFAULT_TOP_POSITION = 171 // #chakra-toast-manager-top position
const MOBILE_TOAST_DEFAULT_TOP_POSITION = 106

const ApplyCode = ({ couponCode }) => {
  const { actions: sessionActions, session } = useContext(SessionContext)
  const { formatMessage } = useIntl()
  const { isMobile } = useViewportType()
  const headerHeightMobile = useHeaderHeight()
  const headerHeight = document.querySelector('header')?.offsetHeight || 0
  const setPromoCouponCode = useUpdateAtom(promoCouponCodeAtom)

  useEffect(() => {
    if (couponCode) {
      setPromoCouponCode(couponCode)
    }
  }, [couponCode])

  const {
    toggleSiteFeatures: { autoApplyMsg },
    generalConfiguration: { enableNewGlobalHeader },
  } = usePreference({
    ToggleSiteFeatures: ['autoApplyMsg'],
    generalConfiguration: ['enableNewGlobalHeader'],
  })
  const bannerHeight = useAtomValue(bannerHeightAtom)

  const { isHP, isPDP } = usePageType()

  const toastTopPosition = useMemo(() => {
    const topPosition = isMobile
      ? MOBILE_TOAST_DEFAULT_TOP_POSITION
      : DESKTOP_TOAST_DEFAULT_TOP_POSITION

    const headerOffset = isMobile ? headerHeightMobile + (isPDP ? 0 : bannerHeight) : headerHeight

    const shouldApplyNewGlobalHeader = isMobile && !(isHP && !enableNewGlobalHeader)
    const finalTopPosition = shouldApplyNewGlobalHeader ? headerOffset : headerHeight

    return `calc(-${topPosition}px + ${finalTopPosition}px)`
  }, [isMobile, isHP, isPDP, headerHeight, headerHeightMobile, bannerHeight, enableNewGlobalHeader])

  const toastAnimation =
    autoApplyMsg?.animation === 'slide-in' ? 'toastSlideIn 400ms ease-out forwards' : ''

  const toast = useToast({
    variant: 'default',
    containerStyle: {
      position: 'absolute',
      top: toastTopPosition,
      animation: toastAnimation,
      '.toast-body-message': {
        color: autoApplyMsg?.textColor || 'var(--color-success-primary)',
      },
      '& > div': {
        backgroundColor: autoApplyMsg?.bgColor || undefined,
      },
    },
  })

  const analytics = useAnalytics()
  const getCurrencyOptions = useGetCurrencyOptions()
  const basketId = get(session, 'cart.basket_id', '')

  const priceToFormat = (price, currency) => {
    const currencyOptions = getCurrencyOptions(currency)
    return formatPrice(price, currencyOptions as any)
  }

  const applyCode = async () => {
    const result = await sessionActions.applyCartCoupon({ basketId, couponId: couponCode })
    const hasError = get(result, 'hasError', false)

    analytics.send('promoCodeInteraction', {
      eventAction: hasError ? 'invalid' : 'apply',
      eventLocation: 'auto apply sms',
      eventLabel: couponCode,
    })

    if (hasError) {
      localStorage.setItem(STORAGE_COUPON, couponCode)
      analytics.send('siteError', {
        eventAction: 'promo',
        eventLocation: 'auto apply sms',
        eventLabel: `Invalid promo code ${couponCode}`,
      })
      return
    }

    localStorage.removeItem(STORAGE_COUPON)
    let couponStatus = getCouponStatus(get(result, 'coupon_items'), couponCode)

    const isAppliedStatus = couponStatus === 'applied'
    let discountCount

    if (isAppliedStatus) {
      const appliedDiscount = getDiscountCount(result, couponCode)

      if (appliedDiscount.type === AVAILABLE_DISCOUNT_TYPES.amount) {
        const currency = get(result, 'currency')
        discountCount = priceToFormat(appliedDiscount.amount, currency)
      } else if (appliedDiscount.type === AVAILABLE_DISCOUNT_TYPES.percentage) {
        discountCount = `${appliedDiscount.percentage}%`
      } else {
        couponStatus = AVAILABLE_STATUSES.other
      }
    }

    toast({
      description: formatMessage(toastMessages[couponStatus], { discountCount }),
      duration: 5000,
      link: null,
      dataQa: null,
    })
  }

  useEffect(() => {
    applyCode()
  }, [])

  return null
}

export default ApplyCode
