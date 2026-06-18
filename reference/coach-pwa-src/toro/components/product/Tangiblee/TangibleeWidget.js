import React, { useContext, useMemo, useCallback } from 'react'
import Box from 'toro/components/Box'
import {
  openModal,
  getTangibleeCta,
  TANGIBLEE_MODE,
  TANGIBLEE_EXPERIENCE,
} from 'toro/helpers/tangibleeHelper'
import { getFormattedPrices } from 'toro/helpers/skuHelper'
import { Flex } from '@chakra-ui/layout'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useAtomValue } from 'jotai/utils'
import { priceGroupAtom, productPriceGroupAtom } from 'store/pdp.atom'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import usePreference from 'toro/hooks/usePreference_new'
import isCA from 'toro/helpers/isCA'
import isObject from 'lodash/isObject'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

function TangibleeWidget({
  skuId,
  productData,
  tangibleeData,
  variantData,
  rulerIconSrc = undefined,
  isCloserLookArea = undefined,
  onHeroImage = false,
  variant,
  hideComparablePriceValue,
  onVpdCards = false,
}) {
  const { formatMessage } = useIntl()
  const tangibleeCTATextGroup = useMemo(() => getTangibleeCta(formatMessage), [])
  const styles = useMultiStyleConfig('TangibleeWidget', {
    variant,
  })
  const { BagSizeCompare, PlusIcon } = useMultiStyleConfig('Icons')
  const { send } = useAnalytics()
  const { isMobile } = useViewportType()
  const { appData, injectScriptOnce } = useContext(PWAContext)
  const priceGroup = useAtomValue(priceGroupAtom)
  const productPriceGroup = useAtomValue(productPriceGroupAtom)
  const {
    tangiblee: { BRAND_URL, TANGIBLEE_INTEGRATION_SCRIPT: scriptSrc, enableStrategicTangiblee },
  } = usePreference({
    Tangiblee: ['TANGIBLEE_INTEGRATION_SCRIPT', 'BRAND_URL', 'enableStrategicTangiblee'],
  })
  const enableStrategicTangibleeMobile = enableStrategicTangiblee && isMobile
  const brand = get(appData, 'brand')
  const locale = get(appData, 'locale')
  const defaultVariantId = get(productData, 'defaultVariant.id')
  const { locale: currentLocale, currencySymbol: currency } = getCurrentLocale(
    locale.replace(/_/g, '-')
  )
  const isCanada = isCA()
  const domain = isObject(BRAND_URL)
    ? BRAND_URL[currentLocale]
    : isCanada
    ? `${BRAND_URL}/${locale}`
    : BRAND_URL
  const isKateSpade = brand === 'kate-spade'
  const isPDPv5Variant = useTemplate([TemplateName.pdpv5])
  const tangibleeStyle = onHeroImage
    ? styles.tangibleeHeroImage({
        isMobile,
        isCloserLookArea,
      })
    : {}

  const tangibleeCTAText = useMemo(() => {
    const filterCategory = get(productData, 'custom.c_filterCategory', '')?.split?.(' ')

    const primaryCategoryIdArray =
      (
        get(productData, 'category_id', '') ||
        get(productData, 'masterProductData.primaryCategoryId', '')
      )
        ?.toLowerCase()
        ?.split('-') || []

    const containsBagCategory =
      primaryCategoryIdArray &&
      Array.isArray(primaryCategoryIdArray) &&
      primaryCategoryIdArray.find((item) => item?.includes('bag'))

    const tangibleeTextConstraints =
      isKateSpade && !onHeroImage && !onVpdCards && containsBagCategory

    let tangibleeText = ''
    if (filterCategory.length) {
      tangibleeCTATextGroup.forEach((group) => {
        const keys = Object.keys(group)
        filterCategory.forEach((text) => {
          tangibleeText = keys?.includes?.(text?.toLowerCase?.()) ? group[keys[0]] : tangibleeText
        })
      })
    }

    if (!tangibleeText) {
      for (let item of tangibleeCTATextGroup) {
        const keys = Object.keys(item)
        const text = keys?.[0]
        if (primaryCategoryIdArray?.includes?.(text)) {
          tangibleeText = item[text]
        }
      }
    }
    if (!tangibleeText) {
      tangibleeText = formatMessage({
        id: 'pdp.tangiblee.defaultText',
        defaultMessage: 'Product',
      })
    }
    return tangibleeTextConstraints
      ? formatMessage({
          id: 'pdp.tangiblee.whatFitsInside',
          defaultMessage: 'What Fits Inside',
        })
      : formatMessage(
          {
            id: 'pdp.tangiblee.seeProductSize',
            defaultMessage: `See ${tangibleeText} Size`,
          },
          { tangibleeText }
        )
  }, [productData?.id, onHeroImage])

  const onTangibleeBtnClick = useCallback(async () => {
    if (!scriptSrc) {
      return
    }

    await injectScriptOnce(scriptSrc)

    send('productInteraction', {
      eventLocation: 'product',
      eventAction: `${tangibleeCTAText?.toLowerCase()} click`,
      eventLabel: variantData?.id || defaultVariantId,
    })

    const fallbackPriceGroup =
      productPriceGroup && (productPriceGroup.salePrice || productPriceGroup.listPrice)
        ? productPriceGroup
        : priceGroup
    const priceGroupToUse = isPDPv5Variant ? productPriceGroup : fallbackPriceGroup

    const { price, discountedPrice } = getFormattedPrices(priceGroupToUse)

    window.tangibleeCTA = onHeroImage ? 'onImage' : 'productDetails'
    openModal(tangibleeData, domain, {
      sku: skuId,
      price,
      currency,
      discountedPrice: !hideComparablePriceValue && discountedPrice,
      inStock: variantData?.orderable,
      // when tangiblee strategic is disabled we do NOT want to pass mode and experience values to tangiblee script.
      mode: enableStrategicTangibleeMobile ? TANGIBLEE_MODE.PRODUCT : undefined,
      experience: enableStrategicTangibleeMobile ? TANGIBLEE_EXPERIENCE.COMPARE : undefined,
    })
  }, [
    variantData?.id,
    defaultVariantId,
    skuId,
    variantData?.orderable,
    tangibleeCTAText,
    priceGroup,
  ])

  const RulerImg = () => {
    const className = onHeroImage ? 'tangiblee-cta_ruler--heropdp' : 'tangiblee-cta_ruler--details'
    const style = styles.tangibleImage
    return BagSizeCompare ? (
      <Box sx={style} className={className}>
        <BagSizeCompare {...styles.tangibleIcon} />
      </Box>
    ) : (
      <Image src={rulerIconSrc ?? styles.rulerIconSrc} className={className} sx={style} />
    )
  }

  const dataPlacement = isMobile || !onHeroImage ? 'product details' : 'hero image carousel'

  return (
    <Box minH={!isMobile && '18px'} {...tangibleeStyle} sx={styles.tangibleWrapper()}>
      <Box
        as="span"
        className="tangiblee-cta"
        data-qa="pdp_btn_tangiblee_cta"
        data-cta-type="tangiblee"
        data-placement={dataPlacement}
        onClick={onTangibleeBtnClick}
        cursor="pointer"
        sx={styles.tangibleeContainer()}
      >
        <Flex display="flex" alignItems="center" sx={styles.tangibleeButtonContent}>
          <RulerImg />
          <Box
            className={`tangiblee-cta_title${onHeroImage ? '' : '--details'}`}
            as="span"
            position="relative"
            display="inline"
            data-cta-title={tangibleeCTAText.toLowerCase().replaceAll(' ', '_')}
            sx={styles.tangibleeTitle(onHeroImage)}
          >
            {tangibleeCTAText}
          </Box>
          {(variant === 'buttonCTA' || isPDPv5Variant) && (
            <PlusIcon width="14px" height="14px" className="plusIcon" />
          )}
        </Flex>
      </Box>
    </Box>
  )
}

TangibleeWidget.propTypes = {
  skuId: PropTypes.string,
  productData: PropTypes.object,
  tangibleeData: PropTypes.object,
  variantData: PropTypes.object,
  pageType: PropTypes.string,
  rulerIconSrc: PropTypes.string,
}

export default withErrorBoundaryWrapper(
  withFeatureFlag(TangibleeWidget, { Tangiblee: ['IS_TANGIBLEE_ENABLED'] })
)
