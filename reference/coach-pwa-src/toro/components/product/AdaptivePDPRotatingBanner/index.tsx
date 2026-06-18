import React, { useContext, useMemo } from 'react'

import HorizontalRotatingBanner from 'toro/components/product/TabbedPDP/RotatingBanner/HorizontalRotatingBanner'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { badgeTypes } from 'toro/components/badges/constants/badgeTypes'
import ShippingAndReturnsWidget from 'toro/components/product/TabbedPDP/ShippingAndReturnsWidget'
import {
  isShowingFastShippingModalAtom,
  isShowingPaymentVarietyModalAtom,
  isShowingShippingAndReturnsModal,
  isTabbedAdaptivePDPEligibleAtom,
} from 'store/pdp.atom'
import { useAtom } from 'jotai'
import usePreference from 'toro/hooks/usePreference_new'
import has from 'lodash/has'
import get from 'lodash/get'
import compact from 'lodash/compact'
import useBadges from 'toro/components/badges/hooks/useBadges'
import Badge, { BadgeVariant } from 'toro/components/badges/Badge'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import PaidyWidget from 'toro/components/Paidy/PaidyWidget'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import PWAContext from 'components/common/PWAContext'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import { useAtomValue } from 'jotai/utils'
import dynamic from 'next/dynamic'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

const SignupOfferCTA = dynamic(() => import('toro/components/product/SignupOfferCTA'), {
  ssr: false,
})

const AdaptivePDPRotatingBanner = ({ productData, variantData, v3RotationBanner = false }) => {
  const {
    allLevelsProductsData,
    klarnaDetails = {},
    selectedVariantData,
    isDiscontinued,
    orderingStatus,
  } = useContext(ProductMainSectionBreakpointContext)
  const { appData } = useContext(PWAContext)
  const enablePricingPromoUpdates = get(appData, 'enablePricingPromoUpdates', false)
  const isTabbedAdaptivePDP = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const shouldShowAffirm = useAffirmEligibility()

  const [isShowShippingAndReturnModal] = useAtom(isShowingShippingAndReturnsModal)
  const [isShowFastShippingModal] = useAtom(isShowingFastShippingModalAtom)
  const [isShowPaymentVarietyModal] = useAtom(isShowingPaymentVarietyModalAtom)

  const {
    paidy: { paidy_enabled: isPaidyEnabled, show_paidy_pdp: showPaidyOnPdp },
    adyen: {
      AdyenAssociatedPaymentsEnabled: isAdyenPaymentsEnabled = false,
      AdyenKlarnaOSMClient: osmClient = {},
    },
    klarnaPayments: { enableKlarna = false },
    afterPay: { enableAfterpay },
    pdpPreferences: { rotatingBannerSequence },
  } = usePreference({
    paidy: ['paidy_enabled', 'show_paidy_pdp'],
    Adyen: ['AdyenAssociatedPaymentsEnabled', 'AdyenKlarnaOSMClient'],
    Klarna_Payments: ['enableKlarna'],
    afterPay: ['enableAfterpay'],
    affirm: ['AffirmOnline', 'AffirmProductMessage'],
    PDPPreferences: ['rotatingBannerSequence'],
  })

  const isKlarnaEnabled = useMemo(() => {
    const locale = getCurrentLocale(get(appData, 'locale', '')).locale.replace('-', '_')
    const isAdyenEnabled = isAdyenPaymentsEnabled && get(osmClient, [locale, 'enable'], false)
    return has(klarnaDetails, 'textMain.value') && (enableKlarna || isAdyenEnabled)
  }, [enableKlarna, klarnaDetails, isAdyenPaymentsEnabled, osmClient])

  const [inventoryBadgeData] = useBadges({
    page: 'pdp',
    area: BadgeArea.INVENTORY_STATUS,
    variant: 'inventoryStatus',
    allowedBadges: [badgeTypes.inventoryCallout],
    ...allLevelsProductsData,
  })

  const promoText = useMemo(() => {
    const newSelectedVariant = get(allLevelsProductsData, 'newSelectedVariant')
    const newSelectedVariationGroup = get(allLevelsProductsData, 'variationGroupData')

    const selectedVariantDataCallOut = get(
      newSelectedVariant || selectedVariantData,
      'promoPDP.promoCallOut',
      []
    )
    const productDataCallOut = get(
      newSelectedVariationGroup || productData,
      'promoPDP.promoCallOut',
      []
    )

    const promoArr = !!newSelectedVariant ? selectedVariantDataCallOut : productDataCallOut

    const finalPromoArr = enablePricingPromoUpdates
      ? [
          ...(v3RotationBanner || (isTabbedAdaptivePDP && !isPdpV41Enabled && !isPdpV42Enabled)
            ? getPromoByType(promoArr, PROMO_TYPES.IPX2)
            : []),
          ...getPromoByType(promoArr, PROMO_TYPES.RB),
        ]
      : promoArr

    return finalPromoArr.filter((promo) => {
      const text = get(promo, '["call-out-message"].content.text')
      const spanText = get(promo, '["call-out-message"].content.spanText')
      const isOTD = get(promo, '["call-out-message"].content.isOTD', false)
      const additionalCondition = enablePricingPromoUpdates ? true : !isOTD
      return additionalCondition && (!!text || !!spanText)
    })
  }, [allLevelsProductsData])

  const rotationMessages = useMemo(() => {
    const messages = []

    const calloutMsgBanners = []
    if (!productData.isBundleProduct && !isDiscontinued && promoText.length > 0) {
      promoText.forEach((promo) => {
        calloutMsgBanners.push(
          <CallOutMessage
            promoText={[promo]}
            masterId={productData.masterId}
            {...(isTabbedAdaptivePDP ? { variant: 'pdpV4Rotation' } : {})}
          />
        )
      })
    }

    const inventoryBanner = inventoryBadgeData && (
      <Badge
        badgeContentSlot={inventoryBadgeData.content}
        key={inventoryBadgeData.badgeID}
        variant={BadgeVariant.InventoryStatus}
        page="pdp"
      />
    )

    // add KlarnaWidget
    const klarnaWidget = isKlarnaEnabled && (
      <KlarnaWidget key="klarnaWidget" skeletonProps={{ h: '40px', w: '100%' }} />
    )

    const isOrderable = get(variantData, 'orderable', true)
    const productSlots = get(productData, 'productSlots')
    const isFinalSale = get(productData, 'custom.c_isFinalSale')
    const freeShipping = get(productSlots, 'contentSlots["free-shipping"]')
    const freeShippingReturn = get(productSlots, 'contentSlots["free-shipping-return"]')

    const isOnline = get(freeShippingReturn, 'online.default', false)

    const finalSaleText =
      isOrderable && isOnline
        ? isFinalSale
          ? get(freeShipping, 'content.text', '').toLowerCase()
          : get(freeShippingReturn, 'content.text', '').toLowerCase()
        : ''

    const shippingBody = isOrderable ? (isFinalSale ? freeShipping : freeShippingReturn) : ''

    const paidyWidget = isPaidyEnabled && showPaidyOnPdp && <PaidyWidget isRotatingBanner />

    // Add Free Shipping & Free Returns message
    const shippingAndReturnsWidget = finalSaleText && (
      <ShippingAndReturnsWidget
        key="shippingReturnsWidget"
        finalSaleText={finalSaleText}
        shippingBody={shippingBody}
      />
    )
    const isPreOrBackOrder =
      orderingStatus === ORDERING_STATUS.preorder || orderingStatus === ORDERING_STATUS.backorder
    const afterpayWidget = enableAfterpay && !isPreOrBackOrder ? <AfterpayWidget /> : null

    const affirmWidget = shouldShowAffirm && <AffirmWidget />
    const signupOfferCtaContent = get(
      productSlots,
      'contentSlots["signupOfferCTA"].content.content'
    )
    const signUpDisclaimerContent = get(
      productSlots,
      'contentSlots["signUpDisclaimer"].content.content'
    )
    const signupOfferCTA = rotatingBannerSequence?.signupOffer && signupOfferCtaContent && (
      <SignupOfferCTA
        content={signupOfferCtaContent}
        v3RotationBanner={v3RotationBanner}
        signUpDisclaimerContent={signUpDisclaimerContent}
      />
    )

    // Sorting order in Rotation Banner for specific PDP version
    if (isPdpV41Enabled) {
      messages.push(
        ...calloutMsgBanners,
        inventoryBanner,
        klarnaWidget,
        paidyWidget,
        afterpayWidget,
        affirmWidget,
        shippingAndReturnsWidget,
        signupOfferCTA
      )
    } else {
      messages.push(
        inventoryBanner,
        ...calloutMsgBanners,
        shippingAndReturnsWidget,
        klarnaWidget,
        paidyWidget,
        afterpayWidget,
        affirmWidget,
        signupOfferCTA
      )
    }

    return compact(messages) // remove all empty messages
  }, [
    inventoryBadgeData,
    productData,
    variantData,
    isKlarnaEnabled,
    promoText,
    isPaidyEnabled,
    showPaidyOnPdp,
    selectedVariantData,
    shouldShowAffirm,
  ])

  return (
    <HorizontalRotatingBanner
      rotationMessages={rotationMessages}
      isPaused={
        isShowShippingAndReturnModal || isShowFastShippingModal || isShowPaymentVarietyModal
      }
    />
  )
}

export default AdaptivePDPRotatingBanner
