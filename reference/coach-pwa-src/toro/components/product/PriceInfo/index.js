import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import useTheme from 'toro/hooks/useTheme'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import { useEffect, useMemo, useState, useContext } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import PWAContext from 'components/common/PWAContext'
import ComparablePrice from 'toro/components/product/ComparablePrice'
import {
  isMegaPDPEligibleAtom,
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveScrolledAtom,
  setPriceGroupAtom,
  isPdpV4ATFFullPricingAtom,
} from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { price as formatPrice, currencyMap, getCurrency } from 'toro/helpers/price-format'
import { useIntl } from 'react-intl'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import Badges from 'toro/components/badges/Badges'
import PropTypes from 'prop-types'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import isCA from 'toro/helpers/isCA'
import Skeleton from 'toro/components/Skeleton'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { isSWOutletAtom } from 'store/global.atom'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import SlideFade from 'toro/components/SlideFade'
import { promotionalPricingData } from './helper'
import isKS from 'toro/helpers/isKS'
import { isPlpV3Atom } from 'store/plp.atom'
import useExperiment from 'toro/hooks/useExperiment'

function PriceInfo({
  productData,
  variant,
  isSticky,
  product,
  selectedColor,
  isBundleVariant = false,
  apploading,
  hideComparablePrice,
  hideDiscountedRate,
  isQuickView,
  selectedVariant,
  variationGroups,
  isServerSide,
  variants,
  defaultVgId,
  defaultVariantID,
  swComparablePriceToggle,
  isAdaptiveTabbedPDP,
  ...props
}) {
  const { formatMessage } = useIntl()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const bundleProduct = get(productData, 'hitType') === 'set'
  const isPDPV4_1Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const priceInfoStyleVariantV4X =
    isAdaptiveTabbedPDP && (isPDPV4_1Enabled ? 'adaptiveTabbedPDP_1' : 'adaptiveTabbedPDP')
  const priceInfoStyleVariantV3 = isPlpV3 && !bundleProduct && 'plpV3Pricing'
  const styleVariant = isBundleVariant
    ? 'bundle'
    : priceInfoStyleVariantV4X || priceInfoStyleVariantV3
  const styles =
    useMultiStyleConfig('PriceInfoTheme', {
      variant: styleVariant,
    }) || {}
  const theme = useTheme()
  const { isMobile } = useViewportType()
  const priceTextHeight = variant === 'mobile' ? '32px' : '38px'
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const isKateSpade = isKS()

  //this check is required, since brand requested to change
  // experiment of comparable price value for V3 only for outlet.
  const displayComparablePriceAtTop =
    get(appData, 'brand') === 'coach-outlet' || isSWOutlet || isKateSpade

  const isPdpV4ATFFullPricing = useAtomValue(isPdpV4ATFFullPricingAtom)

  const parallaxEffectWrapper = !isPdpV4ATFFullPricing ? SlideFade : Box

  const {
    priceSitePreferences: { isComparablePriceValue: comparablePriceOn, hideListPrice },
    generalConfiguration: { siteIdentifier },
  } = usePreferenceNew({
    priceSitePreferences: ['isComparablePriceValue', 'hideListPrice'],
    generalConfiguration: ['siteIdentifier'],
  })

  const bundledVariantWithComparablePricingEnabled =
    isBundleVariant && comparablePriceOn && !hideComparablePrice
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const currentCurrency = get(productData, 'pickedProps.currency')
  const getCurrencyOptions = useGetCurrencyOptions()
  const priceToFormate = (price) => {
    const currencyOptions = getCurrencyOptions(currentCurrency)
    return formatPrice(price, currencyOptions)
  }

  const comparableListPrice =
    priceToFormate(get(productData, 'prices.regularPrice')) ||
    get(product, 'promotionPrice.0.list.formatted')

  let defaultPricing
  if (
    selectedVariant &&
    typeof selectedVariant === 'object' &&
    Object.keys(selectedVariant)?.length
  ) {
    defaultPricing = selectedVariant?.pricingInfo || selectedVariant?.variantPrice
  } else if (defaultVgId) {
    if (selectedColor && selectedColor?.id) {
      if (!selectedColor?.isCustomized) {
        defaultPricing = isMegaPDPEligible
          ? variationGroups?.find?.((item) => item?.id === selectedColor?.vgId)?.pricingInfo
          : variationGroups?.find?.((item) => item?.id?.includes(selectedColor?.id))?.pricingInfo
      } else {
        defaultPricing = productData.pricingInfo
      }
    } else {
      defaultPricing = variationGroups?.find?.((item) => item?.id === defaultVgId)?.pricingInfo
    }
  } else if (!defaultVgId && variants?.find?.((item) => item?.id?.includes(defaultVariantID))) {
    defaultPricing = variants?.find?.((item) => item?.id?.includes(defaultVariantID))?.pricingInfo
  } else if (isServerSide) {
    defaultPricing = productData?.variationGroup?.filter?.(
      (item) => item?.color === productData?.defaultColor?.id
    )?.[0]?.variantPrice
  } else {
    defaultPricing = get(productData, 'pickedProps.promotionData.Pricing')
  }

  if (!selectedVariant && selectedColor?.id) {
    const selectedVG = isMegaPDPEligible
      ? variationGroups?.find((item) => item?.id === selectedColor?.vgId)
      : variationGroups?.find((item) => item?.id?.includes?.(selectedColor?.id))
    if (selectedVG?.pricingInfo && Array.isArray(selectedVG?.pricingInfo)) {
      defaultPricing = selectedVG?.pricingInfo
    }
  }
  const productPricesObj = get(productData, 'prices')
  const dollarOff = get(appData, 'dollarOffEnabled', false)

  const priceFormatTransform = (prices) => {
    if (productData.hitType === 'variation_group') {
      return get(productData, 'promoPDP.promoPricing.[0]')
    }
    if (prices) {
      const priceObj = {}
      priceObj.discountPercentage = prices.discount
      priceObj.list = {
        value: prices.regularPrice,
        formatted: priceToFormate(prices.regularPrice),
      }
      priceObj.sales = {
        value: prices.currentPrice,
        formatted: priceToFormate(prices.currentPrice),
      }
      return priceObj
    }
  }

  if (!defaultPricing?.length) {
    defaultPricing =
      priceFormatTransform(productPricesObj) ||
      get(productData, 'defaultVariationGroupData.pickedProps.promotionData.Pricing.0') ||
      (get(productData, 'promotionPrice.0') ??
        (bundledVariantWithComparablePricingEnabled
          ? get(productData, 'defaultVariant.prices.currentPrice', 0)
          : get(productData, 'defaultVariant.prices.regularPrice', 0)))
  }

  const isKsSur = siteIdentifier === 'ksna-surprise'
  const isOutletBrand = siteIdentifier === 'coach-outlet'

  const enablePriceTaxIncluded = usePreference({
    groupId: 'PDPPreferences',
    preferenceId: 'enablePriceTaxIncluded',
    siteId,
    defaultValue: false,
  })
  const showBundleListPricePrefrence = usePreference({
    groupId: 'bundleConfigurations',
    preferenceId: 'showBundleListPrice',
  })

  const markdownPricePref = usePreference({
    groupId: 'priceSitePreferences',
    preferenceId: 'markDownPriceStyle',
  })

  const isPriceIncludesCurrency = (price) => {
    let localeCurrency = currencyMap[currentCurrency] || ''
    if (typeof localeCurrency === 'string') return price?.toString().includes(localeCurrency)
    return localeCurrency?.some((currency) => price?.toString().includes(currency))
  }

  const markdownPriceEnabled = getSiteValueFromPref(markdownPricePref, siteId, false)

  const showBundleListPrice = getSiteValueFromPref(showBundleListPricePrefrence, siteId, false)
  const isBundleProduct = productData?.isBundleProduct || false
  const bundlePricingInfoFromPLP =
    !isServerSide && isBundleProduct && get(productData, 'pickedProps.promotionData.Pricing[0]')
  const bundleListPrice = isServerSide
    ? priceToFormate(get(productData, 'set.pricingInfo[0].list.value')) ||
      get(productData, 'set.pricingInfo[0].list.formatted')
    : priceToFormate(get(productData, 'list.value')) ||
      get(bundlePricingInfoFromPLP, 'list.formatted')
  const bundleSalesPrice = isServerSide
    ? priceToFormate(get(productData, 'set.pricingInfo[0].sales.value')) ||
      get(productData, 'set.pricingInfo[0].sales.formatted')
    : priceToFormate(get(bundlePricingInfoFromPLP, 'sales.value')) ||
      get(bundlePricingInfoFromPLP, 'sales.formatted')

  const bundleSalePriceCaption = isServerSide
    ? get(productData, 'set.pricingInfo[0].salePriceCaption', '')
    : get(bundlePricingInfoFromPLP, 'salePriceCaption', '')

  const bundleListPriceCaption = isServerSide
    ? get(productData, 'set.pricingInfo[0].listPriceCaption', '')
    : get(bundlePricingInfoFromPLP, 'listPriceCaption', '')

  const bundleDiscountPercentage = isServerSide
    ? get(productData, 'set.pricingInfo[0].discountPercentage')
    : get(bundlePricingInfoFromPLP, 'discountPercentage')

  const bundleDiscountRange =
    !appData?.isDiscountOffDisabled &&
    bundleDiscountPercentage > 0 &&
    `(${bundleDiscountPercentage?.toFixed(
      Number.isSafeInteger(bundleDiscountPercentage) ? 0 : 2
    )}%${comparablePriceOn ? ' off' : ''})`

  const dohDodPricing = useMemo(
    () => promotionalPricingData(productData, productData?.promotionPrice),
    [productData]
  )

  const [pricing, setPricing] = useState(defaultPricing?.[0])
  const isRangeProduct = get(defaultPricing, '[0].type') === 'range'

  const [hasRange, setHasRange] = useState(isRangeProduct)
  const setPriceGroup = useUpdateAtom(setPriceGroupAtom)

  useEffect(() => {
    const priceNode = Array.isArray(defaultPricing) ? defaultPricing?.[0] : defaultPricing

    try {
      if (JSON.stringify(priceNode) !== JSON.stringify(pricing)) {
        setPricing(priceNode)
        setHasRange(get(priceNode, 'type') === 'range')
      }
    } catch (e) {
      console.log('Error in Price Info', e)
    }
  }, [defaultPricing])

  let discountPercentage = 0
  let listPrice = 0
  let salePrice = 0
  let discountRange = 0
  if (!hasRange) {
    discountPercentage =
      get(pricing, 'discountPercentage') || get(defaultPricing, 'discountPercentage')
    const discount = discountPercentage?.toFixed(Number.isSafeInteger(discountPercentage) ? 0 : 2)
    discountRange =
      !appData?.isDiscountOffDisabled &&
      discountPercentage &&
      `(${formatMessage(
        {
          id: 'pdp.price.discount',
          defaultMessage: `{discount}% ${
            comparablePriceOn || swComparablePriceToggle || isPlpV3 ? 'off' : ''
          }`,
        },
        { discount }
      )})`
    listPrice =
      typeof pricing === 'object'
        ? priceToFormate(get(pricing, 'list.value')) || get(pricing, 'list.formatted')
        : priceToFormate(pricing)
    salePrice =
      typeof pricing === 'object'
        ? priceToFormate(get(pricing, 'sales.value')) || get(pricing, 'sales.formatted')
        : priceToFormate(pricing)
  } else {
    const { max, min } = pricing || {}
    const isSaleRange = !!(max?.sales?.value - min?.sales?.value)
    const isListRange = !!(max?.list?.value - min?.list?.value)

    if (isSaleRange) {
      const minSalePrice =
        priceToFormate(get(pricing, 'min.sales.value')) || get(pricing, 'min.sales.formatted', '0')
      const maxSalePrice =
        priceToFormate(get(pricing, 'max.sales.value')) || get(pricing, 'max.sales.formatted', '0')

      salePrice = `${minSalePrice} - ${maxSalePrice}`
    }

    if (isListRange) {
      const minListPrice =
        priceToFormate(get(pricing, 'min.list.value')) || get(pricing, 'min.list.formatted', '0')
      const maxListPrice =
        priceToFormate(get(pricing, 'max.list.value')) || get(pricing, 'max.list.formatted', '0')

      listPrice = `${minListPrice} - ${maxListPrice}`
    }

    const maxDiscount = get(pricing, 'max.discountPercentage')
    const isDiscountSame = get(pricing, 'maxDiscount.isDiscountSame', false)
    discountPercentage =
      pricing?.type === 'range'
        ? pricing?.maxDiscount?.maxDiscount
        : pricing?.discountPercentage || get(defaultPricing, 'discountPercentage')

    if (!appData?.isDiscountOffDisabled && isDiscountSame) {
      const discount = maxDiscount?.toFixed(Number.isSafeInteger(maxDiscount) ? 0 : 2)
      discountRange = `(${formatMessage(
        {
          id: 'pdp.price.discount',
          defaultMessage: `{discount}% ${comparablePriceOn ? 'off' : ''}`,
        },
        { discount }
      )})`
    } else {
      discountRange = `(Up to ${discountPercentage?.toFixed(
        Number.isSafeInteger(discountPercentage) ? 0 : 2
      )}%)`

      listPrice =
        priceToFormate(get(pricing, 'max.list.value')) || get(pricing, 'max.list.formatted', '0')

      if (listPrice === '0') {
        listPrice = priceToFormate(get(pricing, 'sales.value', '0'))
      }
    }
  }

  useEffect(() => {
    setPriceGroup({
      listPrice,
      salePrice: typeof pricing === 'string' ? pricing : salePrice,
      dohDodPrice:
        priceToFormate(get(dohDodPricing, 'prices.value')) ||
        get(dohDodPricing, 'prices.formatted'),
    })
  }, [pricing, dohDodPricing])

  const listPriceStyles = useMemo(
    () => ({
      listPriceWrapper: styles.ListPriceWrapper({ listPrice, isMobile }),
      listPriceText: styles.ListPriceText({ isQuickView, isMobile, isSticky }),
    }),
    [listPrice, isMobile, isQuickView, isSticky]
  )
  const taxIncludedLabel = useMemo(
    () => ({
      priceTaxIncluded: styles.PriceTaxIncluded({ isMobile, isSticky }),
    }),
    [isMobile]
  )
  const dealPriceWrapper = useMemo(() => {
    const isImplicitPromotion =
      dohDodPricing.markdownDiscPercent && dohDodPricing.promotionDiscPercent
    return {
      dealPriceWrapperStyle: styles.DealPriceWrapper({
        isMobile,
        isSticky,
        isImplicitPromotion,
      }),
      dealPriceBox: styles.DealPriceBox({ salePrice, isSticky }),
      dealPriceText: styles.DealPriceText({
        isQuickView,
        variant,
        isSticky,
        isMobile,
        isImplicitPromotion,
      }),
    }
  }, [isMobile, salePrice, isQuickView, variant, isSticky, dohDodPricing])

  const standardPriceWrapper = useMemo(
    () =>
      styles.StandardPriceWrapper({
        salePrice,
        isCustom: selectedColor?.isCustomized || selectedColor?.isMonogrammed,
        isBundleProduct,
        isMobile,
      }),
    [salePrice, isBundleProduct, selectedColor, isMobile]
  )

  const activePriceStyles = useMemo(() => {
    const fontSize =
      isQuickView || variant === 'mobile' ? theme.fontSizes.xl : theme.fontSizes.double

    return {
      priceInfoBox: styles.PriceInfoBox({
        salePrice,
        isSticky,
        isCustomized: selectedColor?.isCustomized || selectedColor?.isMonogrammed,
        isBundleProduct,
        isSWOutlet,
        isMobile,
        isBundleVariant,
      }),
      salesPriceText:
        (comparablePriceOn &&
          (listPrice || bundleListPrice) &&
          !hideComparablePrice &&
          !isAdaptiveTabbedPDP) ||
        (markdownPriceEnabled &&
          discountPercentage > 0 &&
          !hideDiscountedRate &&
          !isAdaptiveTabbedPDP) ||
        swComparablePriceToggle
          ? styles.SalePriceRedText({
              fontSize,
              isMobile,
              isKsSur,
              isQuickView,
              isSticky,
              isSWOutlet,
              isBundleVariant,
            })
          : styles.SalePriceBlackText({
              fontSize,
              isMobile,
              isQuickView,
              isSticky,
              isBundleVariant,
            }),
    }
  }, [
    comparablePriceOn,
    salePrice,
    listPrice,
    isQuickView,
    variant,
    isMobile,
    isSticky,
    isBundleVariant,
    markdownPriceEnabled,
    discountPercentage,
    selectedColor,
    swComparablePriceToggle,
  ])

  const discountPercentageText = useMemo(
    () =>
      styles.DisPercentageText({
        isMobile,
        isQuickView,
        isBundleProduct,
        isBundleVariant,
        swComparablePriceToggle,
        isSWOutlet,
        isKsSur,
      }),
    [isMobile, isQuickView, isBundleProduct, isBundleVariant, swComparablePriceToggle]
  )

  const isImplicitPromotion =
    dohDodPricing.markdownDiscPercent && dohDodPricing.promotionDiscPercent

  const discount = useMemo(
    () =>
      comparablePriceOn && dohDodPricing.prices && isImplicitPromotion && dollarOff
        ? `${getCurrency(currentCurrency)}${(
            get(pricing, 'sales.value', '0') - get(dohDodPricing, 'prices.value', '0')
          ).toFixed(2)}`
        : isImplicitPromotion
        ? dohDodPricing.promotionDiscPercent
        : dohDodPricing.disPercent,
    [
      comparablePriceOn,
      dohDodPricing.prices,
      dohDodPricing?.promotionDiscPercent,
      dohDodPricing?.disPercent,
      isImplicitPromotion,
      dollarOff,
    ]
  )
  const DealPriceRender = () => {
    return (
      <>
        {comparablePriceOn && Boolean(isImplicitPromotion) && (
          <Flex>{standardPriceRenderer(salePrice, { isImplicitPromotion, isSticky })}</Flex>
        )}
        <Flex sx={dealPriceWrapper.dealPriceWrapperStyle} {...props} data-qa="qv_pricing_wrapper">
          <Box
            sx={dealPriceWrapper.dealPriceBox}
            minHeight={!isImplicitPromotion && priceTextHeight}
            minW={variant === 'mobile' ? '32px' : '37px'}
          >
            <Text
              sx={dealPriceWrapper.dealPriceText}
              variant="secondary"
              className="active-price"
              data-qa={isQuickView ? 'cm_txt_pdt_price_strthr' : 'cm_txt_pdt_price'}
            >
              {dohDodPricing?.prices?.formatted === 'undefined'
                ? 'N/A'
                : priceToFormate(dohDodPricing?.prices?.value) || dohDodPricing?.prices?.formatted}
            </Text>
          </Box>
          {!isSticky && !isImplicitPromotion && standardPriceRenderer(salePrice)}
          {!appData?.isDiscountOffDisabled && !isSticky && (
            <Box sx={styles.DisPercentOff}>
              <Text
                sx={styles.DisPercentOffText}
                variant="body-text-secondary"
                size="lg"
                data-qa={isQuickView ? 'cm_txt_pdt_price_dpercent' : 'cm_txt_pdt_price_dpercent'}
              >
                (
                {`${
                  comparablePriceOn && dohDodPricing.prices && isImplicitPromotion ? 'With ' : ''
                }${formatMessage(
                  {
                    id: 'pdp.price.discount',
                    defaultMessage: `{discount}% off`,
                  },
                  { discount }
                )}`}
                )
              </Text>
            </Box>
          )}
        </Flex>
      </>
    )
  }

  const strikeThroughPriceText = useMemo(() => {
    if (isFunction(styles.StrikeThroughPriceText)) {
      return styles.StrikeThroughPriceText(isMobile, isBundleProduct)
    }
    return {}
  }, [isMobile, isBundleProduct])

  const standardPriceRenderer = (
    standardPriceText,
    { isImplicitPromotion = false, isSticky = false } = {}
  ) => {
    return (
      <Box
        sx={standardPriceWrapper}
        minHeight={isImplicitPromotion ? '20px' : priceTextHeight}
        minW={variant === 'mobile' ? '32px' : '37px'}
        display="flex"
        alignItems="center"
        data-qa={isBundleProduct ? 'wrapper_retail_price' : ''}
        className="pdp-old-price-wrapper"
      >
        <Text
          sx={{ ...styles.StandardPriceText, ...strikeThroughPriceText }}
          variant="body-text-secondary"
          size="md"
          className="old-price"
          data-qa={isQuickView ? 'cm_txt_finalprice' : 'cm_txt_pdt_price_strthr'}
        >
          {isImplicitPromotion && !isSticky
            ? standardPriceText + ` (${dohDodPricing.markdownDiscPercent}% off)`
            : standardPriceText}
        </Text>
      </Box>
    )
  }

  const activePriceRenderer = (activePrice) => {
    const defaultPrice =
      priceToFormate(defaultPricing?.sales?.value) || defaultPricing?.sales?.formatted
    return activePrice?.match?.(/\d+/)?.[0] === '0' ? (
      <Skeleton height="20px" width={isSticky ? '60px' : '150px'} />
    ) : (
      <Flex
        alignItems="center"
        minHeight={isBundleVariant ? '26px' : priceTextHeight}
        sx={activePriceStyles.priceInfoBox}
        data-qa={
          isBundleProduct ? 'wrapper_bundle_price' : (isQuickView && 'cm_txt_finalprice') || null
        }
        className="pdp-active-price"
      >
        <Text
          variant="secondary"
          className="active-price"
          whiteSpace={isSticky && isMobile ? 'nowrap' : null}
          data-qa={isBundleProduct ? 'pdt_bundle_price_tag_txt' : 'cm_txt_pdt_price'}
          sx={activePriceStyles.salesPriceText}
        >
          {apploading && getCurrency(currentCurrency)
            ? defaultPrice
            : isPriceIncludesCurrency(activePrice) || activePrice === 'N/A'
            ? activePrice
            : priceToFormate(activePrice)}
        </Text>
      </Flex>
    )
  }

  const SalePriceCaptionRenderer = (salePriceCaption) => {
    return (
      <Box
        mr="s"
        sx={styles.salePriceCaption({ salePrice, isBundleProduct, isMobile })}
        minHeight={priceTextHeight}
        display="flex"
        alignItems="center"
        className="pdp-sale-price-caption"
      >
        <Text
          variant="body-text-secondary-md"
          size="md"
          color={comparablePriceOn ? theme.colors.main.saleRed : theme.colors.main.black}
          fontFamily={
            isBundleProduct ? theme.fontFamily.secondaryNormal : theme.fontFamily.primaryNormal
          }
          className="old-price"
          sx={styles.salePriceCaptionStyle}
        >
          {salePriceCaption}
        </Text>
      </Box>
    )
  }
  const isCAlocale = isCA()
  const isTabbedAdaptive = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isTabbedAdaptiveScrolled = useAtomValue(isTabbedAdaptiveScrolledAtom)
  const discountRangeRenderer = (discountRange = '') => {
    return (
      <ConditionalWrapper
        condition={
          (isTabbedAdaptive && !isPDPV4_1Enabled && !isPdpV42Enabled) ||
          (isTabbedAdaptive && isPdpV42Enabled && !isOutletBrand)
        }
        Wrapper={parallaxEffectWrapper}
        in={isTabbedAdaptiveScrolled || (isPdpV4ATFFullPricing && !isPdpV42Enabled)}
        direction="right"
        unmountOnExit
      >
        <Flex
          alignItems="center"
          minH={variant !== 'mobile' && priceTextHeight}
          sx={styles.DisPercentage({ isQuickView, isMobile })}
          className="pdp-price-discount-range-wrapper"
        >
          <Text
            mt="0"
            variant="body-text-secondary"
            className="price-text discount-text"
            size={variant === 'mobile' ? 'sm' : 'md'}
            color={theme.colors.main.gray}
            ml={isCAlocale ? (isMobile ? 'xs' : 's') : ''}
            data-qa={isQuickView ? 'cm_txt_pdt_price_dpercent' : 'cm_txt_pdt_price_dpercent'}
            sx={discountPercentageText}
          >
            {discountRange}
          </Text>
        </Flex>
      </ConditionalWrapper>
    )
  }

  const priceSectionPipe = useMemo(() => {
    if (isFunction(styles.priceSectionPipe)) {
      return styles.priceSectionPipe(isBundleProduct)
    }
    return {}
  }, [isBundleProduct])

  const priceTaxIncludedMessage = formatMessage({
    id: 'pdp.product.priceTaxIncluded',
    defaultMessage: ' ',
  })

  const shouldShowComparablePrice =
    (!isSticky && comparablePriceOn && hideComparablePrice === false && listPrice) ||
    swComparablePriceToggle

  const shouldShowOldPrice =
    !!discountPercentage &&
    !comparablePriceOn &&
    !(selectedColor?.isCustomized || selectedColor?.isMonogrammed) &&
    !swComparablePriceToggle &&
    !(hideComparablePrice && hideListPrice)

  const shouldShowDiscountRange =
    !isSticky &&
    !!discountPercentage &&
    !(selectedColor?.isCustomized || selectedColor?.isMonogrammed) &&
    !hideDiscountedRate

  const shouldShowBundleComparablePrice =
    bundleSalesPrice !== 'N/A' &&
    !isSticky &&
    comparablePriceOn &&
    showBundleListPrice &&
    bundleListPrice

  return isBundleProduct ? (
    <Flex direction="column" className="pdp-price-info-wrapper">
      {shouldShowBundleComparablePrice && (
        <ConditionalWrapper
          condition={!displayComparablePriceAtTop}
          Wrapper={Experiment}
          alwaysOnForDesktop
          notForIDs={EXPERIMENTS.PDP_V3}
        >
          <ComparablePrice listPrice={bundleListPrice} />
        </ConditionalWrapper>
      )}
      <Flex
        alignItems="center"
        {...props}
        mt={variant !== 'mobile' && !comparablePriceOn && '16px'}
        wrap="wrap"
        height="auto"
        mb="13px"
        data-qa="qv_pricing_wrapper"
        sx={styles.BundlePriceWrapper?.({ isMobile })}
      >
        {activePriceRenderer(
          bundleSalesPrice && bundleSalesPrice !== 'N/A'
            ? bundleSalesPrice
            : bundleListPrice || 'N/A'
        )}
        {isSticky
          ? null
          : bundleSalesPrice !== 'N/A'
          ? showBundleListPrice && SalePriceCaptionRenderer(bundleSalePriceCaption)
          : null}
        {showBundleListPrice && bundleSalesPrice !== 'N/A' && (
          <>
            {!isSticky && !comparablePriceOn && (
              <>
                <Text
                  variant="body-text-secondary"
                  size={variant === 'mobile' ? 'sm' : 'md'}
                  color={theme.colors.main.gray}
                  sx={priceSectionPipe}
                >
                  |
                </Text>
                <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
                  &nbsp;&nbsp;
                </Experiment>
              </>
            )}
            {bundleSalesPrice !== 'N/A' &&
              !comparablePriceOn &&
              standardPriceRenderer(
                `${isSticky ? '' : bundleListPriceCaption ?? ''} ${bundleListPrice ?? ''}`
              )}
            {!isSticky && showBundleListPrice && discountRangeRenderer(bundleDiscountRange)}
          </>
        )}
      </Flex>
      {shouldShowBundleComparablePrice && !displayComparablePriceAtTop && (
        <Experiment forMobile forIDs={EXPERIMENTS.PDP_V3}>
          <ConditionalWrapper
            condition={isTabbedAdaptive}
            Wrapper={parallaxEffectWrapper}
            in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing}
            direction="bottom"
            unmountOnExit
          >
            <ComparablePrice listPrice={bundleListPrice} />
          </ConditionalWrapper>
        </Experiment>
      )}
    </Flex>
  ) : (
    <>
      {shouldShowComparablePrice && !(isTabbedAdaptive && isPdpV42Enabled && isMobile) && (
        <ConditionalWrapper
          condition={!displayComparablePriceAtTop}
          Wrapper={Experiment}
          notForIDs={EXPERIMENTS.PDP_V3}
          alwaysOnForDesktop
        >
          <ConditionalWrapper
            condition={isTabbedAdaptive}
            Wrapper={parallaxEffectWrapper}
            in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing || isPDPV4_1Enabled}
            direction="right"
            unmountOnExit
          >
            <ComparablePrice
              listPrice={
                apploading || typeof pricing !== 'object' ? comparableListPrice : listPrice
              }
              variant={styleVariant}
            />
          </ConditionalWrapper>
        </ConditionalWrapper>
      )}
      {dohDodPricing.disPercent &&
      dohDodPricing.prices &&
      !(selectedColor?.isCustomized || selectedColor?.isMonogrammed) ? (
        DealPriceRender()
      ) : (
        <>
          <Flex
            sx={styles.PriceInfoWrapper({ isMobile, isBundleVariant })}
            {...props}
            h={isSWOutlet ? '14px' : props?.h}
            alignItems="center"
            data-qa="qv_pricing_wrapper"
            className="pdp-price-info-wrapper"
            whiteSpace={isSticky && !isMobile && 'nowrap'}
          >
            <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
              {isBundleVariant && !comparablePriceOn && (
                <Text align="center" variant="body-secondary" sx={styles.BundlePriceInfo}>
                  Retail:
                </Text>
              )}
            </Experiment>
            {activePriceRenderer(
              selectedColor?.isCustomized || selectedColor?.isMonogrammed
                ? selectedColor?.price === 'undefined'
                  ? 'N/A'
                  : selectedColor?.price
                : typeof pricing === 'string'
                ? pricing
                : (salePrice + '')?.includes('undefined') || salePrice === 0
                ? listPrice && listPrice !== '0'
                  ? listPrice
                  : 'N/A'
                : salePrice
            )}
            {selectedColor?.standardPrice &&
              selectedColor?.price !== selectedColor?.standardPrice &&
              standardPriceRenderer(
                (selectedColor?.isCustomized || selectedColor?.isMonogrammed) &&
                  selectedColor?.standardPrice
              )}
            {shouldShowOldPrice && (
              <ConditionalWrapper
                condition={isTabbedAdaptive && !isPdpV42Enabled}
                Wrapper={parallaxEffectWrapper}
                in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing}
                direction="right"
                unmountOnExit
              >
                <Flex
                  sx={listPriceStyles.listPriceWrapper}
                  alignItems="center"
                  minHeight={priceTextHeight}
                  className="discount-percent"
                >
                  <Text
                    sx={listPriceStyles.listPriceText}
                    variant="body-text-secondary"
                    color={theme.colors.main.gray}
                    whiteSpace={isSticky && isMobile ? 'nowrap' : null}
                    className="old-price"
                    data-qa={isQuickView ? 'cm_txt_pdt_price_strthr' : 'cm_txt_pdt_price_strthr'}
                  >
                    {listPrice}
                  </Text>
                </Flex>
              </ConditionalWrapper>
            )}
            {shouldShowDiscountRange && discountRangeRenderer(discountRange)}
            {shouldShowComparablePrice && isTabbedAdaptive && (
              <Experiment forIDs={EXPERIMENTS.PDP_V4_2} forMobile>
                <ComparablePrice
                  listPrice={
                    apploading || typeof pricing !== 'object' ? comparableListPrice : listPrice
                  }
                  variant={styleVariant}
                />
              </Experiment>
            )}
            {enablePriceTaxIncluded && (
              <Text as="span" sx={taxIncludedLabel.priceTaxIncluded}>
                {priceTaxIncludedMessage}
              </Text>
            )}
            {!isSticky && (!shouldShowOldPrice || !shouldShowDiscountRange) && (
              <Experiment forMobile forIDs={EXPERIMENTS.PDP_V3}>
                <ConditionalWrapper
                  condition={isTabbedAdaptive}
                  Wrapper={parallaxEffectWrapper}
                  in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing}
                  direction="right"
                  unmountOnExit
                >
                  <Flex>
                    <Badges
                      area={BadgeArea.PROMOTION_AND_SALE}
                      page="pdp"
                      variant="promotionAndSale"
                      product={product}
                      {...props}
                    />
                  </Flex>
                </ConditionalWrapper>
              </Experiment>
            )}
            {!isSticky && (
              <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
                <Flex>
                  <Badges
                    area={BadgeArea.PROMOTION_AND_SALE}
                    page="pdp"
                    variant="promotionAndSale"
                    product={product}
                    {...props}
                  />
                </Flex>
              </Experiment>
            )}
          </Flex>
          {!isSticky && shouldShowOldPrice && shouldShowDiscountRange && (
            <Experiment forMobile forIDs={EXPERIMENTS.PDP_V3}>
              <ConditionalWrapper
                condition={isTabbedAdaptive}
                Wrapper={parallaxEffectWrapper}
                in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing}
                direction="right"
                unmountOnExit
              >
                <Flex className="pdp-price-promotion-and-sale" sx={styles.BottomBadgesWrapper}>
                  <Badges
                    area={BadgeArea.PROMOTION_AND_SALE}
                    page="pdp"
                    variant="promotionAndSale"
                    product={product}
                    {...props}
                  />
                </Flex>
              </ConditionalWrapper>
            </Experiment>
          )}
        </>
      )}
      {shouldShowComparablePrice && !displayComparablePriceAtTop && (
        <Experiment forMobile forIDs={EXPERIMENTS.PDP_V3}>
          <ConditionalWrapper
            condition={isTabbedAdaptive}
            Wrapper={parallaxEffectWrapper}
            in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing}
            direction="bottom"
            unmountOnExit
          >
            <ComparablePrice
              listPrice={
                apploading || typeof pricing !== 'object' ? comparableListPrice : listPrice
              }
              variant={styleVariant}
            />
          </ConditionalWrapper>
        </Experiment>
      )}
    </>
  )
}

PriceInfo.propTypes = {
  productData: PropTypes.object,
  variant: PropTypes.string,
  isSticky: PropTypes.bool,
  isQuickView: PropTypes.bool,
  product: PropTypes.object,
  selectedColor: PropTypes.object,
  selectedVariant: PropTypes.object,
  isBundleVariant: PropTypes.bool,
  apploading: PropTypes.bool,
  hideComparablePrice: PropTypes.bool,
  hideDiscountedRate: PropTypes.bool,
}

PriceInfo.defaultProps = {
  productData: {},
  variant: 'desktop',
  isSticky: false,
  isQuickView: false,
  product: {},
  selectedColor: {},
  selectedVariant: {},
  isBundleVariant: false,
  apploading: false,
  hideComparablePrice: false,
  hideDiscountedRate: false,
}

export default withErrorBoundaryWrapper(PriceInfo)
