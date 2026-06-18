import { useCallback, useContext, useMemo, memo } from 'react'
import PWAContext from 'components/common/PWAContext'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isPlainObject from 'lodash/isPlainObject'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { getShowStrikeOffPrice } from 'toro/components/Price/helpers'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import isSW from 'toro/helpers/isSW'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import { price as formatPrice } from 'toro/helpers/price-format'
import usePreference from 'toro/hooks/usePreference_new'
import { isPlpV3Atom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'
import useCustomSalePriceColor from 'toro/hooks/useCustomSalePriceColor'
import { CertonaPriceType } from 'toro/components/Certona/RecommendationPrice'
import { productTileSections } from 'toro/constants/productList'

// Testing scenarios for Pricing on PDP & PLPs - https://confluence.tapestry.support/display/SWNA/TORO+2.3++MW+-+Regression+Scenarios

// TODO: check if we still need a different format for search suggestions, there's no ticket yet
const Price = ({
  product = undefined,
  activeColorId = undefined,
  variant = undefined,
  isSearchSuggestionFormat = false,
  isComparablePriceValue = undefined,
  hideComparablePrice = undefined,
  hideDiscountedRate = undefined,
  pricePreferences = undefined,
  isSWOutlet = undefined,
  isComparablePriceEnabledCategory = undefined,
  enhancedPlp = false,
  isSearchSuggestion = false,
  isRecommendation = false,
  showOnlySinglePrice = false,
}) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('Price', { variant })
  const theme = useTheme()
  const { isDesktop } = useViewportType()
  const { appData } = useContext(PWAContext)
  const isDiscountOffDisabled = get(appData, 'isDiscountOffDisabled') || showOnlySinglePrice
  const isCategoryEnableForCompPrice = isSWOutlet && isComparablePriceEnabledCategory
  const getCurrencyOptions = useGetCurrencyOptions()
  const isOutlet = get(appData, 'brand') === 'coach-outlet'
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isLegacyPlp = !isPlpV3
  const customCertonaSalePriceColor = useCustomSalePriceColor({
    isSearchSuggestionFlyout: isRecommendation,
  })

  const {
    plpTemplateConfigurations: { HideDiscountPercentageOnPLP: hideDiscountPercentageOnPLP },
    certonaConfiguration: { certonaPriceDisplay },
    priceSitePreferences: { hideListPrice },
    generalConfiguration: { siteIdentifier },
  } = usePreference({
    plpTemplateConfigurations: ['HideDiscountPercentageOnPLP'],
    CertonaConfiguration: ['certonaPriceDisplay'],
    priceSitePreferences: ['hideListPrice'],
    generalConfiguration: ['siteIdentifier'],
  })
  const isKateSpadeOutlet = siteIdentifier === 'ksna-surprise'

  const hideListPriceValue = hideListPrice && hideComparablePrice

  const priceToFormate = (priceObj) => {
    // This values is returned from API.
    // If it exists we always need to rely on it
    // in other case use custom price utility.
    const formattedPrice = get(priceObj, 'formatted')
    if (formattedPrice) return formattedPrice

    const priceValue = get(priceObj, 'value')
    const priceCurrency = get(priceObj, 'currency')

    const currency =
      priceCurrency || get(product, 'pickedProps.currency') || get(product, 'currency', 'USD')
    const currencyOptions = getCurrencyOptions(currency)

    // This is used as fallback in a case if API
    // does not contain formatted price.
    // Also this is used for constructor SRP.
    return formatPrice(priceValue, currencyOptions)
  }

  const getSalesPrice = (pricingObj, formatted = false) => {
    return formatted ? priceToFormate(get(pricingObj, 'sales')) : get(pricingObj, 'sales.value')
  }

  const getListPrice = (pricingObj, formatted = false) => {
    return formatted ? priceToFormate(get(pricingObj, 'list')) : get(pricingObj, 'list.value')
  }

  const getDohPrice = (pricingObj, formatted = false) => {
    return formatted
      ? priceToFormate(get(pricingObj, 'promotionalPrice'))
      : get(pricingObj, 'promotionalPrice.value')
  }

  const {
    markdownPriceEnabled,
    showBundleListPrice,
    isHideStrikeOffPriceEnabled,
    showPromotionalPrice,
    isPriceRangeToggleEnabled,
    isKsSur,
  } = pricePreferences

  const showMarkPriceAndPercInSS = !showPromotionalPrice

  const isVariantSelected = useMemo(() => !!activeColorId, [activeColorId])

  const priceWrapperStyles = useMemo(
    () => styles?.priceWrapper?.(isComparablePriceEnabledCategory, isSWOutlet) || {},
    [isComparablePriceEnabledCategory, isSWOutlet]
  )

  const discPercentStyles = useMemo(
    () => styles?.discPercent?.({ isComparablePriceEnabledCategory, isSWOutlet, isKsSur }) || {},
    [isComparablePriceEnabledCategory, isSWOutlet]
  )

  // The pricing object that will serve as source for price calculations.
  const priceSource = useMemo(() => {
    if (!product) {
      return null
    }

    if (product.isServerSide) {
      const defaultVgId = get(product, 'master.defaultVariantGroupID')
      const isMegaPDPEligible = get(product, 'megaPDPEligibleOptions.isMegaPDPEligible', false)
      const productPrice =
        isVariantSelected && isMegaPDPEligible
          ? product?.variationGroup?.find?.(
              (item) =>
                item?.customAttributes?.c_color === activeColorId &&
                item?.masterId === product.masterId
            )
          : isVariantSelected
          ? product?.variationGroup?.find?.(
              (item) => item?.customAttributes?.c_color === activeColorId
            )
          : defaultVgId
          ? product.variationGroup?.find?.((vg) => vg.id === defaultVgId)
          : product?.variationGroup?.find?.((item) => item?.color === product?.defaultColor?.id)
      return get(productPrice, 'pricingInfo[0]')
    }

    const price = get(product, 'promotionPrice[0]', get(product, 'defaultVariant.pricingInfo[0]'))
    const hitType = get(product, 'hitType')
    const masterPrice = get(product, 'masterPromotionPrice.price[0]')

    // This check (get(appData, 'brand') === 'coach-outlet') need to fall back for coach-outlet prices
    // when one product has several variants with different discounts it will cause rendering price range
    // when user click on color swatch for the first time TORO-36544
    // NOTE: for Outlet brand we don't render price range
    if (
      isOutlet ||
      isCategoryEnableForCompPrice ||
      (!isVariantSelected && !isPriceRangeToggleEnabled && hitType === 'master')
    ) {
      // use FRP data
      const variants = get(product, 'variantsOnSale', [])
      const defaultColorId = product?.defaultColor?.id
      const defaultVariantProductId = get(product, 'defaultVariant.productId')
      const productId =
        isComparablePriceValue && product.hitType === 'master' && defaultVariantProductId
          ? defaultVariantProductId
          : product.id
      // product.id is FRP id and we search for it through the variants
      const frp = variants.find((v) => {
        // v.id === product.id - initial solution for headlessjson format
        // v.id.includes(defaultColorId) - works for optimizedheadlessjson format, because of changing format
        return v.id === productId || v.id?.includes(defaultColorId)
      })

      if (frp) {
        return get(frp, 'price')
      }
    }

    /*
     If 'enableSwatchesOnVG' is enabled, the then price displayed intially is the master's price.
     However, once a color is selected, it should use the product's price as it's coming from the
     Headless-GetProductInfo API.
    */
    if (
      !isVariantSelected &&
      !isSearchSuggestionFormat &&
      (hitType === 'variation_group' || hitType === 'product') &&
      masterPrice &&
      product?.enableSwatches &&
      isPriceRangeToggleEnabled
    ) {
      return masterPrice
    }
    if (!price?.discountPercentage && price?.markdownDiscPercent) {
      const productPriceSource = product?.variationGroup?.find?.(
        (item) => item?.color === product?.defaultColor?.id
      )
      const variantPrice = get(productPriceSource, 'variantPrice[0]', false)
      if (variantPrice) {
        return variantPrice
      }
    }
    return price
  }, [product, isVariantSelected, isPriceRangeToggleEnabled, isComparablePriceValue])

  const isDiscounted = useMemo(() => {
    if (!product) {
      return null
    }

    const price = get(product, 'promotionPrice[0]', get(product, 'defaultVariant.pricingInfo[0]'))
    if (!price?.discountPercentage && price?.markdownDiscPercent) {
      const productPriceSource = product?.variationGroup?.find?.(
        (item) => item?.color === product?.defaultColor?.id
      )

      return !!get(productPriceSource, 'variantPrice[0]', false)
    }
    return false
  }, [product])

  const isBundleProduct = useMemo(() => {
    const hitType = get(product, 'hitType')
    const isProductTypeSet = get(product, 'productType.set')
    return hitType === 'set' || !!isProductTypeSet
  }, [product])

  const getSalesPriceFormatted = (priceSource, { isBundleProduct = false } = {}) => {
    if (isBundleProduct && !getSalesPrice(priceSource)) {
      return getListPrice(priceSource, true)
    }

    return getSalesPrice(priceSource, true)
  }

  const getComparableDisplayedPrice = () => {
    let sales = {}
    const type = get(product, 'promotionPrice[0].type')
    if (type === 'range') {
      sales = get(product, 'promotionPrice[0].max.list', {})
    } else {
      sales = get(
        product,
        'promotionPrice[0].sales',
        get(product, 'defaultVariant.pricingInfo[0]', {})
      )
    }
    if (product?.isServerSide) {
      const defaultVgId = get(product, 'master.defaultVariantGroupID')
      const productPriceSource = defaultVgId
        ? product?.variationGroup?.find?.((vg) => vg?.id === defaultVgId)
        : product?.variationGroup?.find?.((item) => item?.color === product?.defaultColor?.id)

      sales = get(productPriceSource, 'pricingInfo[0].sales', {})
    }

    if (
      !displayedPrice ||
      (isBundleProduct && !showBundleListPrice) ||
      (!sales?.value && !sales?.formatted)
    ) {
      return null
    }

    const { isRange, listPriceFormatted } = displayedPrice
    const displayedComparablePrice = isRange ? listPriceFormatted.min : listPriceFormatted

    if (isNil(displayedComparablePrice)) return null

    return displayedComparablePrice
  }

  /*
   The price object that will be used to render the prices.
   When rendering, if only sales price is present, then list price is sales price.
   When rendering, if only list price is present, then sales price is list price.
   This doesn't affect DOH price (promotionalPrice).
  */
  const displayedPrice = useMemo(() => {
    if (!priceSource) {
      return null
    }

    const isRange = get(priceSource, 'type') === 'range'
    /*
     When we have a price type 'range' we have to identify the sales price range and the list price
     range.
     */
    if (isRange) {
      const minDohPrice = getDohPrice(get(priceSource, 'min'))
      const maxDohPrice = getDohPrice(get(priceSource, 'max'))
      const minSalesPrice = getSalesPrice(get(priceSource, 'min'))
      const maxSalesPrice = getSalesPrice(get(priceSource, 'max'))
      const minListPrice = getListPrice(get(priceSource, 'min'))
      const maxListPrice = getListPrice(get(priceSource, 'max'))

      const minDohPriceFormatted = getDohPrice(get(priceSource, 'min'), true)
      const maxDohPriceFormatted = getDohPrice(get(priceSource, 'max'), true)
      const minSalesPriceFormatted = getSalesPrice(get(priceSource, 'min'), true)
      const maxSalesPriceFormatted = getSalesPrice(get(priceSource, 'max'), true)
      const minListPriceFormatted = getListPrice(get(priceSource, 'min'), true)
      const maxListPriceFormatted = getListPrice(get(priceSource, 'max'), true)

      // check against strings, because float comparison is not always accurate
      const isSalesRange =
        !isNil(minSalesPriceFormatted) &&
        !isNil(maxSalesPriceFormatted) &&
        minSalesPriceFormatted !== maxSalesPriceFormatted

      // check against strings, because float comparison is not always accurate
      const isListRange =
        !isNil(minListPriceFormatted) &&
        !isNil(maxListPriceFormatted) &&
        minListPriceFormatted !== maxListPriceFormatted

      return {
        isRange, // true
        isSalesRange,
        isListRange,
        dohPrice: {
          min: minDohPrice,
          max: maxDohPrice,
        },
        salesPrice: {
          min: minSalesPrice,
          max: maxSalesPrice,
        },
        listPrice: {
          min: minListPrice,
          max: maxListPrice,
        },
        dohPriceFormatted: {
          min: minDohPriceFormatted,
          max: maxDohPriceFormatted,
        },
        salesPriceFormatted: {
          min: minSalesPriceFormatted,
          max: maxSalesPriceFormatted,
        },
        listPriceFormatted: {
          min: minListPriceFormatted,
          max: maxListPriceFormatted,
        },
      }
    }

    const dohPrice = getDohPrice(priceSource)
    const salesPrice = getSalesPrice(priceSource)
    const listPrice = getListPrice(priceSource)

    const dohPriceFormatted = getDohPrice(priceSource, true)
    const listPriceFormatted = getListPrice(priceSource, true)
    const salesPriceFormatted = getSalesPriceFormatted(priceSource, { isBundleProduct })

    return {
      isRange, // false
      isSalesRange: false,
      isListRange: false,
      dohPrice,
      salesPrice,
      listPrice,
      dohPriceFormatted,
      salesPriceFormatted,
      listPriceFormatted,
    }
  }, [priceSource])

  const isDiscountSame = useMemo(
    () => get(priceSource, 'maxDiscount.isDiscountSame', false),
    [priceSource]
  )

  const hasPriceRange = useMemo(() => get(priceSource, 'type') === 'range', [priceSource])

  /*
   Should be rendered as it is, without any guards.
   If discount is a valid number, it should always return a valid string with the correct number of
   decimals.
   Otherwise it should return null in order to not be rendered.
  */
  const discount = useMemo(() => {
    if (priceSource) {
      const _discount = get(priceSource, 'maxDiscount.maxDiscount')
      if (!isNil(_discount)) {
        return `${_discount}`
      }
      if (showPromotionalPrice) {
        const _discount = get(priceSource, 'promotionDiscPercent')
        if (!isNil(_discount)) {
          return formatMessage(
            {
              id: 'plp.promotion.discountPercent',
              defaultMessage: 'With {discount}',
            },
            {
              discount: _discount,
            }
          )
        }
      }
      if (hasPriceRange) {
        const _discount = get(priceSource, 'min.discountPercentage')
        if (!isNil(_discount)) {
          return `${_discount}`
        }
      } else {
        const _discount = get(priceSource, 'discountPercentage')
        if (!isNil(_discount)) {
          return `${_discount}`
        } else {
          const _discount = get(priceSource, 'markdownDiscPercent')
          if (!isNil(_discount)) {
            return `${_discount}`
          }
        }
      }
    }

    return null
  }, [product, hasPriceRange, priceSource])

  const markdownPercentDiscount = useMemo(() => {
    if (markdownPriceEnabled && showPromotionalPrice) {
      const _markdownDiscount = get(priceSource, 'markdownDiscPercent')
      if (!isNil(_markdownDiscount)) {
        return `${_markdownDiscount}`
      }
    }
    return null
  }, [hasPriceRange, priceSource])

  const hasDiscount = useMemo(() => !isNil(discount) && discount !== '0', [discount])

  const showStrikeOffPrice = useMemo(() => {
    const variantsOnSale = get(product, 'variantsOnSale', [])
    const enableSwatches = get(product, 'enableSwatches', [])
    const isOnSale = get(product, 'pickedProps.promotionData.isOnSale', false)

    return getShowStrikeOffPrice(
      variantsOnSale,
      isOnSale,
      isHideStrikeOffPriceEnabled,
      isVariantSelected,
      hasDiscount,
      isSearchSuggestionFormat,
      enableSwatches
    )
  }, [
    product,
    isHideStrikeOffPriceEnabled,
    isVariantSelected,
    isSearchSuggestionFormat,
    hasDiscount,
  ])
  const hasDohPromo = useMemo(() => !isNil(get(priceSource, 'promotionalPrice')), [priceSource])
  const customSalePriceColor = hasDiscount ? customCertonaSalePriceColor : {}

  const toDisplayMarkdownPrice =
    markdownPriceEnabled && (hasDiscount || displayedPrice?.isSalesRange)
  const shouldRenderDiscountPercentage = useMemo(() => {
    if (isRecommendation) {
      const recommendationPriceConfig = get(certonaPriceDisplay, 'searchrv1_rr', '')
      const isDiscountPercentageForRecomemndationsDisabled =
        recommendationPriceConfig === CertonaPriceType.SinglePrice ||
        recommendationPriceConfig === CertonaPriceType.ShopGridWODisc

      return !isDiscountPercentageForRecomemndationsDisabled
    }

    if (!isDiscountOffDisabled && hasDiscount) {
      if (isComparablePriceValue) {
        return !isSearchSuggestionFormat
      }
      return true
    }
    return false
  }, [
    isDiscountOffDisabled,
    hasDiscount,
    isComparablePriceValue,
    isSearchSuggestionFormat,
    isRecommendation,
    certonaPriceDisplay,
  ])

  const showRed = useMemo(() => {
    const shouldRenderDiscountPercentageInUI =
      !hasDohPromo &&
      shouldRenderDiscountPercentage &&
      (!isBundleProduct || (isBundleProduct && isComparablePriceValue && showBundleListPrice)) &&
      !hideDiscountedRate
    const shouldRenderComparableValuePriceInUI =
      isComparablePriceValue && hasDiscount && !isSearchSuggestionFormat && !hideComparablePrice
    if (
      isOutlet &&
      isCategoryEnableForCompPrice &&
      markdownPriceEnabled &&
      !shouldRenderDiscountPercentageInUI &&
      !shouldRenderComparableValuePriceInUI &&
      !isSearchSuggestion
    ) {
      return false
    } else {
      return toDisplayMarkdownPrice && !hideListPriceValue
    }
  }, [
    appData,
    toDisplayMarkdownPrice,
    hasDohPromo,
    shouldRenderDiscountPercentage,
    isBundleProduct,
    isComparablePriceValue,
    showBundleListPrice,
    hasDiscount,
    isSearchSuggestionFormat,
    hideListPriceValue,
  ])

  const textProps = useMemo(
    () => ({
      as: 'span',
      variant: 'body-text-secondary',
      size: 'md',
      ...styles.mainPrice({ showRed }),
    }),
    [theme, showRed]
  )

  const strikethroughTextProps = useMemo(
    () => ({
      color: theme.colors.main.gray,
      textDecoration: 'line-through',
      ml: theme.space.s,
      ...textProps,
    }),
    [theme, textProps]
  )

  const comparableValueTextProps = useMemo(
    () => ({
      ...textProps,
      size: 'sm',
      color: theme.colors.neutral.dark,
    }),
    [theme, textProps]
  )

  const outletTextProps = useMemo(
    () => ({
      ...textProps,
      size: isSearchSuggestionFormat ? 'sm' : 'xl',
    }),
    [textProps, isSearchSuggestionFormat]
  )

  const discountPercentageTextProps = useMemo(() => {
    if (isComparablePriceValue) {
      return {
        ...textProps,
        color: theme.colors.main.saleRed,
        size: 'sm',
        ml: 's',
      }
    }

    return {
      ...textProps,
      color: theme.colors.main.gray,
    }
  }, [textProps, theme, isComparablePriceValue])

  const salesPriceTextProps = useMemo(() => {
    const formattedPromoPrice = get(displayedPrice, 'dohPriceFormatted')

    if (!isNil(formattedPromoPrice)) {
      return {
        ...strikethroughTextProps,
        ...{
          ml: showPromotionalPrice ? theme.space.xs : 0,
          mr: showPromotionalPrice ? 0 : theme.space.xs,
          pt: theme.space.xs,
        },
      }
    }

    if (isComparablePriceValue) {
      if (hasDiscount && showRed) {
        return {
          ...outletTextProps,
          color: theme.colors.main.saleRed,
        }
      }
      return outletTextProps
    }

    return textProps
  }, [
    textProps,
    strikethroughTextProps,
    outletTextProps,
    theme,
    displayedPrice,
    isComparablePriceValue,
    hasDiscount,
  ])

  // TODO: revisit this to see if we can clean up the logic for discount formatting
  const formattedDiscount = useMemo(() => {
    if (!hasDiscount) {
      return null
    }

    if (isComparablePriceValue) {
      return formatMessage(
        {
          id: 'plp.price.discount',
          defaultMessage: `({discount}% off)`,
        },
        { discount }
      )
    }

    if (isSearchSuggestionFormat) {
      if (hasPriceRange) {
        return formatMessage(
          {
            id: 'plp.price.uptodiscount',
            defaultMessage: `(Up to {discount}%)`,
          },
          { discount }
        )
      }
      return `(${discount}%)`
    }

    if (isDiscountSame || (!hasPriceRange && !displayedPrice.isSalesRange)) {
      return formatMessage(
        {
          id: 'plp.price.discount',
          defaultMessage: isSW ? `({discount}%)` : `{discount}% off`,
        },
        { discount }
      )
    }

    return formatMessage(
      {
        id: 'plp.price.uptodiscount',
        defaultMessage: `(Up to {discount}%)`,
      },
      { discount }
    )
  }, [
    hasDiscount,
    isDiscountSame,
    hasPriceRange,
    displayedPrice,
    isSearchSuggestionFormat,
    isComparablePriceValue,
    discount,
  ])

  const renderComparableValuePrice = () => {
    const displayedComparablePrice = getComparableDisplayedPrice()

    if (isNil(displayedComparablePrice)) return null

    return (
      <Flex
        className={productTileSections.comparablePrice.contentClass}
        data-qa="wrapper_comparable_value"
        sx={styles.comparablePriceWrapper}
      >
        <Text
          data-qa="txt_comparable_value"
          {...comparableValueTextProps}
          mr="4px"
          sx={styles.comparablePriceTheme?.(isSWOutlet)}
        >
          {formatMessage({ id: 'plp.price.comparablevalue', defaultMessage: 'Comparable Value' })}
        </Text>
        <Text
          data-qa="txt_comparable_value_price"
          {...comparableValueTextProps}
          sx={styles.comparablePriceTheme?.(isSWOutlet)}
        >
          {displayedComparablePrice}
        </Text>
      </Flex>
    )
  }

  const comparableText = get(product, 'promotionPrice[0].listPriceCaption', '')

  const showBundleListPriceCaption = useMemo(() => {
    if (displayedPrice?.listPriceFormatted === displayedPrice?.salesPriceFormatted) {
      return false
    }
    return isBundleProduct && showBundleListPrice
  }, [isBundleProduct, showBundleListPrice])

  const renderBundleListPriceCaption = () => {
    if (!comparableText) return null
    return (
      <Flex
        className="comparablePriceWrapper"
        data-qa="wrapper_comparable_value"
        sx={styles.comparablePriceWrapper}
      >
        <Text
          data-qa="txt_comparable_value"
          {...comparableValueTextProps}
          mr="4px"
          sx={styles.comparablePriceTheme()}
        >
          {comparableText}
        </Text>
        <Text
          data-qa="txt_comparable_value_price"
          {...comparableValueTextProps}
          sx={styles.comparablePriceTheme()}
        >
          {displayedPrice &&
            !isNil(displayedPrice?.listPriceFormatted) &&
            displayedPrice?.listPriceFormatted}
        </Text>
      </Flex>
    )
  }

  const renderDiscountPercentage = useCallback(() => {
    if (!formattedDiscount) {
      return null
    }

    if (hideDiscountPercentageOnPLP && enhancedPlp) {
      return null
    }

    return (
      <Text
        {...discountPercentageTextProps}
        sx={{ ...styles.prices, ...discPercentStyles }}
        data-qa="cm_txt_pdt_price_dpercent"
      >
        {formattedDiscount}
      </Text>
    )
  }, [formattedDiscount, discountPercentageTextProps, enhancedPlp])

  const renderSalesPriceWithoutRange = () => {
    if (!displayedPrice || displayedPrice.isRange) {
      return null
    }

    const formattedPrice = get(displayedPrice, 'salesPriceFormatted')
    const qa = hasDiscount ? 'm_plp_txt_pt_price_upper_rl' : 'cm_txt_pdt_price'
    const textStyles =
      showMarkPriceAndPercInSS && hasDohPromo
        ? { ...styles.prices, ...(hasDohPromo ? {} : styles.fullWidth) }
        : styles.prices
    return (
      <Text
        className={`salesPrice ${hasDohPromo && 'dohPrice'} ${hasDiscount && 'hasDiscount'}`}
        sx={{
          ...textStyles,
          ...(hideListPriceValue ? {} : customSalePriceColor),
        }}
        {...salesPriceTextProps}
        data-qa={qa}
      >
        {!isNil(formattedPrice) && formattedPrice}{' '}
        {showMarkPriceAndPercInSS &&
          hasDohPromo &&
          !isNil(markdownPercentDiscount) &&
          `(${markdownPercentDiscount}% off)`}
      </Text>
    )
  }

  const renderBundleDiscount = () => (
    <Text {...textProps} ml="s" color={theme.colors.main.gray} data-qa="cm_txt_pdt_price_dpercent">
      {`${discount}%`}
    </Text>
  )

  const renderBundlePrice = () => {
    if (
      isLegacyPlp &&
      (!showBundleListPrice ||
        !product?.custom?.c_bundlePrice ||
        !displayedPrice ||
        (!!comparableText && isComparablePriceValue))
    ) {
      return null
    }
    if (!isLegacyPlp) {
      const { salesPriceFormatted, listPriceFormatted, salesPrice, listPrice } = displayedPrice
      const isRenderBundlePrice = showBundleListPrice && listPrice && salesPrice
      const showDiscount =
        (isOutlet || (isKateSpadeOutlet && showBundleListPrice)) &&
        shouldRenderDiscountPercentage &&
        salesPrice &&
        (!hideDiscountedRate || isDiscounted)
      return isOutlet || isKateSpadeOutlet ? (
        <Text
          sx={styles.prices}
          className={isKateSpadeOutlet ? 'ksOutletBundlePrice' : ''}
          {...salesPriceTextProps}
        >
          {isRenderBundlePrice && !isSearchSuggestion && (
            <Flex justifyContent={isPlpV3 ? 'center' : null}>
              <Text
                as="span"
                sx={{ ...styles.bundleListPriceCaption, marginLeft: 0 }}
                className={`bundle-comparable-price ${
                  isKateSpadeOutlet ? ' ksOutletBundlePriceCaption' : ''
                }`}
              >
                {comparableText} {listPriceFormatted}
              </Text>
            </Flex>
          )}
          <Flex
            className={`bundlePriceContent ${showDiscount ? 'bundlePriceContentWithDiscount' : ''}`}
            justifyContent={isPlpV3 ? 'center' : null}
            mt={isPlpV3 && !isRenderBundlePrice ? '18px' : '0'}
          >
            <span>{salesPrice ? salesPriceFormatted : listPriceFormatted}</span>
            {showDiscount && renderDiscountPercentage()}
          </Flex>
        </Text>
      ) : (
        <Text sx={styles.prices} {...salesPriceTextProps}>
          <span>{salesPrice ? salesPriceFormatted : listPriceFormatted}</span>
          {showBundleListPrice && listPrice && salesPrice && (
            <Box as="span" sx={styles.bundleListPriceCaption}>
              {comparableText} {listPriceFormatted}
            </Box>
          )}
        </Text>
      )
    }
    const { isListRange, isRange, listPriceFormatted } = displayedPrice
    const displayedBundlePrice = isRange ? listPriceFormatted.min : listPriceFormatted
    /*
     If the price type is 'range', but the min and max of list price are the same, then technically
     we don't have a price range to show, so we just show the min list price.
     If the price type is not 'range', then we show the list price as it is.
     */
    return (
      <>
        <Text
          {...strikethroughTextProps}
          className="strikethroughListPrice"
          sx={discPercentStyles}
          data-qa="cm_txt_pdt_price_strthr"
        >
          {!isNil(displayedBundlePrice) && displayedBundlePrice}
        </Text>
        {isListRange && (
          <>
            <Text {...strikethroughTextProps}>&nbsp;-&nbsp;</Text>
            <Text
              {...strikethroughTextProps}
              className="strikethroughListPrice"
              data-qa="cm_txt_pdt_price_strthr"
            >
              {!isNil(listPriceFormatted.max) && listPriceFormatted.max}
            </Text>
          </>
        )}
        {isLegacyPlp && !isDiscountOffDisabled && hasDiscount && renderBundleDiscount()}
      </>
    )
  }

  const renderSalesPrice = () => {
    if (!displayedPrice) {
      return null
    }
    const { isSalesRange, salesPriceFormatted } = displayedPrice

    if (displayedPrice.isRange) {
      return (
        <>
          <Text
            className="priceRange"
            sx={
              isSalesRange || variant === 'plpV3'
                ? { ...styles.prices, ...customSalePriceColor }
                : { ...styles.sameRangePrice, ...customSalePriceColor }
            }
            {...textProps}
            data-qa="cm_txt_pdt_price_lower_rl"
          >
            {!isNil(salesPriceFormatted.min) && salesPriceFormatted.min}
          </Text>
          {isSalesRange && (
            <>
              <Text
                className="priceRange"
                sx={{ ...styles.prices, ...customSalePriceColor }}
                {...textProps}
              >
                &nbsp;-&nbsp;
              </Text>
              <Text
                className="priceRange"
                sx={{ ...styles.prices, ...customSalePriceColor }}
                {...textProps}
                data-qa="cm_txt_pdt_price_upper_rl"
              >
                {!isNil(salesPriceFormatted.max) && salesPriceFormatted.max}
              </Text>
            </>
          )}
        </>
      )
    }

    return renderSalesPriceWithoutRange()
  }

  const renderListPrice = () => {
    if (!displayedPrice) {
      return null
    }
    const { isRange, isListRange, listPriceFormatted } = displayedPrice
    const displayedListPrice = isRange ? listPriceFormatted.min : listPriceFormatted
    /*
     If the price type is 'range', but the min and max of list price are the same, then technically
     we don't have a price range to show, so we just show the min list price.
     If the price type is not 'range', then we show the list price as it is.
     */
    return (
      <>
        <Text
          {...strikethroughTextProps}
          className="strikethroughListPrice"
          data-qa="cm_txt_pdt_price_strthr"
          sx={
            isListRange && isRange
              ? {}
              : {
                  ...styles.prices,
                  ...discPercentStyles,
                  ...styles.strikethroughListPriceText,
                }
          }
        >
          {!isNil(displayedListPrice) && displayedListPrice}
        </Text>
        {isListRange && (
          <>
            <Text sx={styles.removeStrikethroughTextProps} {...strikethroughTextProps}>
              &nbsp;-&nbsp;
            </Text>
            <Text
              {...strikethroughTextProps}
              className="strikethroughListPrice"
              mr={theme.space.s}
              data-qa="cm_txt_pdt_price_strthr"
            >
              {!isNil(listPriceFormatted.max) && listPriceFormatted.max}
            </Text>
          </>
        )}
      </>
    )
  }

  const renderDOHPromo = () => {
    return (
      <>
        <Text {...textProps} data-qa="m_plp_txt_pt_price_upper_rl" sx={styles.dohPromoPrice}>
          {/*{ TODO: revisit after the changes in TM-9373; can DOH have a price range? }*/}
          {!isPlainObject(displayedPrice.dohPriceFormatted) &&
            !isNil(displayedPrice.dohPriceFormatted) &&
            displayedPrice.dohPriceFormatted}
        </Text>
        {showPromotionalPrice && renderSalesPrice()}
        {!isDiscountOffDisabled && hasDiscount && (
          <Text
            {...textProps}
            data-qa="cm_txt_pdt_price_dpercent"
            className="discount-percentage"
            sx={styles.dohPromoPricePercentage}
          >
            {formatMessage(
              {
                id: 'plp.price.discount',
                defaultMessage: `({discount}%)`,
              },
              { discount }
            )}
          </Text>
        )}
      </>
    )
  }

  const displayedComparablePrice = getComparableDisplayedPrice()

  const isRenderComparablePriceValue =
    isComparablePriceValue &&
    hasDiscount &&
    !isSearchSuggestionFormat &&
    !hideComparablePrice &&
    !isBundleProduct &&
    displayedComparablePrice &&
    !showOnlySinglePrice

  return (
    <Flex
      flexWrap="wrap"
      justifyContent={
        isComparablePriceValue && isSearchSuggestionFormat && isDesktop ? 'center' : 'start'
      }
      flexDirection="column"
      data-qa="search_suggestion_pricing_wrapper"
      className={`pricing-wrapper ${isRenderComparablePriceValue ? 'with-comparable-price' : ''}`}
      sx={{
        ...priceWrapperStyles,
        ...(isKsSur ? styles.kssPriceWrapper : {}),
      }}
      mt={isPlpV3 && isBundleProduct && !isSearchSuggestion ? '46px' : null}
    >
      <Box className={productTileSections.comparablePrice.containerClass}>
        {isRenderComparablePriceValue && renderComparableValuePrice()}
      </Box>
      <>
        {!isPlpV3 &&
          showBundleListPriceCaption &&
          isComparablePriceValue &&
          renderBundleListPriceCaption()}

        <Flex
          className="salePriceWrapper"
          data-qa={isPlpV3 && isBundleProduct ? 'salePriceWrapper' : null}
          sx={{ ...styles.renderSalePriceWrapper }}
        >
          <>
            {(showMarkPriceAndPercInSS || !hasDohPromo) &&
            (isLegacyPlp || (!isLegacyPlp && !isBundleProduct))
              ? renderSalesPrice()
              : null}
            {isBundleProduct &&
              ((isLegacyPlp && !isComparablePriceValue) || !isLegacyPlp) &&
              renderBundlePrice()}
            {!hasDohPromo ? (
              <>
                {showStrikeOffPrice &&
                  !isBundleProduct &&
                  !isComparablePriceValue &&
                  !hideListPriceValue &&
                  renderListPrice()}
                {shouldRenderDiscountPercentage &&
                  (!isBundleProduct ||
                    (isBundleProduct &&
                      isComparablePriceValue &&
                      showBundleListPrice &&
                      isLegacyPlp)) &&
                  (!hideDiscountedRate || isDiscounted) &&
                  !showOnlySinglePrice &&
                  renderDiscountPercentage()}
              </>
            ) : (
              renderDOHPromo()
            )}
          </>
        </Flex>
      </>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(memo(Price))
