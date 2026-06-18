import React, { useMemo, memo } from 'react'
import Box from 'toro/components/Box'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useViewportType from 'toro/hooks/useViewportType'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import useTheme from 'toro/hooks/useTheme'
import { findVariantById, VARIATION_LABELS } from 'toro/helpers/productVariations'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import Badges from 'toro/components/badges/Badges'
import { useRouter } from 'next/router'
import useAnalytics from 'toro/analytics/useAnalytics'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'

import isCA from 'toro/helpers/isCA'
import useIsSubBrandSwitch from 'toro/hooks/useIsSubBrandSwitch'
import { LocationIcon } from 'toro/icons'
import { useAtomValue, useResetAtom } from 'jotai/utils'
import { wishlistIdsAtom } from 'store/wishlist.atom'
import { getImageProperties } from 'toro/helpers/imagesHelper'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import { miniCartOpenReasonAtom } from 'store/global.atom'
import {
  getNonAppliedPromoArr,
  renderNotAppliedPromo,
  renderOrderLevelPromotions,
  renderPromotion,
} from 'toro/components/header/MiniCart/minicart-promo-helpers'
import { getRegularPriceToRender } from 'toro/components/header/MiniCart/helpers'
import { ProductVertical } from 'toro/constants/OneSite'

const handleUnclickable = (ev) => {
  ev.preventDefault()
  ev.stopPropagation()
}

function getVariationTextQALabel(label) {
  const lowerCaseLabel = label?.toLowerCase()
  if (lowerCaseLabel === 'color') return 'mb_label_pdtColor'
  if (lowerCaseLabel === 'size') return 'mb_label_pdtSize'
  if (lowerCaseLabel === 'width') return 'mb_label_pdtWidth'
  return null
}

function getVariationTextQAValue(label) {
  const lowerCaseLabel = label?.toLowerCase()
  if (lowerCaseLabel === 'color') return 'mb_value_pdtColor'
  if (lowerCaseLabel === 'size') return 'mb_value_pdtSize'
  if (lowerCaseLabel === 'width') return 'mb_value_pdtWidth'
  return null
}

const qaTags = {
  name: 'mb_txt_pdtname',
  price: 'mb_txt_pdtprice',
  stPrice: 'mb_pdt_strthr_price',
  image: 'mb_img_pdt',
}

const getMonogramAttributeData = (item, attribute) => {
  try {
    const customizeMonogramSummary = JSON.parse(
      get(item, 'basketInfo.c_customizerMonogramSummary')
    )?.[0]

    return customizeMonogramSummary?.[attribute]
  } catch (e) {
    return null
  }
}

function MiniCartPopoverItem({
  item,
  orderLevelPromos,
  promoRenderInfo,
  shouldPickPriceFromMaster,
  brand,
  hasPromotion,
  getFormattedPrice,
  ...props
}) {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const hideMiniCart = useResetAtom(miniCartOpenReasonAtom)
  const isCanada = isCA()
  const wishlistIds = useAtomValue(wishlistIdsAtom)

  const {
    toggleSiteFeatures: { isNewMegaPDP = false },
    priceSitePreferences: { hideListPrice = false },
    generalConfiguration: { siteIdentifier },
    oneSite: { enableOneSite = false },
  } = usePreference({
    ToggleSiteFeatures: ['isNewMegaPDP'],
    priceSitePreferences: ['hideListPrice'],
    generalConfiguration: ['siteIdentifier'],
    OneSite: ['enableOneSite'],
  })

  const variants = useMemo(() => get(item, 'variants') || get(item, 'variant') || [], [item])
  const matchedVariant = useMemo(
    () =>
      findVariantById(variants, item?.id) || variants.find((variant) => variant?.id === item?.id),
    [variants, item?.id]
  )

  const hideComparablePriceValue =
    hideListPrice && get(matchedVariant, 'customAttributes.c_hideComparablePriceValue', false)

  const { viewport } = useViewportType()
  const router = useRouter()
  const analytics = useAnalytics()
  const neutralSizingData = useNeutralSizingData()
  const propValues = useMemo(
    () =>
      get(item, 'minData.minicartPropValues') ||
      getImageProperties(item, isNewMegaPDP, neutralSizingData),
    [item]
  )
  const thumbnail = get(propValues, 'color.media.thumbnail', get(item, 'media.thumbnail'))
  const imageSrc = getProductImageSrc(thumbnail?.src, viewport, 'plp')
  const isBundleProduct = get(item, 'basketInfo.c_isBundleProductLineItem', false)
  const miniCartPromoText = useMemo(
    () => (isBundleProduct ? {} : { [item.id]: get(item, 'miniCartPromoText', []) }),
    [isBundleProduct, item]
  )
  const productPromotions = isBundleProduct
    ? []
    : get(
        item,
        'pickedProps.promotionData.promoCallOutMiniCart',
        get(item, 'miniCartPromoText', [])
      )

  // This need for Canada env only, when promos, that need to render, were apply - they will filled into orderLevelPromotion arr
  const productOrderLevelPromotions = get(
    item,
    'pickedProps.promotionData.orderLevelPromoCallout',
    []
  )
  const imageAlt = get(thumbnail, 'alt')
  const basketInfo = get(item, 'basketInfo', {})
  const quantity = get(basketInfo, 'quantity', 1)
  const discountedPriceFromMaster = get(item, 'masterProductData.prices.currentPrice', 0) * quantity
  const discountedPriceFromBasket = get(basketInfo, 'price_after_order_discount')
  const regularPriceFromBasket = get(basketInfo, 'price')
  const discountedPrice = shouldPickPriceFromMaster
    ? discountedPriceFromMaster
    : discountedPriceFromBasket

  const name = get(item, 'name', '')
  const variant = enableOneSite ? 'oneSiteMiniCart' : null
  const styles = useMultiStyleConfig('MiniCart', { variant })

  const isOutlet =
    brand?.toLowerCase() === 'coach-outlet' ||
    siteIdentifier === 'ksna-surprise' ||
    get(item, 'custom.c_isOutlet')

  const productVertical = get(item, 'custom.c_productVertical')

  const regularPrice = useMemo(() => {
    if (hideComparablePriceValue) {
      return undefined
    }
    const listPrice = get(item, 'defaultVariant.pricingInfo.0.list.value')
    if (!shouldPickPriceFromMaster && regularPriceFromBasket && !listPrice) {
      return regularPriceFromBasket
    }

    return listPrice !== undefined ? listPrice * quantity : undefined
  }, [item, regularPriceFromBasket, hideComparablePriceValue])

  const productLevelPromos = useMemo(
    () =>
      get(item, 'basketInfo.price_adjustments', []).filter(
        (discount) => !!get(discount, 'promotion_id')
      ),
    [item]
  )

  const hasPromotionApplied = useMemo(() => {
    const hasProductLevelPromo = productLevelPromos.length > 0
    const hasOrderLevelPromo = hasPromotion || productOrderLevelPromotions.length > 0
    return hasProductLevelPromo || hasOrderLevelPromo
  }, [productLevelPromos, hasPromotion, productOrderLevelPromotions])

  const regularPriceToRender = useMemo(() => {
    if (enableOneSite) {
      if (productVertical === ProductVertical.Collection) {
        return regularPrice && discountedPrice !== regularPrice ? regularPrice : undefined
      }

      if (productVertical === ProductVertical.Outlet) {
        const outletSellingPrice = regularPriceFromBasket || regularPrice
        return hasPromotionApplied && outletSellingPrice && outletSellingPrice !== discountedPrice
          ? outletSellingPrice
          : undefined
      }
    }

    return getRegularPriceToRender({
      regularPrice,
      discountedPrice,
      regularPriceFromBasket,
      discountedPriceFromBasket,
      isOutlet,
    })
  }, [
    enableOneSite,
    productVertical,
    regularPrice,
    discountedPrice,
    regularPriceFromBasket,
    discountedPriceFromBasket,
    isOutlet,
    hasPromotionApplied,
  ])

  const isGift = get(basketInfo, 'bonus_product_line_item', false)
  const storeName = get(item, 'basketInfo.storeName')

  const variationText = (styles, label, value, key) => (
    <Text
      key={key}
      variant="eyebrow-primary"
      size="md"
      color={theme.colors.main.gray}
      textTransform="uppercase"
      letterSpacing={theme.letterSpacings.lg}
    >
      <Text
        as="span"
        variant="eyebrow-primary"
        size="md"
        color={theme.colors.main.gray}
        textTransform="uppercase"
        letterSpacing={theme.letterSpacings.lg}
        sx={styles.miniCartProductdetail}
        data-qa={getVariationTextQALabel(key)}
      >
        {label}
      </Text>
      :&nbsp;
      <Text
        as="span"
        variant="eyebrow-primary"
        size="md"
        color={theme.colors.main.gray}
        textTransform="uppercase"
        letterSpacing={theme.letterSpacings.lg}
        sx={styles.miniCartProductdetail}
        data-qa={getVariationTextQAValue(key)}
      >
        {value}
      </Text>
    </Text>
  )

  const priceColor = useMemo(() => {
    if (
      regularPrice === undefined ||
      discountedPrice === undefined ||
      regularPrice === discountedPrice
    ) {
      return theme.colors.cart.default
    }
    if (regularPrice !== discountedPrice) {
      return theme.colors.cart.sale
    }
  }, [regularPrice, discountedPrice, theme])

  const productUrl =
    matchedVariant?.url || get(item, 'variant.0.url') || get(item, 'variants.0.url')
  const isSubBrandSwitch = useIsSubBrandSwitch(productUrl)

  function navigateToProduct() {
    analytics.send('selectItem', {
      product: item,
      eventLocation: 'minicart',
      wishlist: wishlistIds,
    })
    analytics.send('cartInteraction', {
      product: item,
      eventLocation: 'minicart',
      eventAction: 'view product',
    })

    if (productUrl) {
      if (isSubBrandSwitch) {
        window.location.href = productUrl
      } else {
        router.push(productUrl)
      }
      hideMiniCart()
    }
  }
  let isDigitalPrintingProduct = false
  const hasEmbellishments = get(item, 'basketInfo.c_hasEmbellishments', false)
  let embellishments = get(item, 'basketInfo.embellishments', [])

  if (!embellishments.length) {
    embellishments = get(item, 'basketInfo.option_items', [])

    if (embellishments.length > 0) {
      isDigitalPrintingProduct = true
    }
  }

  const customizerProductPrice = useMemo(
    () =>
      regularPrice
        ? regularPrice +
          embellishments.reduce((totalEmbellishmentsPrice, embellishment) => {
            const finalPrice = get(embellishment, 'base_price', 0)
            return totalEmbellishmentsPrice + finalPrice
          }, 0)
        : undefined,
    [embellishments]
  )

  const customizerProductPriceDiscout = useMemo(
    () =>
      discountedPrice +
      embellishments.reduce((totalEmbellishmentsPrice, embellishment) => {
        const finalPrice = get(embellishment, 'price_after_order_discount', 0)
        return totalEmbellishmentsPrice + finalPrice
      }, 0),
    [embellishments]
  )

  const customizeProductName = get(item, 'basketInfo.product_name', '')
  const customizeProductImageSrc = `https:${get(item, 'basketInfo.c_customizerRecipeBaked')}`
  const hasMonogram = get(item, 'basketInfo.c_customizerMonogramPreview')

  const promoRenderArr = useMemo(
    () =>
      getNonAppliedPromoArr(
        productPromotions,
        productLevelPromos,
        promoRenderInfo,
        orderLevelPromos,
        hasPromotion
      ),
    [productPromotions]
  )

  const monogramHtml = getMonogramAttributeData(item, 'html')
  const monogramColor = getMonogramAttributeData(item, 'colorHex')

  const itemListPrice = get(item, 'pricingInfo[0].list.value')
  const itemQuantity = get(item, 'quantity', 1)
  const itemDiscountPercentage = get(item, 'pricingInfo[0].discountPercentage')

  const hiddenCVandDRarea = (
    <Box display="none">
      {itemListPrice && <Box className="product-list-price">{itemListPrice * itemQuantity}</Box>}
      {itemDiscountPercentage && (
        <Box className="product-discount-percentage">{itemDiscountPercentage}</Box>
      )}
    </Box>
  )

  return (
    <Flex direction="column" className="minicart-item" tabIndex={0}>
      {storeName && (
        <Flex justify="space-between" sx={styles.storePickupContainer}>
          <Flex>
            <LocationIcon width="24" height="24" />
            {formatMessage({ id: 'header.minicart.pickupItem', defaultMessage: 'Pickup Item' })}
          </Flex>
          {storeName}
        </Flex>
      )}
      <Flex
        onClick={isGift ? handleUnclickable : navigateToProduct}
        cursor={isGift ? 'default' : 'pointer'}
        align="flex-start"
        {...props}
      >
        <Image
          width="124px"
          maxWidth="124px"
          src={hasEmbellishments ? customizeProductImageSrc : imageSrc}
          alt={imageAlt}
          objectFit="cover"
          height="165px"
          data-qa={qaTags.image}
        />
        <Flex flex="1" flexDirection="column" sx={styles.miniCartProductContainer}>
          <Text
            width="213px"
            variant="body-text-secondary"
            size="md"
            data-qa={qaTags.name}
            sx={styles.miniCartProductName}
          >
            {hasEmbellishments || hasMonogram ? customizeProductName : name}
          </Text>
          <Box sx={styles.miniCartProductOtherDetail}>
            {Object.keys(propValues).map((key) =>
              variationText(
                styles,
                formatMessage({
                  id: `header.minicart.${key}`,
                  defaultMessage: `${VARIATION_LABELS[key]}`,
                }),
                `${propValues[key].text}`,
                key
              )
            )}
            {variationText(
              styles,
              formatMessage({ id: 'header.minicart.quantity', defaultMessage: 'Qty' }),
              `${quantity}`,
              'quantity'
            )}
          </Box>
          {(hasEmbellishments || hasMonogram) && (
            <Flex sx={styles.mainPriceContainer}>
              <Text variant="body-text-secondary" size="md" sx={styles.discountPrice(priceColor)}>
                {getFormattedPrice(customizerProductPriceDiscout)}
              </Text>
              {customizerProductPrice !== undefined &&
                customizerProductPriceDiscout !== undefined &&
                customizerProductPrice !== customizerProductPriceDiscout && (
                  <Text
                    variant="body-text-secondary"
                    size="md"
                    sx={styles.mainPrice}
                    data-qa={qaTags.price}
                  >
                    {getFormattedPrice(customizerProductPrice)}
                  </Text>
                )}
            </Flex>
          )}
          {!isGift && !(hasEmbellishments || hasMonogram) && (
            <Flex sx={styles.mainPriceContainer}>
              {discountedPrice !== undefined && (
                <Text
                  variant="body-text-secondary"
                  size="md"
                  sx={styles.discountPrice(priceColor)}
                  data-qa={qaTags.price}
                  className="minicart-item-price"
                >
                  {getFormattedPrice(discountedPrice)}
                </Text>
              )}
              {regularPriceToRender !== undefined && (
                <Text
                  variant="body-text-secondary"
                  size="md"
                  sx={styles.mainPrice}
                  data-qa={qaTags.stPrice}
                >
                  {getFormattedPrice(regularPriceToRender)}
                </Text>
              )}
              {isOutlet && (itemListPrice || itemDiscountPercentage) && hiddenCVandDRarea}
            </Flex>
          )}
          {isGift ? (
            <Text variant="body-text-secondary" size="14px">
              {formatMessage({
                id: 'header.minicart.complimentrygiftmsg',
                defaultMessage: 'Complimentary Gift with Purchase',
              })}
            </Text>
          ) : (
            <>
              <Flex flexDirection="column">
                {productLevelPromos
                  .filter((promo) => !!get(promo, 'coupon_code', get(promo, 'promotion_id')))
                  .map(
                    renderPromotion(
                      styles,
                      isBundleProduct,
                      false,
                      formatMessage,
                      miniCartPromoText[item.id]
                    )
                  )}
              </Flex>
              <Flex flexDirection="column">
                {hasPromotion &&
                  orderLevelPromos.map(
                    renderPromotion(
                      styles,
                      isBundleProduct,
                      true,
                      formatMessage,
                      miniCartPromoText[item.id]
                    )
                  )}
              </Flex>
              <Flex flexDirection="column">
                {productOrderLevelPromotions.length > 0 && isCanada
                  ? productOrderLevelPromotions.map(renderOrderLevelPromotions)
                  : promoRenderArr.map(renderNotAppliedPromo)}
              </Flex>
            </>
          )}
          <Badges
            area={BadgeArea.MINICART}
            page="minicart"
            variant="miniCart"
            product={item}
            masterData={get(item, 'masterProductData', get(item, 'master', {}))}
            variationGroupData={matchedVariant}
          />
        </Flex>
        {(hasEmbellishments || hasMonogram) && (
          <ProductInfoMessage
            textSize="s"
            textProps={{ color: styles.miniCartProductInfoMessage.color }}
            sx={styles.miniCartProductInfoMessage}
          >
            <Flex>
              {hasMonogram && monogramHtml && (
                <div className="customization__monogram__container">
                  <div
                    className="customization__monogram__minicart"
                    style={{ color: monogramColor }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: monogramHtml }} />
                  </div>
                </div>
              )}
              <Flex direction="column" justify="center" w={hasMonogram ? '211px' : 'auto'}>
                <Flex>
                  {!isDigitalPrintingProduct
                    ? formatMessage({
                        id: 'header.minicart.monogrammedItemShippingText',
                        defaultMessage:
                          '* MONOGRAMMED OR CUSTOMIZED ITEMS ARE FINAL SALE AND REQUIRE 2-3 ADDITIONAL BUSINESS DAYS FOR SHIPPING.',
                      })
                    : formatMessage({
                        id: 'header.minicart.monogrammedItemEmbellishmentExcludedText',
                        defaultMessage:
                          '* MONOGRAMMED OR CUSTOMIZED ITEMS ARE FINAL SALE AND REQUIRE 2-3 ADDITIONAL BUSINESS DAYS FOR SHIPPING. EMBELLISHMENTS EXCLUDING DIGITAL PRINTING CAN BE EXCHANGED IN STORE.',
                      })}
                </Flex>
              </Flex>
            </Flex>
          </ProductInfoMessage>
        )}
      </Flex>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(memo(MiniCartPopoverItem))
